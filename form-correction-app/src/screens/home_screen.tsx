/**
 * @file home_screen.tsx
 * 
 * @description This is the home screen of the application. It serves as the landing page and 
 *              provides an overview of the app's features. It displays a welcome message, 
 *              a motivational quote, and quick access buttons to key features.
 * 
 * @version 1.1.0
 * @date 2024-08-03
 * @author Avery Crane
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
type IconName = React.ComponentProps<typeof Ionicons>['name'];


const QuickAccessButton: React.FC<{ onPress: () => void; title: string; icon: IconName }> = ({ onPress, title, icon }) => (
  <TouchableOpacity style={styles.quickAccessButton} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#fff" />
    <Text style={styles.quickAccessButtonText}>{title}</Text>
  </TouchableOpacity>
);

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../assets/images/bg.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome to SophiaAI</Text>
          <Text style={styles.subtitle}>Your personal fitness companion</Text>
          
          <View style={styles.quoteContainer}>
            <Text style={styles.quote}>"The only bad workout is the one that didn't happen."</Text>
          </View>
          
          <View style={styles.quickAccessContainer}>
            <QuickAccessButton 
              onPress={() => navigation.navigate('Record' as never)}
              title="Record Workout" 
              icon="videocam-outline"
            />
            <QuickAccessButton 
              onPress={() => {/* Navigate to progress screen */}}
              title="View Progress" 
              icon="stats-chart-outline"
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e0e0',
    marginBottom: 30,
    textAlign: 'center',
  },
  quoteContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 40,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#fff',
    textAlign: 'center',
  },
  quickAccessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  quickAccessButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
  },
  quickAccessButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default HomeScreen;