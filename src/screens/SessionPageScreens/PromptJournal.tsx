import * as React from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCurrentJournal } from '../../store/slices/journalSlice';
import { getJournalPrompt } from '../../api/journalApi';

const PromptJournal = ({ navigation }: any) => {
  const [journalContent, setJournalContent] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [prompt, setPrompt] = React.useState('');
  const [isSessionActive, setIsSessionActive] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();

  const startSession = async () => {
    setIsLoading(true);
    try {
      const userData = await AsyncStorage.getItem('userData');
      const { user_id } = userData ? JSON.parse(userData) : { user_id: '' };
      const response = await getJournalPrompt(user_id);
      setPrompt(response.prompt);
      setIsSessionActive(true);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const endSession = () => {
    dispatch(setCurrentJournal({
      content: journalContent,
      title,
      date: new Date().toISOString(),
      type: 'prompt'
    }));
    navigation.navigate('AnalyseJournal');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={[styles.sessionButton, isSessionActive ? styles.stopButton : styles.startButton]}
          onPress={isSessionActive ? endSession : startSession}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>{isSessionActive ? 'End Session' : 'Start'}</Text>
          )}
        </Pressable>
      </View>

      {isSessionActive && (
        <>
          <View style={styles.promptContainer}>
            <Text style={styles.promptText}>{prompt}</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <Text style={styles.date}>
                {new Date().toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </Text>
              

              <TextInput
                style={styles.bodyInput}
                placeholder="Start writing your journal entry here..."
                multiline
                value={journalContent}
                onChangeText={setJournalContent}
                placeholderTextColor="#807d7d"
              />
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

// Same styles as GratitudeJournal
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
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sessionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#474d41',
  },
  stopButton: {
    backgroundColor: '#8B0000',
  },
  promptContainer: {
    backgroundColor: '#474d41',
    padding: 20,
    borderRadius: 14,
    marginHorizontal: 20,
    marginVertical: 10,
    zIndex: 1,
  },
  promptText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});
export default PromptJournal;
