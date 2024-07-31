/**
 * @file home_screen.tsx
 * 
 * @description This is the home screen of the application. It serves as the landing page and 
 *              provides navigation options to other parts of the app. Currently, it displays 
 *              a welcome message and allows navigation to other screens.
 * 
 * @version 1.0.0
 * @date 2024-07-31
 * @author Avery Crane
 */

/* Import necessary modules and components */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/* Define the type for the navigation parameters */
type RootStackParamList = {
  HomeScreen: undefined;
  RecordScreen: undefined;
  FeedbackScreen: undefined;
};

/* Define the navigation prop type for this screen */
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

/* Define the props for the HomeScreen component */
type Props = {
  navigation: HomeScreenNavigationProp;
};

/* Custom button component for navigation (RIGHT NOW: I use app_navigator, so this could be used for something else in future)
const CustomButton: React.FC<{ onPress: () => void, title: string }> = ({ onPress, title }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);
*/

/* Main HomeScreen component */
const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Workout App</Text>
    </View>
  );
};

/* Styles for the HomeScreen component */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
