module.exports = {
    roots: ["<rootDir>/src"],
    testMatch: ["**/__tests__/**/*.+(ts)", "**/?(*.)+(spec|test).+(ts)"],
    transform: {
        "^.+\\.(ts)$": "ts-jest",
    },
    setupFiles: ["<rootDir>/jest.setup.files.ts"],
    collectCoverageFrom: ["src/**/*.ts"],
    coveragePathIgnorePatterns: ["node_modules", "src/index.ts"],
    coverageDirectory: "./coverage",
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    moduleNameMapper: {
        "^@src/(.*)$": "<rootDir>/src/$1",
    },
};
