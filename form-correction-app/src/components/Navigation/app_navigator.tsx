/**
 * @file AppNavigator.tsx
 * 
 * @description This file defines the `AppNavigator` component, which sets up the bottom tab navigation for the app.
 *              It uses React Navigation's `createBottomTabNavigator` to provide navigation between the `HomeScreen` 
 *              and `RecordScreen` components. The tab bar icons and styling are customized using options from 
 *              `@expo/vector-icons` and React Navigation.
 * 
 * @version 1.0.0
 * @date 2024-07-31
 * @author Avery Crane
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../../screens/home_screen';
import RecordScreen from '../../screens/record_screen';
import { Ionicons } from '@expo/vector-icons';

// Create a Tab Navigator instance
const Tab = createBottomTabNavigator();

/**
 * AppNavigator component
 * 
 * This component sets up the bottom tab navigation for the app, allowing users to switch between the `HomeScreen` 
 * and `RecordScreen`. The tab bar icons and active/inactive colors are customized. The header is hidden for both screens.
 * 
 * @returns {React.ReactElement} The rendered AppNavigator component.
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // Customize the tab bar icons based on the route
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Home') {
              return <Ionicons name='home-outline' size={size} color={color} />;
            } else if (route.name === 'Record') {
              return <Ionicons name='videocam-outline' size={size} color={color} />;
            }
          },
          // Customize the tab bar appearance
          tabBarActiveTintColor: '#3498db', // Color for the active tab
          tabBarInactiveTintColor: 'gray',  // Color for the inactive tabs
          tabBarLabelStyle: {
            fontSize: 10,  // Font size for tab labels
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerShown: false }} // Hide the header for this screen
        />
        <Tab.Screen 
          name="Record" 
          component={RecordScreen} 
          options={{ headerShown: false }} // Hide the header for this screen
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
