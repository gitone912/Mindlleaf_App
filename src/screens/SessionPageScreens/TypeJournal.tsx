import * as React from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";

const TypeJournal = () => {
  const [journalContent, setJournalContent] = React.useState('');
  const [title, setTitle] = React.useState('');
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
          
          <TextInput
            style={styles.titleInput}
            placeholder="Enter title..."
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#807d7d"
          />

          <TextInput
            style={styles.bodyInput}
            placeholder="Start writing your journal entry here..."
            multiline
            value={journalContent}
            onChangeText={setJournalContent}
            placeholderTextColor="#807d7d"
          />
        </View>

        <Pressable style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Complete Entry</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Clear Entry</Text>
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
  titleInput: {
    fontSize: 16,
    textAlign: "center",
    color: "#000",
    marginBottom: 15,
    fontWeight: "500",
    fontFamily: "Inter-Medium",
    padding: 10,
  },
  bodyInput: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: "justify",
    fontFamily: "Inter-Regular",
    color: "#807d7d",
    height: 300,
    textAlignVertical: 'top',
    padding: 10,
  },
  moodSection: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#474d41",
    borderRadius: 7,
    height: 60,
    width: 150,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
});

export default TypeJournal;
