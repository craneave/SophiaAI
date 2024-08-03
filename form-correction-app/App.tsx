/**
 * @file App.tsx
 * 
 * @description This is the main entry point for the React Native application. It imports and renders
 *              the AppNavigator component, which handles the navigation logic for the app.
 * 
 * @version 1.0.0
 * @date 2024-07-31
 * @author Avery Crane
 */

import React from 'react';
import AppNavigator from './src/components/Navigation/app_navigator';

// Main app component -> AppNavigator
const App = () => {
  return <AppNavigator />;
};

// export app component
export default App;


