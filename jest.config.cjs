const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.expotr = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg
  }
};
