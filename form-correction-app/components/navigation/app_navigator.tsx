// components/navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../../screens/home_screen';
import RecordScreen from '../../screens/record_screen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Home') {
				return <Ionicons name= {'home-outline'} size={size} color={color} />;
            } else if (route.name === 'Record') {
				return <Ionicons name = {'videocam-outline'} size={size} color={color} />;
            } 
          },
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {
            fontSize: 10,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Record" component={RecordScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
