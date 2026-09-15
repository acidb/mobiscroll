/* eslint-disable no-console */
// Builds one of the lite packages (react, vue, javascript, jquery). Angular has
// its own build-angular.js since it needs ngc (AOT) instead of plain tsc.
const execSync = require("child_process").execSync;
const path = require("path");
const babel = require("@rollup/plugin-babel").default;
const resolve = require("@rollup/plugin-node-resolve").nodeResolve;
const replace = require("@rollup/plugin-replace");
const terser = require("@rollup/plugin-terser");
const autoprefixer = require("autoprefixer");
const fse = require("fs-extra");
const removeEmptyDirectories = require("remove-empty-directories");
const rollup = require("rollup");
const postcss = require("rollup-plugin-postcss");
const bundleScss = require("./lib/rollup-plugin-bundle-scss").bundleScss;
const util = require("./util");

const getFiles = util.getFiles;
const resolveFrameworkAlias = util.resolveFrameworkAlias;

const fw = process.argv.length > 2 ? process.argv[2] : "jquery";
const outPath = fw;
const tempDir = "dist/" + outPath + "/src";
const startTime = new Date();

const scssOutputPath = path.join(
  process.cwd(),
  "packages/" + outPath + "/dist/css/mobiscroll.scss"
);
const esmOutputFile = "packages/" + outPath + "/dist/mobiscroll." + fw + ".js";

let external = [];
let globals = {};
let babelOptions = {
  babelHelpers: "bundled",
  include: tempDir + "/preact/lib/**",
  presets: [["@babel/preset-env", { loose: true, modules: false }]],
};

if (fw === "jquery") {
  external = ["jquery"];
  globals = { jquery: "jQuery" };
} else if (fw === "react") {
  external = ["react", "react-dom"];
  globals = { react: "React", "react-dom": "ReactDOM" };
} else if (fw === "vue") {
  external = ["vue"];
  globals = { vue: "vue" };
  babelOptions = {
    babelHelpers: "bundled",
    plugins: ["@vue/babel-plugin-jsx"],
  };
}

let taskTime = new Date();

console.info("Creating " + outPath + " package...");
console.info("------------------------------");
console.info("Copy source...");

fse.emptyDirSync(tempDir);
fse.emptyDirSync("packages/" + outPath + "/dist");

fse.copySync("src/core", tempDir + "/core");
fse.copySync("src/i18n", tempDir + "/i18n");
fse.copySync("src/icons", tempDir + "/icons");
fse.copySync("src/" + fw, tempDir + "/" + fw);
if (fw === "jquery" || fw === "javascript") {
  fse.copySync("src/preact", tempDir + "/preact");
}

// Convert to legacy syntax for the SCSS bundle step, the plugin does not support @use
getFiles(tempDir).forEach((filePath) =>
  util.convertScssImportsToLegacy(filePath)
);

// Strip directive decorators and resolve @framework aliases
getFiles(tempDir).forEach((filePath) => {
  if (/.+\.tsx?$/.test(filePath)) {
    let fileContent = fse.readFileSync(filePath, "utf8");
    fileContent = fileContent.replace(/@Directive\([^)]*\)/g, "");
    fileContent = fileContent.replace(
      /import { Directive } from '@angular\/core';/g,
      ""
    );
    fileContent = fileContent.replace(
      /import { IDirectiveType } from '@framework\/base';/g,
      ""
    );
    fileContent = resolveFrameworkAlias(
      tempDir,
      filePath,
      fileContent,
      fw === "jquery" || fw === "javascript" ? "preact" : fw
    );
    fse.writeFileSync(filePath, fileContent, "utf8");
  }
});

console.info("Copy ready. Time: " + (new Date() - taskTime) + "ms");
taskTime = new Date();
console.info("------------------------------");

console.info("Compile typescript...");
execSync(
  path.normalize("node_modules/.bin/tsc") +
    " -p " +
    tempDir +
    "/" +
    fw +
    "/tsconfig.json"
);
console.info("Compile ready. Time: " + (new Date() - taskTime) + "ms");
taskTime = new Date();
console.info("------------------------------");

console.info("Create bundle...");
rollup
  .rollup({
    external: external,
    input: tempDir + "/" + fw + "/bundle-esm.js",
    plugins: [
      resolve({ extensions: [".js", ".jsx"] }),
      babel(babelOptions),
      bundleScss({ output: "css/mobiscroll.scss" }),
      postcss({
        extract: "css/mobiscroll.min.css",
        minimize: true,
        plugins: [autoprefixer()],
        use: { sass: { silenceDeprecations: ["import", "legacy-js-api"] } },
      }),
      replace({
        delimiters: ["", ""],
        preventAssignment: true,
        "/** @class */": "/*#__PURE__*/",
      }),
    ],
  })
  .then((bundle) => {
    console.info("Create scss bundle entry file...");
    const modules = bundle.cache.modules;
    const scssFiles = [];
    for (let i = 0; i < modules.length; i++) {
      const m = modules[i];
      if (/\.scss$/.test(m.id)) {
        const rel = path
          .relative(path.dirname(scssOutputPath), m.id)
          .replace(/\\/g, "/");
        const importPath = rel.startsWith(".") ? rel : "./" + rel;
        scssFiles.push(`@import "${importPath}";`);
      }
    }
    fse.mkdirSync(path.dirname(scssOutputPath), { recursive: true });
    fse.writeFileSync(scssOutputPath, scssFiles.join("\n"));
    return bundle;
  })
  .then((bundle) => {
    console.info("Bundle ready. Time: " + (new Date() - taskTime) + "ms");
    taskTime = new Date();
    console.info("------------------------------");
    console.info("Write unminified bundle...");
    return bundle.write({
      file: esmOutputFile,
      format: "es",
      globals: globals,
      name: "mobiscroll",
    });
  })
  .then(() => {
    util.cleanSassUseDirectives(scssOutputPath);
    console.info("Write ready. Time: " + (new Date() - taskTime) + "ms");
    taskTime = new Date();
    console.info("------------------------------");
    console.info("Create minified ESM bundle...");
    return rollup.rollup({
      external: external,
      input: esmOutputFile,
      plugins: [
        terser({
          format: {
            comments: "/#__PURE__/",
            preamble: "/* eslint-disable */",
            preserve_annotations: true,
          },
        }),
      ],
    });
  })
  .then((bundle) => {
    console.info("Bundle ready. Time: " + (new Date() - taskTime) + "ms");
    taskTime = new Date();
    console.info("------------------------------");
    console.info("Write ESM bundle...");
    return bundle.write({
      file: "packages/" + outPath + "/dist/esm5/mobiscroll." + fw + ".min.mjs",
      format: "es",
      globals: globals,
    });
  })
  .then(() => {
    console.info("Write ready. Time: " + (new Date() - taskTime) + "ms");
    taskTime = new Date();
    console.info("------------------------------");
    console.info("Create UMD bundle...");
    return rollup.rollup({
      external: external,
      input: esmOutputFile,
      plugins: [
        terser({
          format: {
            comments: false,
            preamble: "/* eslint-disable */",
          },
        }),
      ],
    });
  })
  .then((bundle) => {
    console.info("Bundle ready. Time: " + (new Date() - taskTime) + "ms");
    taskTime = new Date();
    console.info("------------------------------");
    console.info("Write UMD bundle...");
    return bundle.write({
      format: "umd",
      name: "mobiscroll",
      globals: globals,
      file: "packages/" + outPath + "/dist/js/mobiscroll." + fw + ".min.cjs",
    });
  })
  .then(() => {
    console.info("Write ready. Time: " + (new Date() - taskTime) + "ms");
    taskTime = new Date();
    console.info("------------------------------");
    console.info("Copy .d.ts files...");
    fse.writeFileSync(
      "packages/" + outPath + "/dist/esm5/mobiscroll." + fw + ".min.d.ts",
      "export * from '../src/" + fw + "/bundle.d.ts';",
      "utf8"
    );
    fse.copyFileSync(
      "packages/" + outPath + "/dist/esm5/mobiscroll." + fw + ".min.d.ts",
      "packages/" + outPath + "/dist/js/mobiscroll." + fw + ".min.d.ts"
    );
    return fse.copy(tempDir, "packages/" + outPath + "/dist/src", {
      filter: function (src) {
        return path.extname(src) === "" || /.*\.d\.ts$/.test(src);
      },
    });
  })
  .then(() => {
    console.info(
      "Copy .d.ts files ready. Time: " + (new Date() - taskTime) + "ms"
    );
    removeEmptyDirectories("packages/" + outPath + "/dist/src");
    console.info("------------------------------");
    console.info(
      "Great success! Total time: " + (new Date() - startTime) + "ms"
    );
  })
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
