module.exports = {
    metadata: {
        files: [{
            expand: true,
            cwd: 'bundles/',
            src: ['*.d.ts', '*.metadata.json'],
            dest: 'packages/angular/dist/'
        }, {
            expand: true,
            cwd: 'src/',
            src: ['**/*.d.ts', '!js/frameworks/*.d.ts', 'js/frameworks/angular.d.ts'],
            dest: 'packages/angular/src/'
        }, {
            expand: true,
            cwd: 'src/',
            src: ['**/*.d.ts', '!**/*.angular.d.ts', '!js/frameworks/*.d.ts', 'js/frameworks/javascript.d.ts'],
            dest: 'packages/javascript/dist/src/'
        }, {
            expand: true,
            cwd: 'src/',
            src: ['**/*.d.ts', '!**/*.angular.d.ts', '!js/frameworks/*.d.ts', 'js/frameworks/jquery.d.ts'],
            dest: 'packages/jquery/dist/src/'
        }, {
            expand: true,
            cwd: 'src/',
            src: ['**/*.d.ts', '!**/*.angular.d.ts', '!js/frameworks/*.d.ts', 'js/frameworks/react.d.ts'],
            dest: 'packages/react/dist/src/'
        }]
    },
    icons: {
        files: [{
            expand: true,
            cwd: 'src/scss/core',
            src: ['icons_mobiscroll.ttf', 'icons_mobiscroll.woff'],
            dest: 'dist/css/'
        }]
    },
    dist: {
        files: [{
            expand: true,
            src: [
                'dist/bundles/*',
                'dist/esm5/*',
                'dist/css/*',
                'LICENSE'
            ],
            dest: 'packages/angular/'
        }, {
            expand: true,
            src: ['dist/js/mobiscroll.angularjs.js', 'dist/js/mobiscroll.angularjs.min.js', 'dist/css/*', 'LICENSE'],
            dest: 'packages/angularjs/'
        }, {
            expand: true,
            src: ['dist/js/mobiscroll.javascript.js', 'dist/js/mobiscroll.javascript.min.js', 'dist/css/*', 'LICENSE'],
            dest: 'packages/javascript/'
        }, {
            expand: true,
            src: ['dist/js/mobiscroll.jquery.js', 'dist/js/mobiscroll.jquery.min.js', 'dist/css/*', 'LICENSE'],
            dest: 'packages/jquery/'
        }, {
            expand: true,
            src: ['dist/js/mobiscroll.react.js', 'dist/js/mobiscroll.react.min.js', 'dist/css/*', 'LICENSE'],
            dest: 'packages/react/'
        }]
    }
};
