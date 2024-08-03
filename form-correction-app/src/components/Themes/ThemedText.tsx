/**
 * @file ThemedText.tsx
 * 
 * @description This component renders text with theme-based color support. It uses the `useThemeColor` hook to 
 *              apply color based on the current theme (light or dark). It also provides predefined text styles 
 *              for different types, such as title, subtitle, and link, to ensure consistent styling across the 
 *              application.
 * 
 * @version 1.0.0
 * @date 2024-07-31
 * @author Avery Crane
 */

import { Text, type TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/src/hooks/useThemeColor';

/**
 * Props for ThemedText component
 * 
 * @interface ThemedTextProps
 * @extends TextProps
 * @property {string} [lightColor] - The text color for light mode.
 * @property {string} [darkColor] - The text color for dark mode.
 * @property {'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link'} [type] - The type of text styling to apply.
 */
export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

/**
 * ThemedText component
 * 
 * This component renders a `Text` element with a color that adapts to the current theme. The text style is
 * determined based on the `type` prop, which applies predefined styles for different text types. It also supports
 * custom styles and text color overrides for light and dark themes.
 * 
 * @param {ThemedTextProps} props - The properties passed to the component.
 * @param {TextProps} props.style - Optional additional styles to apply to the text.
 * @param {string} [props.lightColor] - Optional text color for light mode.
 * @param {string} [props.darkColor] - Optional text color for dark mode.
 * @param {'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link'} [props.type] - The type of text styling to apply.
 * @returns {React.ReactElement} The rendered ThemedText component.
 */
export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  // Use the theme color hook to determine the appropriate text color
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
