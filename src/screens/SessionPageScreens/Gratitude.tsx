import * as React from "react";
import { StyleSheet, Text, Pressable, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type SessionStackParamList = {
  SessionMain: undefined;
  GratitudeJournal: undefined;
};

type SessionScreenNavigationProp = StackNavigationProp<SessionStackParamList>;

const Gratitude = () => {
  const navigation = useNavigation<SessionScreenNavigationProp>();

  const handleSessionStart = () => {
    navigation.navigate('GratitudeJournal');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gratitude</Text>
      <Text style={styles.description}>
        Practice gratitude by writing about what you're thankful for.
      </Text>

      <Pressable style={styles.button} onPress={handleSessionStart}>
        <Text style={styles.buttonText}>Start Session</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#474d41",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    color: "#a7a7a7",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#474d41",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Gratitude;
