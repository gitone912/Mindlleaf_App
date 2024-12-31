import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';

const LandingPage = ({ navigation }: any) => {
  const [currentScreen, setCurrentScreen] = useState(0); // Keeps track of which screen is active
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade animation

  const screens = [
    { type: 'text', content: 'The mind is like a tree' },
    { type: 'text', content: 'Each leaf is a thought, a memory, or an idea.' },
    { type: 'text', content: 'And just like a tree,' },
    { type: 'text', content: 'the mind needs nurturing to thrive.' },
    { type: 'image', content: require('../assets/logo_new.png') }, // Logo
    { type: 'logo_image', content: require('../assets/logo_leaf.png') }, // Leaf
  ];

  useEffect(() => {
    if (currentScreen < screens.length) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        // Wait for 2 seconds for text and 3 seconds for logo/leaf
        setTimeout(() => {
          // Fade out
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }).start(() => {
            setCurrentScreen((prev) => prev + 1);
          });
        }, currentScreen === 6 || currentScreen === 7 ? 2000 : 1500);
      });
    } else {
      // Navigate to Home after the last screen
      navigation.replace('Main');
    }
  }, [currentScreen]);

  const renderContent = () => {
    const screen = screens[currentScreen];

    if (!screen) return null; // Prevent accessing undefined elements

    if (screen.type === 'text') {
      return <Text style={styles.text}>{screen.content}</Text>;
    } else if (screen.type === 'image') {
      return <Image source={screen.content} style={styles.image} />;
    } else if (screen.type === 'logo_image') {
        return <Image source={screen.content} style={styles.logo_image} />;
    } else {
      return <View style={styles.blank} />;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {renderContent()}
      </Animated.View>
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
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  logo_image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  blank: {
    height: '100%',
    width: '100%',
  },
});

export default LandingPage;
