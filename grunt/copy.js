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
            src: ['**/*.d.ts'],
            dest: 'packages/angular/src/'
        }]
    },
    icons: {
        files: [{
            expand: true,
            cwd: 'src/less/',
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
            src: ['dist/js/mobiscroll.angularjs.js', 'dist/css/*', 'LICENSE'],
            dest: 'packages/angularjs/'
        }, {
            expand: true,
            src: ['dist/js/mobiscroll.javascript.js', 'dist/css/*', 'LICENSE'],
            dest: 'packages/javascript/'
        }, {
            expand: true,
            src: ['dist/js/mobiscroll.jquery.js', 'dist/css/*', 'LICENSE'],
            dest: 'packages/jquery/'
        }, {
            expand: true,
            src: ['dist/js/mobiscroll.react.js', 'dist/css/*', 'LICENSE'],
            dest: 'packages/react/'
        }]
    }
};
