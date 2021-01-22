var babel = require('rollup-plugin-babel');
var uglify = require('rollup-plugin-uglify').uglify;
var resolve = require('rollup-plugin-node-resolve');
// var terser = require('rollup-plugin-terser').terser;
// var postprocess = require('rollup-plugin-postprocess');

var globals = {
    angular: 'angular',
    jquery: 'jQuery',
    react: 'React',
    'react-dom': 'ReactDOM',
    'prop-types': 'PropTypes',
    'create-react-class': 'createReactClass',
    '@angular/core': 'ng.core',
    '@angular/forms': 'ng.forms',
    '@angular/common': 'ng.common'
};

var external = [
    'angular',
    'jquery',
    'prop-types',
    'react',
    'react-dom',
    '@angular/core',
    '@angular/forms',
    '@angular/common'
];

module.exports = {
    dev: {
        options: {
            sourcemap: true,
            globals: globals,
            external: external,
            name: 'mobiscroll',
            format: 'umd',
            context: 'this',
            onwarn(warning) {
                if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
                    return;
                }
            },
            plugins: [
                resolve({
                    extensions: ['.js', '.jsx']
                }),
                babel({
                    exclude: ['**/*.angular.js', '**/angular.js']
                }),
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
            name: 'mobiscroll',
            format: 'umd',
            banner: '/* eslint-disable */',
            plugins: [
                resolve({
                    extensions: ['.js', '.jsx']
                }),
                babel(),
                uglify({
                    output: {
                        comments: /eslint-disable/
                    }
                })
            ]
        },
        files: {
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
            name: 'mobiscroll',
            format: 'es',
            context: 'this',
            banner: '/* eslint-disable */',
            onwarn(warning) {
                if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
                    return;
                }
            },
            plugins: [
                resolve(),
                babel({
                    exclude: ['**/*.angular.js', '**/angular.js']
                }),
                // terser({
                //     mangle: {
                //         keep_fnames: /^Mbsc/,
                //         module: false,
                //         reserved: ['_super'],
                //         toplevel: false,
                //     },
                //     compress: {
                //         join_vars: false,
                //         reduce_vars: false,
                //         sequences: false,
                //     },
                //     output: {
                //         wrap_iife: true,
                //     }
                // }),
                // postprocess([
                //     [/}\)\(\);/, '}());']
                // ])
            ]
        },
        files: {
            'dist/esm5/mobiscroll.angular.min.js': 'bundles/mobiscroll.angular.min.js',
        }
    },
    angular: {
        options: {
            globals: globals,
            external: external,
            name: 'mobiscroll',
            format: 'umd',
            context: 'this',
            banner: '/* eslint-disable */',
        },
        files: {
            'dist/bundles/mobiscroll.angular.min.js': 'dist/esm5/mobiscroll.angular.min.js',
        }
    }
};
