import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import perfectionist from "eslint-plugin-perfectionist";
import vitest from "@vitest/eslint-plugin";
import { defineConfig } from "eslint/config";

export default defineConfig({
  ignores: ["**/*.js", "prisma.config.ts"],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
    // tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    // perfectionist.configs["recommended-natural"],
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
  },
  // Uncomment to enable vitest rules for test files
  // overrides: [
  //   {
  //     files: ["**/*.test.ts", "**/*.spec.ts"],
  //     plugins: {
  //       vitest,
  //     },
  //     rules: {
  //       ...vitest.configs.recommended.rules,
  //       "@typescript-eslint/unbound-method": "off",
  //     },
  //   },
  // ],
});
