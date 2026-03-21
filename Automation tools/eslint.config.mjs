import powerbiVisuals from "eslint-plugin-powerbi-visuals";

export default [
  powerbiVisuals.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "script",
      ecmaVersion: "latest",
    },
  }
];
