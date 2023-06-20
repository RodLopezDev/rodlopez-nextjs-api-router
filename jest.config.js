/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  rootDir: "./src",
  coverageDirectory: "<rootDir>/../coverage",
  setupFiles: ["<rootDir>/../.jest/setEnvVars.js"],
};
