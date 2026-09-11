/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
        '\\.png$': '<rootDir>/__mocks__/assets.js',
        '\\.svg': '<rootDir>/__mocks__/assets.js',
        '\\.xml': '<rootDir>/__mocks__/assets.js',
        '\\.ico': '<rootDir>/__mocks__/assets.js',
        '^uuid$': require.resolve('uuid'),
        '^test-utils$': '<rootDir>test-utils',
    },
    testEnvironment: 'jsdom',
};
