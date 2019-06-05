module.exports = {
    default: [
        'babel',
        'sass',
        'run:transpile',
        'rollup:dev',
        'copy:icons'
    ],
    build: [
        'clean:packages',
        'babel',
        'sass',
        'run:transpile',
        'run:scss',
        'rollup:dev',
        'rollup:prod',
        'rollup:esm',
        'copy:icons',
        'copy:metadata',
        'copy:dist'
    ]
};
