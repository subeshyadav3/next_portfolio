import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@next/next/no-img-element": "warn", // or "off"
      "react/no-unescaped-entities": "warn", // or "off"
      "@typescript-eslint/no-unused-vars": "warn", // or "off"
    },
  },
];


export default eslintConfig;
