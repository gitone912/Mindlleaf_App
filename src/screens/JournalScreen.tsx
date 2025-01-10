import React from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type JournalStackParamList = {
  JournalMain: undefined;
  UserJournals: undefined;
};

type JournalScreenNavigationProp = StackNavigationProp<JournalStackParamList, 'JournalMain'>;

const JournalScreen = () => {
  const navigation = useNavigation<JournalScreenNavigationProp>();

  const Image1 = () => {
    return (
      <Pressable
        style={styles.pressable}
        onPress={() => navigation.navigate('UserJournals')}
      >
        <Image
          style={styles.icon}
          resizeMode="cover"
          source={require('../assets/journalCovers/4.png')}
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image1 />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
  },
  imageContainer: {
    position: "absolute",
    top: 70, // Adjust space from the top
    left: 30, // Adjust space from the left
    width: 140, // Adjust width of the image container
    height: 179, // Match the height defined in Image1
  },
  icon: {
    borderRadius: 7,
    flex: 1,
    height: "100%",
    width: "100%",
  },
  pressable: {
    height: 179,
    width: "90%",
  },
});

export default JournalScreen;
