import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import sonarjs from "eslint-plugin-sonarjs";
import prettier from "eslint-plugin-prettier/recommended";
import importPlugin from "eslint-plugin-import";
import functional from "eslint-plugin-functional";
import stylistic from "@stylistic/eslint-plugin";

export default tseslint.config(
  {
    ignores: [
      "dist",
      ".yarn",
      "src/vite-env.d.ts",
      "src/api/generated",
      "src/api/generated_backoffice",
      "src/api/generated_public"
    ]
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      sonarjs.configs.recommended,
      prettier
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react,
      "@stylistic": stylistic,
      functional,
      import: importPlugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true }
      ],
      "react/react-in-jsx-scope": "off",
      // Customizations
      "prettier/prettier": "warn",
      "no-case-declarations": "off",
      "no-inner-declarations": "off",
      "prefer-const": "error",
      curly: "error",
      "spaced-comment": ["error", "always", { block: { balanced: true } }],
      radix: "error",
      "one-var": ["error", "never"],
      "object-shorthand": "error",
      "no-var": "error",
      "no-param-reassign": "error",
      "no-underscore-dangle": "error",
      "no-undef-init": "error",
      "no-throw-literal": "error",
      "no-new-wrappers": "error",
      "no-eval": "error",
      "no-console": "error",
      "no-caller": "error",
      "no-bitwise": "error",
      eqeqeq: ["error", "smart"],
      "max-classes-per-file": ["error", 1],
      "guard-for-in": "error",
      complexity: "error",
      "arrow-body-style": "error",
      "import/order": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { ignoreRestSiblings: true }
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/array-type": [
        "error",
        {
          default: "generic"
        }
      ],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/dot-notation": "error",
      "@stylistic/member-delimiter-style": [
        "error",
        {
          multiline: {
            delimiter: "semi",
            requireLast: true
          },
          singleline: {
            delimiter: "semi",
            requireLast: false
          }
        }
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": ["error"],
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/restrict-plus-operands": "error",
      semi: "off",
      "@stylistic/semi": ["error"],
      "@typescript-eslint/unified-signatures": "error",
      "react/prop-types": "off",
      "react/display-name": "off",
      "react/jsx-key": "error",
      "react/jsx-no-bind": ["error", { allowArrowFunctions: true }],
      "functional/no-let": "error",
      "functional/immutable-data": [
        "error",
        {
          ignoreAccessorPattern: "**.*Ref.*"
        }
      ],
      "sonarjs/no-small-switch": "off",
      "sonarjs/no-duplicate-string": "off",
      "sonarjs/prefer-read-only-props": "off",
      "sonarjs/no-nested-functions": "off",
      "sonarjs/no-unused-vars": "off",
      "sonarjs/function-return-type": "off",
      "sonarjs/table-header": "off"
    }
  }
);
