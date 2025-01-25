import * as React from "react";
import { useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable, Alert } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { compileJournal, getJournalSummary, getSatisfactionScore, getKeywords, getRecommendedActions, getJournalTitle } from '../../store/slices/analyseSlice';
import { createTask } from '../../store/slices/actionSlice'; // Add this import
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as analyseApi from '../../api/analyseApi';  // Add this import
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import LoadingAnimation from '../../components/LoadingAnimation';

type NavigationProps = NavigationProp<ParamListBase>;

const AnalyseJournal: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch<AppDispatch>();
  const currentJournal = useSelector((state: RootState) => state.journal.currentJournal);
  const { compiledJournal, summary, satisfactionScore, keywords, loading, isAnalyzing, actions, error, title } = useSelector((state: RootState) => state.analyse);

  useEffect(() => {
    if (currentJournal?.content) {
      console.log('Dispatching compile journal...');
      dispatch(compileJournal(currentJournal.content))
        .then((result) => {
          if (result.payload) {
            console.log('Journal compiled, dispatching other actions...');
            // First get the summary
            dispatch(getJournalSummary(result.payload))
              .then((summaryResult) => {
                if (summaryResult.payload) {
                  // After getting summary, get the title based on it
                  dispatch(getJournalTitle(summaryResult.payload));
                }
              });

            // Dispatch other actions in parallel
            Promise.all([
              dispatch(getSatisfactionScore(result.payload)),
              dispatch(getKeywords(result.payload)),
              dispatch(getRecommendedActions(result.payload))
            ]).then(() => {
              console.log('All actions completed');
            });
          }
        });
    }
  }, [currentJournal, dispatch]);

  const getEmoji = (score: number) => {
    if (score >= 80) return '😊';
    if (score >= 60) return '🙂';
    if (score >= 40) return '😐';
    if (score >= 20) return '😕';
    return '😢';
  };

  const handleAddTask = async (taskName: string) => {
    try {
      // Get user data from AsyncStorage
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        Alert.alert('Error', 'User data not found');
        return;
      }

      const userData = JSON.parse(userDataString);
      const userId = userData.user_id;

      Alert.alert(
        'Add Task',
        'Do you want to add this task to your daily tasks?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              try {
                await dispatch(createTask({
                  userId,
                  taskName,
                  completion_points: 5
                })).unwrap();
                
                Alert.alert('Success', 'Task added successfully!');
              } catch (error: any) {
                if (error?.message?.includes('Daily task limit reached. You can only create 6 tasks per day.')) {
                  Alert.alert('Limit Reached', 'You cannot add more than 6 tasks per day.');
                } else {
                  Alert.alert('Sorry', 'Daily task limit reached. You can only create 6 tasks per day.');
                }
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error', 'Failed to add task');
    }
  };

  const handleCompleteSession = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        Alert.alert('Error', 'User data not found');
        return;
      }
      const userData = JSON.parse(userDataString);

      Alert.alert(
        'Complete Session',
        'Do you want to save this journal entry?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              try {
                const keywordsArray = keywords ? keywords.split(',').map(k => k.trim()) : [];
                // Convert actions to proper format
                const actionsArray = actions?.recommendedActions 
                  ? actions.recommendedActions.split(',').map(a => a.trim()) 
                  : [];

                const journalData = {
                  userId: userData.user_id,
                  type: title || 'Untitled Journal', // Use title instead of 'personal'
                  originalContent: currentJournal?.content || '',
                  content: compiledJournal || '',
                  moodEmoji: getEmoji(satisfactionScore),
                  moodKeywords: keywordsArray,
                  summary: summary || '',
                  actions: actionsArray, // Now this is a string array
                };

                // Save journal entry
                const response = await analyseApi.createJournal(journalData);
                console.log('Journal created successfully:', response);

                // Update journey streak
                const utcOffset = -(new Date().getTimezoneOffset() / 60);
                const journeyResponse = await analyseApi.updateJourneyStreak(userData.user_id, utcOffset);
                console.log('Journey streak updated:', journeyResponse);

                Alert.alert('Success', 'Journal entry saved successfully!', [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('SessionMain')
                  }
                ]);
              } catch (error: any) {
                console.error('Error:', error);
                Alert.alert(
                  'Error',
                  error.message || 'Failed to save journal entry. Please try again.'
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error handling complete session:', error);
      Alert.alert('Error', 'Something went wrong while saving the journal');
    }
  };

  const handleRestartSession = () => {
    Alert.alert(
      'Restart Session',
      'Are you sure you want to restart the session?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => navigation.navigate('SessionMain')
        },
      ]
    );
  };

  // Add this helper function
  const getActionsList = () => {
    if (!actions?.recommendedActions) return [];
    return actions.recommendedActions.split(',').map(action => action.trim());
  };

  // Replace the loading view with the new component
  if (loading.compile) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingAnimation message="Analyzing your journal entry..." />
      </View>
    );
  }

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
          
          <View style={styles.titleContainer}>
            {loading.title || loading.compile ? (
              <LoadingAnimation message="Generating title..." />
            ) : title ? (
              <Text style={styles.title}>{title}</Text>
            ) : null}
          </View>

          <Text style={styles.body}>
            {compiledJournal || currentJournal?.content || 'No content available'}
          </Text>
        </View>

        {/* Only show these sections after compilation is complete */}
        {!loading.compile && compiledJournal && (
          <>
            {/* Mood Section */}
            {loading.satisfaction || loading.keywords ? (
              <LoadingAnimation message="Analyzing mood..." />
            ) : (
              <View style={styles.moodSection}>
                <Pressable style={styles.button} onPress={() => {}}>
                  <Text style={styles.buttonText}>Mood</Text>
                </Pressable>
                <Text style={styles.moodEmoji}>{getEmoji(satisfactionScore)}</Text>
                <Text style={styles.moodDescription}>{keywords}</Text>
              </View>
            )}

            {/* Summary Section */}
            {loading.summary ? (
              <LoadingAnimation message="Generating summary..." />
            ) : (
              <View style={styles.summarySection}>
                <Pressable style={styles.button} onPress={() => {}}>
                  <Text style={styles.buttonText}>Summary</Text>
                </Pressable>
                <Text style={styles.summaryText}>{summary}</Text>
              </View>
            )}

            {/* Actions Section */}
            {loading.actions ? (
              <LoadingAnimation message="Loading recommended actions..." />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : actions?.recommendedActions ? (
              getActionsList().map((action, index) => (
                <View key={index} style={styles.actionRow}>
                  <View style={styles.textContainer}>
                    <Text style={styles.actionText}>{action}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={() => handleAddTask(action)}
                  >
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noActionsText}>No actions available</Text>
            )}

            <Pressable style={styles.button} onPress={handleCompleteSession}>
              <Text style={styles.buttonText}>Complete Session</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={handleRestartSession}>
              <Text style={styles.buttonText}>Restart Session</Text>
            </Pressable>
          </>
        )}
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
  titleContainer: {
    minHeight: 50,  // Adjust this value based on your needs
    justifyContent: 'center',
    alignItems: 'center',
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#474d41",
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  noActionsText: {
    color: '#807d7d',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default AnalyseJournal;
