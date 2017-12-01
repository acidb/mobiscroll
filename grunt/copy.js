module.exports = {
    metadata: {
        files: [{
            expand: true,
            cwd: 'bundles/',
            src: ['*.d.ts', '*.metadata.json'],
            dest: 'dist/js/'
        }, {
            expand: true,
            cwd: 'src/',
            src: ['**/*.d.ts'],
            dest: 'dist/src/'
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
            src: ['dist/**', 'LICENSE'],
            dest: 'packages/angular/'
        }, {
            expand: true,
            src: ['dist/**', 'LICENSE'],
            dest: 'packages/angularjs/'
        }, {
            expand: true,
            src: ['dist/**', 'LICENSE'],
            dest: 'packages/javascript/'
        }, {
            expand: true,
            src: ['dist/**', 'LICENSE'],
            dest: 'packages/jquery/'
        }, {
            expand: true,
            src: ['dist/**', 'LICENSE'],
            dest: 'packages/react/'
        }]
    }
};