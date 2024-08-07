/**
 * @file AppNavigator.tsx
 * 
 * @description This file defines the `AppNavigator` component, which sets up the navigation for the app.
 *              It uses React Navigation's `createStackNavigator` to provide navigation between the `HomeScreen` 
 *              and `RecordScreen` components. The header is hidden for both screens.
 * 
 * @version 2.0.0
 * @date 2024-08-06
 * @author Avery Crane
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../../screens/home_screen';
import RecordScreen from '../../screens/record_screen';

// Create a Stack Navigator instance
const Stack = createStackNavigator();

/**
 * AppNavigator component
 * 
 * This component sets up the stack navigation for the app, allowing users to navigate between the `HomeScreen` 
 * and `RecordScreen`. The header is hidden for both screens.
 * 
 * @returns {React.ReactElement} The rendered AppNavigator component.
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Record" component={RecordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;