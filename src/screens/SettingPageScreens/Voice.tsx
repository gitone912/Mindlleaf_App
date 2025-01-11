import * as React from "react";
import { StyleSheet, Text, Pressable, View } from "react-native";

const VoiceSelection = () => {
  const [selectedVoice, setSelectedVoice] = React.useState("Laura"); // Default selection

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice</Text>

      <Pressable
        style={[
          styles.button,
          selectedVoice === "Laura" && styles.selectedButton,
        ]}
        onPress={() => setSelectedVoice("Laura")}
      >
        <Text
          style={[
            styles.buttonText,
            selectedVoice === "Laura" && styles.selectedButtonText,
          ]}
        >
          Laura
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          selectedVoice === "William" && styles.selectedButton,
        ]}
        onPress={() => setSelectedVoice("William")}
      >
        <Text
          style={[
            styles.buttonText,
            selectedVoice === "William" && styles.selectedButtonText,
          ]}
        >
          William
        </Text>
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
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 40,
    color: "#000",
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#a7a7a7",
    borderRadius: 7,
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  selectedButton: {
    backgroundColor: "#474d41",
    borderColor: "#474d41",
  },
  buttonText: {
    fontSize: 16,
    color: "#979797",
  },
  selectedButtonText: {
    color: "#fff",
  },
});

export default VoiceSelection;
