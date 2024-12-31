import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const JournalScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Journal Screen</Text>
      {/* Add Journal screen UI here */}
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

export default JournalScreen;
