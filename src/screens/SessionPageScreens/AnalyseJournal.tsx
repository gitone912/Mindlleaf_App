import * as React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const AnalyseJournal = () => {
  const currentJournal = useSelector((state: RootState) => state.journal.currentJournal);
  
  const actions = [
    "Call one old friend this week.",
    "Set a monthly reminder to check in with friends.",
    "Write a thank-you message to a close friend today.",
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.date}>
            {new Date(currentJournal?.date || Date.now()).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </Text>
          
          {currentJournal?.title && (
            <Text style={styles.title}>{currentJournal.title}</Text>
          )}

          <Text style={styles.body}>
            {currentJournal?.content || 'No content available'}
          </Text>
        </View>

        {/* Mood Section */}
        <View style={styles.moodSection}>
        <Pressable style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Mood</Text>
        </Pressable>
          <Text style={styles.moodEmoji}>😊</Text>
          <Text style={styles.moodDescription}>uplifting, reflective, and nostalgic</Text>
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
        <Pressable style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Summary</Text>
        </Pressable>
          <Text style={styles.summaryText}>
            A call from an old friend brightened my day, reminding me of the unique comfort and deep connection of long-standing friendships. The natural, heartfelt conversation made me reflect on how easily life can drift us apart and inspired me to be more intentional about nurturing meaningful relationships moving forward.
          </Text>
        </View>

        {/* Actions Section */}
        <View style={styles.actionsSection}>
        <Pressable style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Actions</Text>
        </Pressable>
          <Text style={styles.actionDescription}>
            Based on this journal session, here’s a list of actions recommended to improve your mental health:
          </Text>

          {actions.map((action, index) => (
        <View key={index} style={styles.actionRow}>
          <View style={styles.textContainer}>
            <Text style={styles.actionText}>{action}</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => {}}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      ))}
        </View>

        <Pressable style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Complete Session</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Restart Session</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAF0",
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#FAFAF0",
    padding: 20,
    width: "100%",
    borderRadius: 20,
    borderStyle: "solid",
    borderColor: "#b6b6b6",
    borderWidth: 0.5,
  },
  date: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "200",
    fontFamily: "Inter-ExtraLight",
    color: "#000",
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    color: "#000",
    marginBottom: 15,
    fontWeight: "500",
    fontFamily: "Inter-Medium",
  },
  body: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: "justify",
    fontFamily: "Inter-Regular",
    color: "#807d7d",
  },
  moodSection: {
    marginTop: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
    fontFamily: "Inter-Medium",
  },
  moodEmoji: {
    fontSize: 50,
  },
  moodDescription: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#807d7d",
    marginTop: 5,
  },
  summarySection: {
    marginTop: 20,
    paddingHorizontal: 10,
    alignItems: "center", // Center children horizontally
    justifyContent: "center",
  },
  summaryText: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: "justify",
    fontFamily: "Inter-Regular",
    color: "#807d7d",
  },
  actionsSection: {
    marginTop: 20,
    paddingHorizontal: 10,
    alignItems: "center", // Center children horizontally
    justifyContent: "center", // Center children vertically
  },
  actionDescription: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "justify",
    fontFamily: "Inter-Regular",
    color: "#807d7d",
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: "#FAFAF0",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#b6b6b6",
    padding: 10,
    marginVertical: 5,
    alignItems: "center", // Center text horizontally
    justifyContent: "center", // Center text vertically
  },
  button: {
    backgroundColor: "#474d41",
    borderRadius: 7,
    height: 60, // Fixed height
    width: 150, // Fixed width
    paddingVertical: 10, // Padding inside the button
    paddingHorizontal: 20, // Padding inside the button
    margin: 15, // Margin outside the button
    alignItems: "center",
    justifyContent: "center", // Center the text vertically
  },
  buttonText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Inter-Regular",
    textAlign: "center", // Center the text horizontally
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  textContainer: {
    flex: 1,
    backgroundColor: "#FAFAF0",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  actionText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Inter-Regular",
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#FAFAF0",
    borderRadius: 8,
    borderWidth: 1,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ccc",
  },
  addButtonText: {
    fontSize: 20,
    backgroundColor: "#FAFAF0",
    fontWeight: "bold",
    
  },
});

export default AnalyseJournal;
