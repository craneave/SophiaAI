import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  children: React.ReactNode; // Allows any React nodes as children
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF', // Example background color
    paddingHorizontal: 16,
    paddingTop: 20,
  },
});

export default Layout;
