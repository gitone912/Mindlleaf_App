import React from "react";
import { StyleSheet, Text, Pressable, View,Image } from "react-native";

const TherapyScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Therapy</Text>
      <Text style={styles.subtitle}>
        Select a therapy type to begin your therapy session.
      </Text>

      <View style={styles.optionContainer}>
        {/* AI Therapy Button */}
        <Pressable style={[styles.button, styles.aiButton]}>
          <Text style={styles.buttonText}>AI Therapy</Text>
        </Pressable>
        <View style={styles.costContainer}>
        <Image source={require('../../assets/leaf.png')} style={styles.leafIcon} />
          <Text style={styles.costText}>10</Text>
        </View>
      </View>

      <View style={styles.optionContainer}>
        {/* Human Therapy Button */}
        <Pressable style={[styles.button, styles.humanButton]}>
          <Text style={styles.buttonText}>Human Therapy</Text>
        </Pressable>
        <View style={styles.costContainer}>
        <Image source={require('../../assets/leaf.png')} style={styles.leafIcon} />
          <Text style={styles.costText}>40</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    alignItems: "center",
    paddingTop: 80,
  },
  title: {
    fontSize: 30,
    fontFamily: "Ovo",
    color: "#000",
    marginBottom: 20,
  },
  leafIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#979797",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 40,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    width: 213,
    height: 79,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  aiButton: {
    backgroundColor: "#1878d1",
  },
  humanButton: {
    backgroundColor: "#41ad49",
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "Inter-Regular",
    color: "#fff",
  },
  costContainer: {
    width: 79,
    height: 79,
    borderRadius: 10,
    borderWidth: 0.5,
    flexDirection: 'row',
    borderColor: "#b6b6b6",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  costText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#777",
  },
});

export default TherapyScreen;
