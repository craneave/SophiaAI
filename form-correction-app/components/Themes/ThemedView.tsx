/**
 * @file ThemedView.tsx
 * 
 * @description This component provides a view with theme-based background color support. It utilizes the 
 *              `useThemeColor` hook to apply colors based on the current theme (light or dark). This allows for 
 *              consistent theming across the application.
 * 
 * @version 1.0.0
 * @date 2024-07-31
 * @author Avery Crane
 */

import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

/**
 * Props for ThemedView component
 * 
 * @interface ThemedViewProps
 * @extends ViewProps
 * @property {string} [lightColor] - The background color for light mode.
 * @property {string} [darkColor] - The background color for dark mode.
 */
export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

/**
 * ThemedView component
 * 
 * This component renders a `View` with a background color that adapts to the current theme. The background color
 * is determined based on the `lightColor` and `darkColor` props provided, falling back to the theme's background
 * color if none is specified.
 * 
 * @param {ThemedViewProps} props - The properties passed to the component.
 * @param {ViewProps} props.style - Optional additional styles to apply to the view.
 * @param {string} [props.lightColor] - Optional background color for light mode.
 * @param {string} [props.darkColor] - Optional background color for dark mode.
 * @returns {React.ReactElement} The rendered ThemedView component.
 */
export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  // Use the theme color hook to determine the appropriate background color
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
