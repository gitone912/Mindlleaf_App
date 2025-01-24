import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, RouteProp } from "@react-navigation/native";
import { AppDispatch, RootState } from "../../store";
import { editJournal } from "../../store/slices/editGetJournalSlice";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable, TextInput, Alert } from "react-native";

type RouteParams = {
  ReadJournal: {
    journalId: string;
  };
};

const ReadJournal = () => {
  const route = useRoute<RouteProp<RouteParams, 'ReadJournal'>>();
  const { journalId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  
  const journal = useSelector((state: RootState) => 
    state.editGetJournal.entries[journalId]
  );

  useEffect(() => {
    if (journal) {
      setEditedContent(journal.content);
    }
  }, [journal]);

  const handleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      await dispatch(editJournal({ 
        journalId, 
        data: {
          content: editedContent,
          moodEmoji: journal.mood_emoji,
          moodKeywords: journal.mood_keywords,
          actions: journal.actions,
          summary: journal.summary,
          type: journal.type
        }
      })).unwrap();
      setIsEditing(false);
      Alert.alert(
        "Success",
        "Journal updated successfully!",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to update journal",
        [{ text: "OK" }]
      );
      console.error('Failed to update journal:', error);
    }
  };

  if (!journal) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Loading journal...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.date}>
            {new Date(journal.updated_at).toLocaleDateString()}
          </Text>
          <Text style={styles.title}>{journal.type}</Text>
          {isEditing ? (
            <TextInput
              style={styles.editInput}
              multiline
              value={editedContent}
              onChangeText={setEditedContent}
            />
          ) : (
            <Text style={styles.body}>{journal.content}</Text>
          )}
        </View>

        <View style={styles.moodSection}>
          <Pressable style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Mood</Text>
          </Pressable>
          <Text style={styles.moodEmoji}>{journal.mood_emoji}</Text>
          <Text style={styles.moodDescription}>
            {journal.mood_keywords.join(', ')}
          </Text>
        </View>

        <View style={styles.summarySection}>
          <Pressable style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Summary</Text>
          </Pressable>
          <Text style={styles.summaryText}>{journal.summary}</Text>
        </View>

        <View style={styles.actionsSection}>
          <Pressable style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Actions</Text>
          </Pressable>
          {journal.actions.map((action, index) => (
            <View key={index} style={styles.actionRow}>
              <View style={styles.textContainer}>
                <Text style={styles.actionText}>{action}</Text>
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Pressable style={styles.button} onPress={handleEdit}>
          <Text style={styles.buttonText}>
            {isEditing ? 'Save Changes' : 'Edit Journal'}
          </Text>
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
  editInput: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'justify',
    fontFamily: 'Inter-Regular',
    color: '#000',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReadJournal;
