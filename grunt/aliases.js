module.exports = {
    default: [
        'babel',
        'less',
        'rollup:dev'
    ],
    build: [
        'babel',
        'less',
        'rollup:dev',
        'rollup:prod',
        'copy:dist'
    ]
};
