/**
 * @file ParallaxScrollView.tsx
 * 
 * @description This component implements a parallax effect for a scrollable view, where the header image 
 *              scales and translates based on the scroll offset. The background color of the header adapts 
 *              to the current color scheme (light or dark).
 * 
 * @version 1.0.0
 * @date 2024-07-31
 * @author Avery Crane
 */

/* Import necessary modules and components */
import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { ThemedView } from '../Themes/ThemedView';

/* Constants */
const HEADER_HEIGHT = 250;

/* Define the Props type for the ParallaxScrollView component */
type Props = PropsWithChildren<{
  headerImage: ReactElement;  // The image or component to display in the header
  headerBackgroundColor: { dark: string; light: string };  // Background colors for dark and light themes
}>;

/**
 * ParallaxScrollView component
 * 
 * This component provides a parallax effect for the header image, which scales and translates as the user
 * scrolls through the content. The background color of the header adjusts according to the current color scheme.
 * 
 * @param {Props} props - The properties for the component
 * @param {ReactElement} props.headerImage - The header image or component
 * @param {Object} props.headerBackgroundColor - The background colors for light and dark themes
 * @param {ReactNode} props.children - The content to display below the header
 * 
 * @returns {ReactElement} The rendered ParallaxScrollView component
 */
export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  // Determine the current color scheme (light or dark)
  const colorScheme = useColorScheme() ?? 'light';

  // Create an animated reference for the scroll view
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  
  // Get the current scroll offset from the scroll view
  const scrollOffset = useScrollViewOffset(scrollRef);

  // Define the animated style for the header
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBackgroundColor[colorScheme] },
            headerAnimatedStyle,
          ]}
        >
          {headerImage}
        </Animated.View>
        <ThemedView style={styles.content}>
          {children}
        </ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

/* Styles for the ParallaxScrollView component */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});
