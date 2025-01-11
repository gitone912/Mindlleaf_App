import * as React from "react";
import { StyleSheet, Text, Pressable, View } from "react-native";

const LanguageSelection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Language</Text>

      <View style={styles.row}>
        <Pressable style={[styles.button, styles.selectedButton]}>
          <Text style={[styles.buttonText, styles.selectedButtonText]}>English</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>German</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Hindi</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Korean</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Tagalog</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Spanish</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    paddingHorizontal: 20,
    paddingVertical: 50,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 40,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    height: 54,
    borderWidth: 0.5,
    borderColor: "#a7a7a7",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#fcfaf0",
  },
  selectedButton: {
    backgroundColor: "#474d41",
  },
  buttonText: {
    fontSize: 13,
    color: "#979797",
    textAlign: "center",
  },
  selectedButtonText: {
    color: "#fff",
  },
});

export default LanguageSelection;
