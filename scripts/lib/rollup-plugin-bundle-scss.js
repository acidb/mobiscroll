/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const scss = require('sass');
const Bundler = require('./scss-bundle').Bundler;

module.exports = {
  bundleScss: function ({ output } = {}) {
    const files = [];
    return {
      name: 'custom-bundle-scss',

      transform(source, id) {
        if (/\.scss$/.test(id)) {
          files.push({ id, content: source });
        }
        return null;
      },

      generateBundle(opts) {
        console.info('Bundling SCSS into one file...');
        const outputPath = path.resolve(path.dirname(opts.file), output || `${path.parse(opts.file).name}.scss`);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });

        // The order of the imports for the entry content is not right here,
        // so we use the bundle cache outside of this plugin to create the entry file.
        // And we use the files here only to create the registry Map with the source code for the bundler.
        // The source can be transformed by other plugins, so we need the right content.

        // const entryContent = files.map((file) => `@import "${file.id.replace(/\\/g, '\\\\')}";`).join('\n');
        // fs.writeFileSync(outputPath, entryContent);

        // use sass rendering the get to the included files
        const scssOutput = scss.compile(outputPath, {
          style: 'compressed',
          silenceDeprecations: ['import'],
        });
        // -const scssOutput = scss.renderSync({
        //   file: outputPath,
        //   outputStyle: 'compressed',
        // });
        const registry = Object.assign(
          {},
          ...files.map((file) => ({
            [file.id]: file.content,
          })),
        );

        // Only for logging:
        // const start = files.reduce((prev, curr) => prev + '\n' + curr.id, '');
        // fs.writeFileSync(outputPath.replace('mobiscroll.scss', 'mobiscroll.start.scss'), start);
        // const all = scssOutput.stats.includedFiles.reduce((prev, curr) => prev + '\n' + curr, '');
        // fs.writeFileSync(outputPath.replace('mobiscroll.scss', 'mobiscroll.all.scss'), all);

        // create a new instance of the Bundler with the registry map of the scss files
        const bundler = new Bundler(registry);
        // -const result = await bundler.bundle(outputPath, scssOutput.stats.includedFiles);
        return bundler
          .bundle(
            outputPath,
            scssOutput.loadedUrls.map((url) => url.pathname),
          )
          .then(
            (result) => fs.writeFile(outputPath, result.bundledContent), // We overwrite the entry file, since we don't need it anymore
          );
      },
    };
  },
};
