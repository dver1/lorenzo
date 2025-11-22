const config = {
    branches: ['main'],
    plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        [
            "@semantic-release/changelog",
                {
                    "changelogFile": "docs/CHANGELOG.md"
                }
        ],
        [
            "@semantic-release/git",
                {
                    "assets": ["docs/CHANGELOG.md"],
                    "message": "chore: ${nextRelease.version} release notes [skip ci]"
                }
        ],
            "@semantic-release/github"
        ],
    dryRun: false
};

module.exports = config;