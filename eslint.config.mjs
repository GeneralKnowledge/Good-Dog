import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Module boundaries: see docs/architecture.md
  {
    files: ["src/lib/coaching/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/lib/domains", "@/lib/domains/*"],
              message:
                "The coaching engine must not depend on a domain. Pass domain behaviour in through a CoachingPolicy.",
            },
            {
              group: [
                "@/lib/db",
                "@/lib/db/*",
                "@/lib/auth",
                "@/lib/auth/*",
                "@/lib/services",
                "@/lib/services/*",
                "@/lib/actions",
                "@/lib/actions/*",
                "next",
                "next/*",
                "react",
                "react-dom",
              ],
              message:
                "The coaching engine is pure logic. Keep database, auth and framework code in the app layer.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/lib/domains/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/lib/db",
                "@/lib/db/*",
                "@/lib/auth",
                "@/lib/auth/*",
                "@/lib/services",
                "@/lib/services/*",
                "@/lib/actions",
                "@/lib/actions/*",
                "next",
                "next/*",
                "react",
                "react-dom",
              ],
              message:
                "A domain is content and rules. Keep database, auth and framework code in the app layer.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
