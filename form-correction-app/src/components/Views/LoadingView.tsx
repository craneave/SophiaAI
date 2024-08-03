/**
 * @file LoadingScreen.tsx
 * 
 * @description This component displays a loading screen with a spinner and text message to indicate that
 *              video processing is in progress. It is styled to cover the entire screen with a semi-transparent
 *              background.
 * 
 * @version 1.0.0
 * @date 2024-07-31
 * @author Avery Crane
 */

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * LoadingScreen component
 * 
 * This component shows a loading spinner and a text message to inform the user that video processing is ongoing.
 * It is intended to be displayed as an overlay, covering the entire screen.
 * 
 * @returns {React.ReactElement} The rendered LoadingScreen component
 */
const LoadingScreen = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FFFFFF" />
      <Text style={styles.loadingText}>Video processing...</Text>
    </View>
  );
};

/* Styles for the LoadingScreen component */
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000', // Semi-transparent black background to overlay content
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 2, // Ensure the loading screen is above other content
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#ffffff', // White text color for contrast against the background
  },
});

export default LoadingScreen;
