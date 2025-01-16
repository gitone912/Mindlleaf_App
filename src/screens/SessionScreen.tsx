import * as React from "react";
import { Text, StyleSheet, Image, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define the type for the navigation prop
type SessionStackParamList = {
  SessionMain: undefined;
  Monologue: undefined;
  Dialogue: undefined;
  Type: undefined;
  Chat: undefined;
  Prompt: undefined;
  Gratitude: undefined;
};

type SessionScreenNavigationProp = StackNavigationProp<SessionStackParamList, "SessionMain">;

const SessionScreen = () => {
  const navigation = useNavigation<SessionScreenNavigationProp>();

  return (
    <View style={styles.container}>
      
      <Text style={styles.subHeader}>
        Choose how you want to journal for today.
      </Text>
      <Text style={styles.header}>Text</Text>
      <View style={styles.optionsGrid}>
       
       
        <Pressable
          onPress={() => navigation.navigate("Type")}
          style={styles.optionWrapper}
        >
          <Image
            style={styles.optionImage}
            source={require("../assets/type.png")}
          />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Chat")}
          style={styles.optionWrapper}
        >
          <Image
            style={styles.optionImage}
            source={require("../assets/chat_ai.png")}
          />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Prompt")}
          style={styles.optionWrapper}
        >
          <Image
            style={styles.optionImage}
            source={require("../assets/prompt.png")}
          />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Gratitude")}
          style={styles.optionWrapper}
        >
          <Image
            style={styles.optionImage}
            source={require("../assets/gratitude_based.png")}
          />
        </Pressable>
        </View>
        <Text style={styles.header}>Voice</Text>
        <View style={styles.optionsGrid}>

        <Pressable
          onPress={() => navigation.navigate("Monologue")}
          style={styles.optionWrapper}
        >
          <Image
            style={styles.optionImage}
            source={require("../assets/monologue.png")}
          />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Dialogue")}
          style={styles.optionWrapper}
        >
          <Image
            style={styles.optionImage}
            source={require("../assets/dialogue.png")}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 20,
    marginBottom: 3,
  },
  subHeader: {
    fontSize: 16,
    color: "#474d41",
    textAlign: "center",
    marginBottom: 20,
    marginTop:20
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
  },
  optionWrapper: {
    marginBottom: 1,
    alignItems: "center",
  },
  optionImage: {
    width: 140,
    height: 153,
  },
});

export default SessionScreen;
