import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from './src/navigation/LandingPage';
import MainNavigator from './src/navigation/MainNavigator';
import Survey from './src/navigation/Survey';
import LoginPage from './src/screens/LoginScreen';
import HIW from './src/onboarding/HowItWorks1';
import HIW2 from './src/onboarding/HowItWorks2';
import HIW3 from './src/onboarding/HowItWorks3';
import AskName from './src/onboarding/AskName';
import AskNotification from './src/onboarding/AskNotification';
import AskJournal from './src/onboarding/AskJournal';
import SignInEmail from './src/screens/SigninEmail';
import VerifyOTP from './src/screens/VerifyOTP';
import { Provider } from "react-redux";
import store from "./src/store";
import OldUserLanding from './src/navigation/OldUserLanding';
import OnboardLanguageSelection from './src/onboarding/onboardLangSettings';
import Logout from './src/screens/Logout';
import {PermissionsAndroid, Alert, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { withIAPContext } from 'react-native-iap';

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  useEffect(() => {
    const getTheToken = async () => {
      if (Number(Platform.Version) < 33) {
        return;
      }
      const storedToken = await AsyncStorage.getItem('fcmToken');
      if (storedToken) {
        console.log('Token already exists:', storedToken);
        return;
      }

      const permissionStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      console.log(permissionStatus, 'permissionstatus');
      if (permissionStatus) {
        console.log('notification permission granted');
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        console.log('token', token);
        await AsyncStorage.setItem('fcmToken', token);
      } else {
        // Request notification permission
        const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        if (permission === PermissionsAndroid.RESULTS.GRANTED) {
          // Alert.alert('Notification permission granted');
        } else {
          Alert.alert('Notification permission denied');
        }
      }
    };
    getTheToken();
  }, []);


  useEffect(() => {
    const checkUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          if (parsedData.user_id) {
            setInitialRoute('OldUserLanding');
          } else {
            setInitialRoute('LandingPage');
          }
        } else {
          setInitialRoute('LandingPage');
        }
      } catch (error) {
        console.error('Error checking user data:', error);
        setInitialRoute('LandingPage');
      }
    };
    checkUserData();
  }, []);
  


  if (!initialRoute) return null;

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
          <Stack.Screen name="OldUserLanding" component={OldUserLanding} />
          <Stack.Screen name="LandingPage" component={LandingPage} />
          <Stack.Screen name="Survey" component={Survey} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="SigninEmail" component={SignInEmail} />
          <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
          <Stack.Screen name="HIW" component={HIW} />
          <Stack.Screen name="HIW2" component={HIW2} />
          <Stack.Screen name="HIW3" component={HIW3} />
          <Stack.Screen name="AskName" component={AskName} />
          <Stack.Screen name="AskNotification" component={AskNotification} />
          <Stack.Screen name="AskJournal" component={AskJournal} />
          <Stack.Screen name="OnboardLanguageSelection" component={OnboardLanguageSelection} />
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name="Logout" component={Logout} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};


export default withIAPContext(App);