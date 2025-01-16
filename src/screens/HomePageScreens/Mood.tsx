import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MoodScreen = () => {
  const moodData = [
    { day: "S", mood: "😞", value: 30 },
    { day: "M", mood: "😐", value: 50 },
    { day: "T", mood: "☹️", value: 40 },
    { day: "W", mood: "🙂", value: 70 },
    { day: "TH", mood: "🙂", value: 70 },
    { day: "F", mood: "😁", value: 90 },
    { day: "S", mood: "😁", value: 90 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood</Text>
      <Text style={styles.subtitle}>
        Based on your journal entries, here’s a record of your mood over time.
      </Text>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          Your mood seems to be highly correlated to your job satisfaction.
        </Text>
      </View>
      <View style={styles.chartContainer}>
        {moodData.map((data, index) => (
          <View key={index} style={styles.barContainer}>
            <Text style={styles.moodIcon}>{data.mood}</Text>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFilled,
                  { height: `${data.value}%` },
                ]}
              ></View>
            </View>
            <Text style={styles.dayLabel}>{data.day}</Text>
          </View>
        ))}
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
  title: {
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
    marginVertical: 10,
  },
  messageContainer: {
    backgroundColor: "#e8e4d8",
    paddingVertical: 20, // Increased padding for left/right spacing
    paddingHorizontal: 50,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  message: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#000",
    textAlign: "center",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20, // Added padding for the left and right sides
    width: "100%",
    marginTop: 20,
  },
  barContainer: {
    alignItems: "center",
    width: 35, // Reduced width for bars to minimize space between them
  },
  moodIcon: {
    fontSize: 18,
    marginBottom: 5,
  },
  barBackground: {
    width: 25, // Slightly wider bars
    height: 140, // Increased overall bar height
    backgroundColor: "#e8e4d8",
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  barFilled: {
    backgroundColor: "#2e2e2e",
    width: "100%",
    borderRadius: 12,
  },
  dayLabel: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#000",
    marginTop: 5,
  },
});

export default MoodScreen;
