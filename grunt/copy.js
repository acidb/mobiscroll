module.exports = {
    metadata: {
        files: [{
            expand: true,
            cwd: 'bundles/',
            src: ['*.d.ts', '*.metadata.json'],
            dest: 'dist/js/',
        }, {
            expand: true,
            cwd: 'src/',
            src: ['**/*.d.ts'],
            dest: 'dist/src/'
        }]
    },
    dist: {
        files: [{
            expand: true,
            src: ['dist/**', 'LICENSE', 'README.md'],
            dest: 'packages/angular/'
        }, {
            expand: true,
            src: ['dist/**', 'LICENSE', 'README.md'],
            dest: 'packages/angularjs/'
        }, {
            expand: true,
            src: ['dist/**', 'LICENSE', 'README.md'],
            dest: 'packages/javascript/'
        }, {
            expand: true,
            src: ['dist/**', 'LICENSE', 'README.md'],
            dest: 'packages/jquery/'
        }, {
            expand: true,
            src: ['dist/**', 'LICENSE', 'README.md'],
            dest: 'packages/knockout/'
        }, {
            expand: true,
            src: ['dist/**', 'LICENSE', 'README.md'],
            dest: 'packages/react/'
        }]
    }
};