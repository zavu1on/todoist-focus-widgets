const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// @doist/todoist-sdk dynamically imports "fs"/"path" (Node-only file-upload
// path) and "undici" (Node-only HTTP dispatcher, used only when
// isNodeEnvironment() is true) — code paths this app never hits. Metro still
// resolves dynamic imports statically, so stub them out for native platforms
// where they're irrelevant anyway ("fs"/"path" are already shimmed by default
// on web).
const NATIVE_ONLY_STUBBED_MODULES = new Set(["fs", "path", "undici"]);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform !== "web" && NATIVE_ONLY_STUBBED_MODULES.has(moduleName)) {
    return { type: "empty" };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
