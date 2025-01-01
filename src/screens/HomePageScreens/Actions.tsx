// src/screens/ActionScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ActionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Actions Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
});

export default ActionScreen;
