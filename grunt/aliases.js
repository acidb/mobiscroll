module.exports = {
    default: [
        'babel',
        'less',
        'run:transpile',
        'rollup:dev',
        'copy:icons'
    ],
    build: [
        'babel',
        'less',
        'run:transpile',
        'rollup:dev',
        'rollup:prod',
        'copy:icons',
        'copy:metadata',
        'copy:dist'
    ]
};