var babel = require('rollup-plugin-babel');
var uglify = require('rollup-plugin-uglify');

module.exports = {
    dev: {
        options: {
            sourceMap: true,
            globals: {
                angular: 'angular',
                jquery: 'jQuery',
                knockout: 'ko',
                react: 'React',
                'react-dom': 'ReactDOM',
                'prop-types': 'PropTypes',
                'create-react-class': 'createReactClass'
            },
            external: ['angular', 'jquery', 'knockout', 'react', 'react-dom', 'prop-types', 'create-react-class'],
            moduleName: 'mobiscroll',
            format: 'umd',
            plugins: [
                babel({
                    plugins: ['external-helpers']
                })
            ]
        },
        files: {
            'dist/js/mobiscroll.angular.js': 'bundles/mobiscroll.angular.js',
            'dist/js/mobiscroll.knockout.js': 'bundles/mobiscroll.knockout.js',
            'dist/js/mobiscroll.javascript.js': 'bundles/mobiscroll.javascript.js',
            'dist/js/mobiscroll.jquery.js': 'bundles/mobiscroll.jquery.js',
            'dist/js/mobiscroll.react.js': 'bundles/mobiscroll.react.js'
        }
    },
    prod: {
        options: {
            globals: {
                angular: 'angular',
                jquery: 'jQuery',
                knockout: 'ko',
                react: 'React',
                'react-dom': 'ReactDOM',
                'prop-types': 'PropTypes',
                'create-react-class': 'createReactClass'
            },
            external: ['angular', 'jquery', 'knockout', 'react', 'react-dom', 'prop-types', 'create-react-class'],
            moduleName: 'mobiscroll',
            format: 'umd',
            plugins: [
                babel({
                    plugins: ['external-helpers']
                }),
                uglify()
            ]
        },
        files: {
            'dist/js/mobiscroll.angular.min.js': 'bundles/mobiscroll.angular.js',
            'dist/js/mobiscroll.knockout.min.js': 'bundles/mobiscroll.knockout.js',
            'dist/js/mobiscroll.javascript.min.js': 'bundles/mobiscroll.javascript.js',
            'dist/js/mobiscroll.jquery.min.js': 'bundles/mobiscroll.jquery.js',
            'dist/js/mobiscroll.react.min.js': 'bundles/mobiscroll.react.js'
        }
    }
};
