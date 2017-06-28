var babel = require('rollup-plugin-babel');
var uglify = require('rollup-plugin-uglify');

var globals = {
    angular: 'angular',
    jquery: 'jQuery',
    knockout: 'ko',
    react: 'React',
    'react-dom': 'ReactDOM',
    'prop-types': 'PropTypes',
    'create-react-class': 'createReactClass',
    '@angular/core': 'ng.core',
    '@angular/forms': 'ng.forms',
    '@angular/common': 'ng.common',
    '@angular/animations': 'ng.animations',
    'rxjs/Subject': 'Rx',
    'rxjs/Observable': 'Rx'
};

var external = ['angular',
    'jquery',
    'knockout',
    'react',
    'react-dom',
    '@angular/core',
    '@angular/forms',
    '@angular/common',
    '@angular/animations',
    'rxjs/Subject',
    'rxjs/Observable'
];

module.exports = {
    dev: {
        options: {
            sourceMap: true,
            globals: globals,
            external: external,
            moduleName: 'mobiscroll',
            format: 'umd',
            context: 'this',
            plugins: [
                babel({
                    plugins: ['external-helpers']
                })
            ]
        },
        files: {
            'dist/js/mobiscroll.angular.js': 'bundles/mobiscroll.angular.min.js',
            'dist/js/mobiscroll.angularjs.js': 'bundles/mobiscroll.angularjs.js',
            'dist/js/mobiscroll.knockout.js': 'bundles/mobiscroll.knockout.js',
            'dist/js/mobiscroll.javascript.js': 'bundles/mobiscroll.javascript.js',
            'dist/js/mobiscroll.jquery.js': 'bundles/mobiscroll.jquery.js',
            'dist/js/mobiscroll.react.js': 'bundles/mobiscroll.react.js'
        }
    },
    prod: {
        options: {
            globals: globals,
            external: external,
            moduleName: 'mobiscroll',
            format: 'umd',
            context: 'this',
            plugins: [
                babel({
                    plugins: ['external-helpers']
                }),
                uglify()
            ]
        },
        files: {
            'dist/js/mobiscroll.angular.min.js': 'bundles/mobiscroll.angular.min.js',
            'dist/js/mobiscroll.angularjs.min.js': 'bundles/mobiscroll.angularjs.js',
            'dist/js/mobiscroll.knockout.min.js': 'bundles/mobiscroll.knockout.js',
            'dist/js/mobiscroll.javascript.min.js': 'bundles/mobiscroll.javascript.js',
            'dist/js/mobiscroll.jquery.min.js': 'bundles/mobiscroll.jquery.js',
            'dist/js/mobiscroll.react.min.js': 'bundles/mobiscroll.react.js'
        }
    }
};