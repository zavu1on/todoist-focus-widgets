/**
 * Todoist assigns projects one of a fixed set of named colors (e.g. "berry_red"), not a hex
 * value — this maps those names to the hex values from Todoist's own design language, so a raw
 * color name never reaches a `backgroundColor` style.
 */
const TODOIST_COLOR_HEX: Record<string, string> = {
  berry_red: "#b8255f",
  red: "#db4035",
  orange: "#ff9933",
  yellow: "#fad000",
  olive_green: "#afb83b",
  lime_green: "#7ecc49",
  green: "#299438",
  mint_green: "#6accbc",
  teal: "#158fad",
  sky_blue: "#14aaf5",
  light_blue: "#96c3eb",
  blue: "#4073ff",
  grape: "#884dff",
  violet: "#af38eb",
  lavender: "#eb96eb",
  magenta: "#e05194",
  salmon: "#ff8d85",
  charcoal: "#808080",
  grey: "#b8b8b8",
  taupe: "#ccac93",
};

const DEFAULT_COLOR_HEX = TODOIST_COLOR_HEX.charcoal;

export const getProjectColorHex = (colorKey: string): string =>
  TODOIST_COLOR_HEX[colorKey] ?? DEFAULT_COLOR_HEX;
