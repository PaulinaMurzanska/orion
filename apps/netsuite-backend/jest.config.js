const SuiteCloudJestConfiguration = require('@oracle/suitecloud-unit-testing/jest-configuration/SuiteCloudJestConfiguration');
const cliConfig = require('./suitecloud.config');

const nsExport = SuiteCloudJestConfiguration.build({
  projectFolder: cliConfig.defaultProjectFolder,
  projectType: SuiteCloudJestConfiguration.ProjectType.ACP,
});

module.exports = {
  ...nsExport,
  displayName: 'backend',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'html'],
  coverageDirectory: '../../coverage/apps/backend',
};
