module.exports = {
    default: [
        'babel',
        'less',
        'run:transpile',
        'rollup:dev'
    ],
    build: [
        'babel',
        'less',
        'run:transpile',
        'rollup:dev',
        'rollup:prod',
        'copy:metadata',
        'copy:dist'
    ]
};