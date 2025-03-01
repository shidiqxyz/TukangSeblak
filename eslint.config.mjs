  export default [
    ...compat.extends("next/core-web-vitals"),
    ...compat.extends("next/typescript"),
    {
      rules: {
        "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
      }
    }
  ];
