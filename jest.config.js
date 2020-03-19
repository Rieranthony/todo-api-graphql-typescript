module.exports = {
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  coveragePathIgnorePatterns: ["node_modules", "build"]
};
