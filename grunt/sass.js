const sass = require('node-sass');

module.exports = {
    dev: {
        options: {
            implementation: sass,
            sourceMap: true,
        },
        files: {
            'dist/css/mobiscroll.css': 'bundles/mobiscroll.scss'
        }
    },
    prod: {
        options: {
            implementation: sass,
            sourceMap: false,
            outputStyle: 'compressed'
        },
        files: {
            'dist/css/mobiscroll.min.css': 'bundles/mobiscroll.scss'
        }
    }
};
