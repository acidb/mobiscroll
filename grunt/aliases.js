module.exports = {
    default: [
        'babel',
        'less',
        'run:transpile',
        'rollup:dev',
        'copy:icons'
    ],
    build: [
        'clean:packages',
        'babel',
        'less',
        'run:transpile',
        'rollup:dev',
        'rollup:prod',
        'rollup:esm',
        'copy:icons',
        'copy:metadata',
        'copy:dist'
    ]
};
