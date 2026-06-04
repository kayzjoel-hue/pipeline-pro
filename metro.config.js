const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
const forceWriteFileSystem = process.env.VERCEL !== "1";

module.exports = withNativeWind(config, {
  input: "./global.css",
  // Vercel web export needs virtual CSS modules so Metro can hash them cleanly.
  // Keep file-backed CSS locally for the current iOS dev workflow.
  forceWriteFileSystem,
});
