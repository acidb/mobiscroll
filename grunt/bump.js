module.exports = {
    options: {
        files: [
            'package.json',
            'packages/angular/package.json',
            'packages/angularjs/package.json',
            'packages/javascript/package.json',
            'packages/jquery/package.json',
            'packages/knockout/package.json',
            'packages/react/package.json'
        ],
        updateConfigs: [],
        commit: false,
        commitMessage: 'Release v%VERSION%',
        commitFiles: [
            'package.json'
        ],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
    }
};