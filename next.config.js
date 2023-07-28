/** @type {import('next').NextConfig} */
const nextConfig = {};

const isGithubActions = process.env.GITHUB_ACTIONS || false;

if (isGithubActions) {
    nextConfig.output = 'export';
}

module.exports = nextConfig
