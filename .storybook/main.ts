import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import reactNativeWeb from "vite-plugin-react-native-web";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  framework: "@storybook/react-vite",
  async viteFinal(viteConfig) {
    viteConfig.plugins ??= [];
    viteConfig.plugins.push(reactNativeWeb());

    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = [
      ...(Array.isArray(viteConfig.resolve.alias)
        ? viteConfig.resolve.alias
        : Object.entries(viteConfig.resolve.alias ?? {}).map(
            ([find, replacement]) => ({ find, replacement }),
          )),
      { find: "@", replacement: path.resolve(dirname, "../src") },
    ];

    // react-native-web ships internal packages that import "react"/"react-dom" as true
    // ESM, alongside CJS requires pulled in transitively through the alias above. Left to
    // its own discovery, Vite's dependency optimizer can end up serving a raw,
    // un-transformed node_modules/react/index.js (no ESM interop) instead of its
    // pre-bundled copy, causing "doesn't provide an export named 'default'" at runtime.
    // Forcing these as explicit, deduped entries makes every import resolve to the same
    // pre-bundled copy.
    viteConfig.optimizeDeps ??= {};
    viteConfig.optimizeDeps.include = [
      ...(viteConfig.optimizeDeps.include ?? []),
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-dev-runtime",
    ];
    viteConfig.resolve.dedupe = [
      ...(viteConfig.resolve.dedupe ?? []),
      "react",
      "react-dom",
    ];

    return viteConfig;
  },
};

export default config;
