import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OldUserLanding = ({ navigation }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        const parsedData = userData ? JSON.parse(userData) : null;
        const isOnboarded = parsedData?.is_onboarded || parsedData?.isOnboarded || false;

        // Start logo animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();

        // Navigate after 1.5 seconds
        setTimeout(() => {
          navigation.replace(isOnboarded ? 'Main' : 'HIW');
        }, 1500);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        navigation.replace('HIW');
      }
    };

    checkOnboarding();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/logo_mindleaf_full.png')}
        style={[styles.image, { opacity: fadeAnim }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFAF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});

export default OldUserLanding;
