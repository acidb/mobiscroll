/* eslint-disable no-console */
// Builds the angular-lite package via ngc (Ivy, partial compilation).
const execSync = require("child_process").execSync;
const fs = require("fs");
const path = require("path");

const resolve = require("@rollup/plugin-node-resolve").nodeResolve;
const replace = require("@rollup/plugin-replace");
const terser = require("@rollup/plugin-terser");
const autoprefixer = require("autoprefixer");
const fse = require("fs-extra");
const rollup = require("rollup");
const postcss = require("rollup-plugin-postcss");

const bundleScss = require("./lib/rollup-plugin-bundle-scss").bundleScss;
const util = require("./util");

const getFiles = util.getFiles;
const resolveFrameworkAlias = util.resolveFrameworkAlias;

const outDir = "dist/angular";
const pkgDir = "packages/angular";
const flatModuleName = "mobiscroll.angular.min";
const angularExternals = [
  "@angular/core",
  "@angular/forms",
  "@angular/common",
  "@angular/platform-browser",
];
const angularGlobals = {
  "@angular/core": "angularCore",
  "@angular/forms": "angularForms",
  "@angular/common": "angularCommon",
  "@angular/platform-browser": "angularPlatformBrowser",
};

fse.emptyDirSync(outDir + "/dist");
fse.emptyDirSync(outDir + "/src");
fse.emptyDirSync(outDir + "/bundle");
fse.emptyDirSync(pkgDir + "/dist");

// Copy source
fse.copySync("src/angular", outDir + "/src/angular");
fse.copySync("src/core", outDir + "/src/core");
fse.copySync("src/i18n", outDir + "/src/i18n");
fse.copySync("src/icons", outDir + "/src/icons");
fse.copySync(pkgDir + "/tsconfig.json", outDir + "/tsconfig.json");
fse.writeFileSync(
  outDir + "/src/public_api.ts",
  "export * from './angular/bundle';\n",
  "utf8"
);

// Convert to legacy syntax for the SCSS bundle step, the plugin does not support @use
getFiles(outDir + "/src").forEach((filePath) =>
  util.convertScssImportsToLegacy(filePath)
);

// Resolve @framework aliases and strip Angular styleUrls (ngc's flat-module bundling can't follow them)
getFiles(outDir + "/src").forEach((filePath) => {
  if (/.+\.ts$/.test(filePath)) {
    let fileContent = fs.readFileSync(filePath, "utf8");
    fileContent = resolveFrameworkAlias(
      outDir + "/src",
      filePath,
      fileContent,
      "angular"
    );
    fileContent = removeStyleUrls(fileContent);
    fs.writeFileSync(filePath, fileContent, "utf8");
  }
});

// Angular's bundle.ts doesn't import the shared component/theme styles directly
// (unlike react/vue/javascript/jquery, which get them via core/bundle.ts) - inject them here.
const data = fs.readFileSync(outDir + "/src/angular/bundle.ts", "utf8");
const content =
  "import '../core/components/grid-layout/grid-layout.scss';\n" +
  "import '../core/components/notifications/notifications.scss';\n" +
  "import '../core/custom-themes.scss';\n" +
  "import '../core/icons.scss';\n" +
  data;
fs.writeFileSync(outDir + "/src/angular/bundle.ts", content, "utf8");

console.info("Run ngc build...");
execSync(
  '"' +
    path.normalize("node_modules/.bin/ngc") +
    '" -p ' +
    outDir +
    "/tsconfig.json"
);

console.info("Create ESM bundle...");
const cwd = path.join(process.cwd(), outDir);
postProcessFiles(cwd);

rollup
  .rollup({
    input: outDir + "/bundle/" + flatModuleName + ".js",
    external: angularExternals,
    plugins: [
      resolve(),
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
      terser({
        mangle: false,
        compress: false,
        output: {
          comments: "/#__PURE__|eslint-disable/",
          preserve_annotations: true,
        },
      }),
    ],
    onwarn: function (warning) {
      if (
        warning.code === "UNUSED_EXTERNAL_IMPORT" ||
        warning.code === "THIS_IS_UNDEFINED"
      ) {
        return;
      }
    },
  })
  .then((bundle) => {
    console.info("Create scss bundle entry file...");
    const modules = bundle.cache.modules;
    const scssFiles = [];
    const outputPath = cwd + path.normalize("/dist/css/mobiscroll.scss");
    for (let i = 0; i < modules.length; i++) {
      const m = modules[i];
      if (/\.scss$/.test(m.id)) {
        const rel = path
          .relative(path.dirname(outputPath), m.id)
          .replace(/\\/g, "/");
        const importPath = rel.startsWith(".") ? rel : "./" + rel;
        scssFiles.push(`@import "${importPath}";`);
      }
    }
    fse.mkdirSync(path.dirname(outputPath), { recursive: true });
    fse.writeFileSync(outputPath, scssFiles.join("\n"));
    return bundle;
  })
  .then((bundle) => {
    console.info("Write ESM bundle...");
    return bundle.write({
      format: "es",
      banner: "/* eslint-disable */",
      indent: false,
      globals: angularGlobals,
      file: outDir + "/dist/" + flatModuleName + ".js",
    });
  })
  .then(() =>
    util.cleanSassUseDirectives(path.join(cwd, "dist/css/mobiscroll.scss"))
  )
  .then(() =>
    fse.move(
      outDir + "/dist/" + flatModuleName + ".js",
      outDir + "/dist/esm5/" + flatModuleName + ".mjs",
      { overwrite: true }
    )
  )
  .then(() => {
    console.info("Creating UMD bundle with rollup...");
    return rollup.rollup({
      input: outDir + "/dist/esm5/" + flatModuleName + ".mjs",
      context: "this",
      external: angularExternals,
    });
  })
  .then((bundle) => {
    console.info("Write UMD bundle to disk...");
    return bundle.write({
      format: "umd",
      name: "mobiscroll",
      banner: "/* eslint-disable */",
      indent: false,
      globals: angularGlobals,
      file: outDir + "/dist/js/" + flatModuleName + ".cjs",
    });
  })
  .then(() => {
    console.info("Post processing *.d.ts files to get rid of scss imports...");
    postProcessDTs(cwd);
    fse.writeFileSync(
      outDir + "/dist/esm5/" + flatModuleName + ".d.ts",
      "export * from '../js/public_api';\n",
      "utf8"
    );
  })
  .then(() => fse.copy(outDir + "/dist", pkgDir + "/dist"))
  .then(() => {
    console.info("Done.");
  })
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });

function postProcessDTs(dir) {
  getFiles(path.join(dir, "dist")).forEach((file) => {
    if (/.+\.d\.ts$/.test(file)) {
      removeScssImports(file);
    }
  });
}

function removeScssImports(file) {
  const fileContent = fs.readFileSync(file, "utf8");
  const reg = /^(import '[a-z0-9A-Z/\\\-.]+\.scss';)$/gm;
  if (reg.test(fileContent)) {
    fs.writeFileSync(
      file,
      fileContent.replace(reg, "// style-import-dts $1"),
      "utf8"
    );
  }
}

// Uncomments style imports so rollup can pick them up
function postProcessFiles(dir) {
  const bundleDir = path.join(dir, "bundle");
  getFiles(bundleDir).forEach((filePath) => {
    if (/.*\.js/.test(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const commRegex = /\/\/ style-import /g;
      if (commRegex.test(fileContent)) {
        fs.writeFileSync(filePath, fileContent.replace(commRegex, ""), "utf8");
      }
    }
  });
  // Copy scss files (and directories) into the bundle dir alongside the compiled output
  const srcDir = path.join(dir, "src");
  fse.copySync(srcDir, bundleDir, {
    filter: function (src) {
      return /.*(\.scss$)|((\/|\\)[a-z0-9-]+$)/.test(src);
    },
  });
}

function removeStyleUrls(fileContent) {
  let content2 = fileContent + "";
  const needProcessing = /.*styleUrls:.*/;
  if (!needProcessing.test(fileContent)) {
    return fileContent;
  }
  const imports = [];
  const styleUrls = /styleUrls: ?\[/g;
  let matches;
  let plus = 0;
  while ((matches = styleUrls.exec(fileContent)) !== null) {
    const start = matches.index;
    const end = fileContent.indexOf("]", start);
    const change = fileContent.substring(start, end);
    const endLine = /(\r?\n)/g;
    const changed = "// " + change.replace(endLine, "$1 // ");
    const c2Start = start + plus;
    const c2End = end + plus;
    content2 =
      content2.substring(0, c2Start) + changed + content2.substring(c2End);
    plus += changed.length - change.length;
    const oneUrl = /('[a-z./-]+')/g;
    let urls;
    while ((urls = oneUrl.exec(change)) !== null) {
      imports.push(urls[1]);
    }
  }
  const uniqueImports = [...new Set(imports)];
  return (
    uniqueImports
      .map((imp) => "// style-import import " + imp + ";\n")
      .reduce((imps, imp) => imps + imp) + content2
  );
}
