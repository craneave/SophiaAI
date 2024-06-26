import React from "react";
import { Text, View, Image, StyleSheet, Platform } from "react-native";
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/lift.png')}
          style={styles.liftLogo}
        />
      }>
        <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to my lifting app WORK IN PROGRESS!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Gonna work on the home screen i think </ThemedText>
      </ThemedView>
        </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  liftLogo: {
    height: 250,
    width: 250,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});


