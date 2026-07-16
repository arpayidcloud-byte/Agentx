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
    project: "./tsconfig.eslint.json",
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
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
    "@typescript-eslint/no-floating-promises": "warn",
    "@agentx/no-credential-logging": "error",
    "@agentx/no-secret-prefix-logging": "error",
    "@agentx/no-vendor-sdk-import": "error"
  },
  ignorePatterns: ["dist/", "node_modules/", "*.js", "*.cjs", "*.mjs"]
};
