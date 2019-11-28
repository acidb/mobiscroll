module.exports = {
    transpile: {
        exec: 'npm run transpile'
    },
    scss: {
        exec: '' +
            '"./node_modules/.bin/scss-bundle" --verbosity Errors -e ./bundles/mobiscroll.angular.scss -d ./packages/angular/dist/css/mobiscroll.scss --dedupe ./src/**/*.scss && ' +
            '"./node_modules/.bin/scss-bundle" --verbosity Errors -e ./bundles/mobiscroll.javascript.scss -d ./packages/javascript/dist/css/mobiscroll.scss --dedupe ./src/**/*.scss && ' +
            '"./node_modules/.bin/scss-bundle" --verbosity Errors -e ./bundles/mobiscroll.jquery.scss -d ./packages/jquery/dist/css/mobiscroll.scss --dedupe ./src/**/*.scss && ' +
            '"./node_modules/.bin/scss-bundle" --verbosity Errors -e ./bundles/mobiscroll.ng.scss -d ./packages/angularjs/dist/css/mobiscroll.scss --dedupe ./src/**/*.scss && ' +
            '"./node_modules/.bin/scss-bundle" --verbosity Errors -e ./bundles/mobiscroll.react.scss -d ./packages/react/dist/css/mobiscroll.scss --dedupe ./src/**/*.scss'
    }
};
