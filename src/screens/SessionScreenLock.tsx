import * as React from "react";
import { useEffect, useState } from "react";
import { Text, StyleSheet, Image, View, Pressable, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the type for the navigation prop
type SessionStackParamList = {
  SessionMain: undefined;
  Monologue: undefined;
  Dialogue: undefined;
  Type: undefined;
  Chat: undefined;
  Prompt: undefined;
  Gratitude: undefined;
};

type SessionScreenNavigationProp = StackNavigationProp<SessionStackParamList, "SessionMain">;

const SessionScreen = () => {
  const navigation = useNavigation<SessionScreenNavigationProp>();
  const [timeUntilNextJournal, setTimeUntilNextJournal] = useState<string | null>(null);
  const [canJournal, setCanJournal] = useState(true);

  useEffect(() => {
    checkJournalAvailability();
    const interval = setInterval(checkJournalAvailability, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  const checkJournalAvailability = async () => {
    try {
      const lastJournalTimestamp = await AsyncStorage.getItem('lastJournalTimestamp');
      
      if (lastJournalTimestamp) {
        const lastJournalDate = new Date(lastJournalTimestamp);
        const now = new Date();
        
        // Get next midnight in user's local timezone
        const nextMidnight = new Date();
        nextMidnight.setHours(24, 0, 0, 0);
        
        // Check if the last journal was from a previous day
        const isLastJournalFromPreviousDay = 
          lastJournalDate.getFullYear() < now.getFullYear() ||
          lastJournalDate.getMonth() < now.getMonth() ||
          lastJournalDate.getDate() < now.getDate();

        if (!isLastJournalFromPreviousDay) {
          // Calculate remaining time until midnight
          const timeDiff = nextMidnight.getTime() - now.getTime();
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          
          setTimeUntilNextJournal(
            `${hours}h ${minutes}m ${seconds}s`
          );
          setCanJournal(false);
        } else {
          setTimeUntilNextJournal(null);
          setCanJournal(true);
        }
      } else {
        setTimeUntilNextJournal(null);
        setCanJournal(true);
      }
    } catch (error) {
      console.error('Error checking journal availability:', error);
    }
  };

  const handleNavigate = (screen: keyof SessionStackParamList) => {
    if (!canJournal) {
      Alert.alert(
        'Journal Locked',
        `You've already journaled today. Please come back in ${timeUntilNextJournal}.`,
        [{ text: 'OK' }]
      );
      return;
    }
    navigation.navigate(screen);
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      {timeUntilNextJournal && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            Next journal available in: {timeUntilNextJournal}
          </Text>
        </View>
      )}
      
      <Text style={styles.subHeader}>
        Choose how you want to journal for today.
      </Text>
      <Text style={styles.header}>Text</Text>
      <View style={styles.optionsGrid}>
        <View style={styles.row}>
          <Pressable
            onPress={() => handleNavigate("Type")}
            style={[styles.optionWrapper, !canJournal && styles.disabled]}
          >
            <Image
              style={styles.optionImage}
              source={require("../assets/type.png")}
              resizeMode="contain"
            />
          </Pressable>
          <Pressable
            onPress={() => handleNavigate("Chat")}
            style={[styles.optionWrapper, !canJournal && styles.disabled]}
          >
            <Image
              style={styles.optionImage}
              source={require("../assets/chat_ai.png")}
              resizeMode="contain"
            />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            onPress={() => handleNavigate("Prompt")}
            style={[styles.optionWrapper, !canJournal && styles.disabled]}
          >
            <Image
              style={styles.optionImage}
              source={require("../assets/prompt.png")}
              resizeMode="contain"
            />
          </Pressable>
          <Pressable
            onPress={() => handleNavigate("Gratitude")}
            style={[styles.optionWrapper, !canJournal && styles.disabled]}
          >
            <Image
              style={styles.optionImage}
              source={require("../assets/gratitude_based.png")}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>
      
      <Text style={styles.header}>Voice</Text>
      <View style={styles.optionsGrid}>
        <View style={styles.row}>
          <View style={[styles.optionWrapper, styles.locked]}>
            <Image
              style={styles.optionImage}
              source={require("../assets/monologue.png")}
              resizeMode="contain"
            />
            <Text style={styles.lockedText}>Coming Soon</Text>
          </View>
          <View style={[styles.optionWrapper, styles.locked]}>
            <Image
              style={styles.optionImage}
              source={require("../assets/dialogue.png")}
              resizeMode="contain"
            />
            <Text style={styles.lockedText}>Coming Soon</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fcfaf0",
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 20,
    marginBottom: 3,
  },
  subHeader: {
    fontSize: 16,
    color: "#474d41",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  optionsGrid: {
    width: '100%',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  optionWrapper: {
    width: '48%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionImage: {
    width: '100%',
    height: '100%',
  },
  locked: {
    opacity: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedText: {
    position: 'absolute',
    bottom: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  timerContainer: {
    backgroundColor: '#474d41',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  timerText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default SessionScreen;
