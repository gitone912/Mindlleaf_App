import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, StyleSheet, SafeAreaView } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import JourneyScreen from '../screens/JourneyScreen';
import SessionScreen from '../screens/SessionScreen';
import JournalScreen from '../screens/JournalScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ActionScreen from '../screens/HomePageScreens/Actions';
import Header from '../screens/Header';
import MindScreen from '../screens/HomePageScreens/Mind';
import TherapyScreen from '../screens/HomePageScreens/Therapy';
import MoodScreen from '../screens/HomePageScreens/Mood';
import UserJournals from '../screens/JournalPageScreens/UserJournals';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

type RouteNames = 'Home' | 'Journey' | 'Session' | 'Journal' | 'Settings';

const icons: Record<RouteNames, { active: any; inactive: any }> = {
  Home: {
    active: require('../assets/icons/home-active.png'),
    inactive: require('../assets/icons/home-inactive.png'),
  },
  Journey: {
    active: require('../assets/icons/journey-active.png'),
    inactive: require('../assets/icons/journey-inactive.png'),
  },
  Session: {
    active: require('../assets/icons/session-active.png'),
    inactive: require('../assets/icons/session-inactive.png'),
  },
  Journal: {
    active: require('../assets/icons/journal-active.png'),
    inactive: require('../assets/icons/journal-inactive.png'),
  },
  Settings: {
    active: require('../assets/icons/settings-active.png'),
    inactive: require('../assets/icons/settings-inactive.png'),
  },
};

// Home stack navigator
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Action" component={ActionScreen} />
      <Stack.Screen name="Mind" component={MindScreen} />
      <Stack.Screen name="Therapy" component={TherapyScreen} />
      <Stack.Screen name="Mood" component={MoodScreen} />
    </Stack.Navigator>
  );
};

// Journal stack navigator
const JournalStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JournalMain" component={JournalScreen} />
      <Stack.Screen name="UserJournals" component={UserJournals} />
    </Stack.Navigator>
  );
};

// Main navigator with tabs
const MainNavigator = () => {
  return (
    <>
      <SafeAreaView>
        <Header points={100} />
      </SafeAreaView>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            const icon = focused
              ? icons[route.name as RouteNames].active
              : icons[route.name as RouteNames].inactive;

            return <Image source={icon} style={styles.icon} />;
          },
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Journey" component={JourneyScreen} />
        <Tab.Screen name="Session" component={SessionScreen} />
        <Tab.Screen name="Journal" component={JournalStack} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 24, // Adjust the size as per your requirement
    height: 24,
    resizeMode: 'contain',
  },
});

export default MainNavigator;
