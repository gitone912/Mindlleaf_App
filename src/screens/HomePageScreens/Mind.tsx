// src/screens/ActionScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MindScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the AMind Page</Text>
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

export default MindScreen;
