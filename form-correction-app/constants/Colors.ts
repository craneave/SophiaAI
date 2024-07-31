// Define color constants for the light and dark themes
const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

// Export a Colors object containing theme-specific color values
export const Colors = {
  light: {
    text: "#11181C", // Primary text color for light mode
    background: "#fff", // Background color for light mode
    tint: tintColorLight, // Accent color for light mode
    icon: "#687076", // Icon color for light mode
    tabIconDefault: "#687076", // Default tab icon color for light mode
    tabIconSelected: tintColorLight, // Selected tab icon color for light mode
    snapPrimary: "#FFFC00", // Primary highlight color for light mode
  },
  dark: {
    text: "#ECEDEE", // Primary text color for dark mode
    background: "#000", // Background color for dark mode
    tint: tintColorDark, // Accent color for dark mode
    icon: "#9BA1A6", // Icon color for dark mode
    tabIconDefault: "#9BA1A6", // Default tab icon color for dark mode
    tabIconSelected: tintColorDark, // Selected tab icon color for dark mode
    snapPrimary: "#FFFC00", // Primary highlight color for dark mode
  },
};
