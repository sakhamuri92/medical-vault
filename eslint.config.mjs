// Add .js to the end of the flat import path
import expo from "eslint-config-expo/flat.js"; 
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  // Expo 10 Flat config is an object, so we put it in the array directly
  ...expo, 
  {
    files: ["src/**/*.{ts,tsx,js,jsx}", "app/**/*.{ts,tsx,js,jsx}", "__tests__/**/*.{ts,tsx,js,jsx}"],
    plugins: {
      prettier: prettier,
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/.expo/**",
      "**/dist/**",
      "**/ios/**",
      "**/android/**",
      "assets/**",
      "data/**",
      "coverage/**",
      "*.json",
      "*.md",
    ],
  },
];
