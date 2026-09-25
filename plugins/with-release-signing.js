// Signs release builds with the key described in ~/.gradle/gradle.properties
// (FOCUS_WIDGETS_STORE_FILE, FOCUS_WIDGETS_STORE_PASSWORD, FOCUS_WIDGETS_KEY_ALIAS,
// FOCUS_WIDGETS_KEY_PASSWORD). Without them a release build fails instead of
// silently falling back to the public debug key.
const { withAppBuildGradle } = require("expo/config-plugins");

const RELEASE_SIGNING_CONFIG = `
        release {
            if (findProperty('FOCUS_WIDGETS_STORE_FILE')) {
                storeFile file(findProperty('FOCUS_WIDGETS_STORE_FILE'))
                storePassword findProperty('FOCUS_WIDGETS_STORE_PASSWORD')
                keyAlias findProperty('FOCUS_WIDGETS_KEY_ALIAS')
                keyPassword findProperty('FOCUS_WIDGETS_KEY_PASSWORD')
            }
        }`;

module.exports = (config) =>
  withAppBuildGradle(config, (config) => {
    let gradle = config.modResults.contents;
    if (gradle.includes("signingConfigs.release")) return config;

    const debugConfig = /(signingConfigs \{\s*debug \{[^}]*\})/;
    const releaseBuildType =
      /(release \{[^{}]*?)signingConfig signingConfigs\.debug/;
    if (!debugConfig.test(gradle) || !releaseBuildType.test(gradle)) {
      throw new Error(
        "with-release-signing: unexpected android/app/build.gradle template",
      );
    }

    gradle = gradle
      .replace(debugConfig, `$1${RELEASE_SIGNING_CONFIG}`)
      .replace(releaseBuildType, "$1signingConfig signingConfigs.release");
    config.modResults.contents = gradle;
    return config;
  });
