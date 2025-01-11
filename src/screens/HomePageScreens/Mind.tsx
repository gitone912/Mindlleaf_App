import * as React from "react";
import { Image, StyleSheet, Text, View, Pressable } from "react-native";

const MindScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>MindScreen</Text>

      {/* Status Section */}
      <Text style={styles.subtitle}>Based on your journal entries, here’s a snapshot of your mental health status.</Text>
      <View style={styles.statusWrapper}>
        <Text style={styles.statusText}>Anxious</Text>
      </View>

      {/* Description Section */}
      <View style={styles.descriptionWrapper}>
        <Text style={styles.descriptionText}>
          Your recent journal entries suggest anxiety stemming from specific concerns about upcoming deadlines at work, uncertainty about a personal relationship, and a repeated focus on health-related worries. The use of words like “worried,” “stressed,” and “nervous” combined with fragmented sentences and expressions of doubt reflect a preoccupation with these issues. Additionally, late-night journaling indicates difficulty sleeping, possibly due to racing thoughts about these challenges. These patterns point to anxiety triggered by tangible stressors in your current situation.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Talk to a therapist</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Journal</Text>
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
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontFamily: "Ovo",
    color: "#000",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#979797",
    textAlign: "center",
    marginVertical: 20,
    lineHeight: 20,
  },
  statusWrapper: {
    backgroundColor: "#b78418",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 10,
  },
  statusText: {
    fontSize: 25,
    color: "#fff",
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
  descriptionWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#b2b0b0",
    padding: 17,
    marginVertical: 15,
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#979797",
    lineHeight: 20,
    textAlign: "justify",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#474d41",
    borderRadius: 7,
    padding: 10,
    marginHorizontal: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Inter-Regular",
  },
});

export default MindScreen;
