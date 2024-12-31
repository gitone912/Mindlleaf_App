import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const LoginScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <Button title="Skip Login" onPress={() => navigation.replace('Main')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
