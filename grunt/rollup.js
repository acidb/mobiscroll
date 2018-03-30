var babel = require('rollup-plugin-babel');
var uglify = require('rollup-plugin-uglify');
var resolve = require('rollup-plugin-node-resolve');

var globals = {
    angular: 'angular',
    jquery: 'jQuery',
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

var external = [
    'angular',
    'jquery',
    'prop-types',
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
            onwarn(warning) {
                if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
                    return;
                }
            },
            plugins: [
                resolve(),
                babel({
                    plugins: ['external-helpers']
                })
            ]
        },
        files: {
            'dist/js/mobiscroll.angular.js': 'bundles/mobiscroll.angular.min.js',
            'dist/js/mobiscroll.angularjs.js': 'bundles/mobiscroll.angularjs.js',
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
            banner: '/* eslint-disable */',
            onwarn(warning) {
                if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
                    return;
                }
            },
            plugins: [
                resolve(),
                babel({
                    plugins: ['external-helpers']
                }),
                uglify({
                    output: {
                        comments: /eslint-disable/
                    }
                })
            ]
        },
        files: {
            'dist/bundles/mobiscroll.angular.min.js': 'bundles/mobiscroll.angular.min.js',
            'dist/js/mobiscroll.angularjs.min.js': 'bundles/mobiscroll.angularjs.js',
            'dist/js/mobiscroll.javascript.min.js': 'bundles/mobiscroll.javascript.js',
            'dist/js/mobiscroll.jquery.min.js': 'bundles/mobiscroll.jquery.js',
            'dist/js/mobiscroll.react.min.js': 'bundles/mobiscroll.react.js'
        }
    },
    esm: {
        options: {
            globals: globals,
            external: external,
            moduleName: 'mobiscroll',
            format: 'es',
            banner: '/* eslint-disable */',
            onwarn(warning) {
                if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
                    return;
                }
            },
            plugins: [
                resolve(),
                babel({
                    plugins: ['external-helpers']
                }),
                uglify({
                    output: {
                        comments: /eslint-disable/
                    }
                })
            ]
        },
        files: {
            'dist/esm5/mobiscroll.angular.min.js': 'bundles/mobiscroll.angular.min.js',
        }
    }
};
