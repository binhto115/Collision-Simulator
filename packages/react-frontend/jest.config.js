import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} */
const config = {
    // Use jsdom for React/component tests
    testEnvironment: "jsdom",

    transform: {
        // TS/TSX handled by ts-jest
        ...tsJestTransformCfg,

        // JS/JSX handled by babel-jest
        "^.+\\.(js|jsx)$": "babel-jest",
    },

    // 👇 This is the important part for your CSS import
    moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    },

    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testMatch: ["**/?(*.)+(test).[tj]s?(x)"],
};

export default config;