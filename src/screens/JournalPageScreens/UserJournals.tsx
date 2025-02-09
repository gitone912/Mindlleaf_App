import React, { useEffect } from "react";
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchJournals } from "../../store/slices/editGetJournalSlice";
import { deleteJournalEntry } from "../../store/slices/journalSlice";
import { Swipeable } from 'react-native-gesture-handler';

type JournalStackParamList = {
  JournalMain: undefined;
  UserJournals: undefined;
  ReadJournal: { journalId: string };
};

type JournalScreenNavigationProp = StackNavigationProp<JournalStackParamList, 'JournalMain'>;

const UserJournals = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { entries, loading, error } = useSelector((state: RootState) => state.editGetJournal);
  const navigation = useNavigation<JournalScreenNavigationProp>();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchJournals());
    }, [dispatch])
  );

  const handleDelete = (journalId: string) => {
    Alert.alert(
      'Delete Journal',
      'Are you sure you want to delete this journal entry?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await dispatch(deleteJournalEntry(journalId)).unwrap();
              dispatch(fetchJournals()); // Refresh the list after successful deletion
            } catch (error) {
              Alert.alert(
                'Error',
                'Failed to delete journal entry. Please try again.'
              );
            }
          }
        },
      ]
    );
  };

  const renderRightActions = (journalId: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(journalId)}
      >
        <Image 
          source={require('../../assets/delete.png')} 
          style={styles.deleteIcon}
        />
      </TouchableOpacity>
    );
  };

  const renderInstructions = () => (
    <Text style={styles.instructionText}>
      Swipe right on journals to delete them
    </Text>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.messageText}>Loading journals...</Text>
      </View>
    );
  }

  if (error || Object.keys(entries).length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.messageText}>No journals found</Text>
        <Text style={styles.subMessageText}>Start journaling to see your records here</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {renderInstructions()}
      {Object.entries(entries)
        .sort((a, b) => new Date(b[1].updated_at).getTime() - new Date(a[1].updated_at).getTime())
        .map(([journalId, entry]) => (
          <Swipeable
            key={journalId}
            renderRightActions={() => renderRightActions(journalId)}
          >
            <TouchableOpacity 
              style={styles.entryContainer} 
              onPress={() => navigation.navigate('ReadJournal', { journalId })}
            >
              <View style={styles.dateContainer}>
                <Text style={styles.date}>
                  {new Date(entry.updated_at).getDate()}
                </Text>
                <Text style={styles.month}>
                  {new Date(entry.updated_at).toLocaleString('default', { month: 'short' })}
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{entry.type}</Text>
                <Text style={styles.description}>{entry.content.substring(0, 100)}...</Text>
              </View>
            </TouchableOpacity>
          </Swipeable>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFAF0",
    paddingHorizontal: 30, // Added padding for left and right spaces
    paddingVertical: 30, // Space between the top and bottom
  },
  entryContainer: {
    flexDirection: "row",
    backgroundColor: "#FCFAF0",
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderRadius: 20,
    borderStyle: "solid",
    borderColor: "#b6b6b6",
    borderWidth: 0.5,
  },
  dateContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  date: {
    fontSize: 24,
    color: "#000",
    fontFamily: "Inter-Medium",
    fontWeight: "500",
  },
  month: {
    fontSize: 14,
    color: "#555",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 8,
    fontSize: 15,
    color: "#000",
    fontFamily: "Inter-Medium",
    fontWeight: "500",
  },
  description: {
    fontSize: 9,
    fontFamily: "Inter-Regular",
    color: "#807d7d",
    width: 235,
    height: 42,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 18,
    fontFamily: "Inter-Medium",
    color: "#000",
    marginBottom: 8,
  },
  subMessageText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#807d7d",
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  instructionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
  },
});

export default UserJournals;
