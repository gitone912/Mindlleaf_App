import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const JourneyScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Journey Screen</Text>
      {/* Add Journey screen UI here */}
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
    fontWeight: 'bold',
  },
});

export default JourneyScreen;
