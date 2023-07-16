/** @type {import('jest').Config} */
const config = {
  transform: {
    "^.+\\.tsx?$": "esbuild-jest",
  },
};

module.exports = config;
