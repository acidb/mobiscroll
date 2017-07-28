module.exports = {
    options: {
        babelrc: false,
        plugins: [
            'transform-react-jsx',
            'transform-object-rest-spread',
            'transform-es2015-destructuring',
            "transform-decorators-legacy",
            "transform-class-properties"
        ]
    },
    dist: {
        files: {
            'src/js/frameworks/react.js': 'src/js/frameworks/react.jsx',
            'src/js/forms.react.js': 'src/js/forms.react.jsx',
            'src/js/page.react.js': 'src/js/page.react.jsx'
        }
    }
};