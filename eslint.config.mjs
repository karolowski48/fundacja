import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    // eslint-config-next already registers the jsx-a11y plugin; enable its full recommended rule set
    files: ["**/*.{ts,tsx}"],
    rules: { ...jsxA11y.flatConfigs.recommended.rules },
  },
  {
    ignores: [".next/**", "out/**", "node_modules/**", "source-images/**", "next-env.d.ts", "playwright-report/**", "test-results/**"],
  },
];

export default config;
