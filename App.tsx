import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from './src/navigation/LandingPage';
import MainNavigator from './src/navigation/MainNavigator';
import Survey from './src/navigation/Survey';
import LoginPage from './src/screens/LoginScreen';
import HIW from './src/onboarding/HowItWorks1';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="Survey" component={Survey} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="HIW" component={HIW} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
