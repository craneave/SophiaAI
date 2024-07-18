import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FFFFFF" />
      <Text style={styles.loadingText}>Video processing...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000', // Add a semi-transparent background
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#ffffff', // White text color
  },
});

export default LoadingScreen;
