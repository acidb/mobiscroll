module.exports = {
    iosDark: {
        options: {
            modifyVars: {
                theme: 'ios-dark',
                input1: '#ff8400',
                input2: '#ff8400',
                input3: '#000000',
                input4: '#ffffff'
            }
        },
        files: {
            'src/less/themes/ios-dark.css': 'src/less/templates/ios.less'
        }
    },
    materialDark: {
        options: {
            modifyVars: {
                theme: 'material-dark',
                input1: '#81ccc4',
                input2: '#303030',
                input3: '#c2c2c2'
            }
        },
        files: {
            'src/less/themes/material-dark.css': 'src/less/templates/material.less'
        }
    },
    mobiscrollDark: {
        options: {
            modifyVars: {
                theme: 'mobiscroll-dark',
                input1: '#263238',
                input2: '#f7f7f7',
                input3: '#4fccc4'
            }
        },
        files: {
            'src/less/themes/mobiscroll-dark.css': 'src/less/templates/mobiscroll.less'
        }
    },
    windowsDark: {
        options: {
            modifyVars: {
                theme: 'windows-dark',
                input1: '#1ca1e3',
                input2: '#1f1f1f',
                input3: '#ffffff'
            }
        },
        files: {
            'src/less/themes/windows-dark.css': 'src/less/templates/windows.less'
        }
    },
    dev: {
        options: {
            sourceMap: true
        },
        files: {
            'dist/css/mobiscroll.css': 'bundles/mobiscroll.less'
        }
    },
    prod: {
        options: {
            compress: true
        },
        files: {
            'dist/css/mobiscroll.min.css': 'bundles/mobiscroll.less'
        }
    }
};