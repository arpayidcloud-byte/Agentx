/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier", "@agentx"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  parserOptions: {
    project: require("path").join(__dirname, "tsconfig.eslint.json"),
    ecmaVersion: 2022,
    sourceType: "module"
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".cjs", ".mjs", ".ts", ".tsx", ".json"],
        moduleDirectory: ["node_modules", "."]
      }
    }
  },
  rules: {
    "prettier/prettier": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/no-unnecessary-type-assertion": "warn",
    "@typescript-eslint/no-redundant-type-constituents": "warn",
    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/await-thenable": "warn",
    "@typescript-eslint/restrict-template-expressions": "warn",
    "no-control-regex": "warn",
    "prefer-const": "warn",
    "@typescript-eslint/no-misused-promises": "warn",
    "no-async-promise-executor": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
    "@typescript-eslint/no-floating-promises": "warn",
    "@agentx/no-credential-logging": "error",
    "@agentx/no-secret-prefix-logging": "error",
    "@agentx/no-vendor-sdk-import": "error",
    "@typescript-eslint/require-await": "off"
  },
  ignorePatterns: ["dist/", "node_modules/", "*.js", "*.cjs", "*.mjs"]
};
