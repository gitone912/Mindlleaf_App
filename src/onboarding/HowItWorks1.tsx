import * as React from "react";
import { Text, StyleSheet, Image, View, Pressable } from "react-native";

const HIW = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>How It Works</Text>
      <Text style={styles.subHeader}>
        Choose how you want to journal for the day.
      </Text>
      <View style={styles.optionsGrid}>
        <View style={styles.option}>
          <Image
            style={styles.optionImage}
            source={require("../assets/monologue.png")} // Replace with the correct image path
          />
          <Text style={styles.optionText}>Monologue</Text>
        </View>
        <View style={styles.option}>
          <Image
            style={styles.optionImage}
            source={require("../assets/dialogue.png")} // Replace with the correct image path
          />
          <Text style={styles.optionText}>Dialogue with AI</Text>
        </View>
        <View style={styles.option}>
          <Image
            style={styles.optionImage}
            source={require("../assets/type.png")} // Replace with the correct image path
          />
          <Text style={styles.optionText}>Type</Text>
        </View>
        <View style={styles.option}>
          <Image
            style={styles.optionImage}
            source={require("../assets/chat_ai.png")} // Replace with the correct image path
          />
          <Text style={styles.optionText}>Chat with AI</Text>
        </View>
        <View style={styles.option}>
          <Image
            style={styles.optionImage}
            source={require("../assets/prompt.png")} // Replace with the correct image path
          />
          <Text style={styles.optionText}>Prompt-Based</Text>
        </View>
        <View style={styles.option}>
          <Image
            style={styles.optionImage}
            source={require("../assets/gratitude.png")} // Replace with the correct image path
          />
          <Text style={styles.optionText}>Gratitude</Text>
        </View>
      </View>
      <Pressable
        style={styles.nextButton}
        onPress={() => navigation.replace("Main")}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </Pressable>
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
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginTop: 50,
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "#474d41",
    textAlign: "center",
    marginBottom: 30,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  option: {
    width: "45%",
    alignItems: "center",
    marginBottom: 20,
  },
  optionImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 14,
    textAlign: "center",
    color: "#000",
  },
  nextButton: {
    backgroundColor: "#474d41",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  nextButtonText: {
    color: "#fcfaf0",
    fontSize: 16,
    textAlign: "center",
  },
});

export default HIW;
