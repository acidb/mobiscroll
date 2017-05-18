module.exports = {
    dist: {
        files: [{
            expand: true,
            src: ['dist/**', 'LICENSE', 'README.md'],
            dest: 'packages/angular/'
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
