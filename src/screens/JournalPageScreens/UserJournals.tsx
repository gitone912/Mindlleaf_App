import React from "react";
import { Text, StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type JournalStackParamList = {
  JournalMain: undefined;
  UserJournals: undefined;
  ReadJournal: undefined
};

type JournalScreenNavigationProp = StackNavigationProp<JournalStackParamList, 'JournalMain'>;

const UserJournals = () => {
  const navigation = useNavigation<JournalScreenNavigationProp>();
  return (
    <ScrollView style={styles.container}>
      {entries.map((entry, index) => (
        <TouchableOpacity key={index} style={styles.entryContainer} onPress={() => navigation.navigate('ReadJournal')}>
          <View style={styles.dateContainer} >
            <Text style={styles.date}>{entry.date}</Text>
            <Text style={styles.month}>Dec</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{entry.title}</Text>
            <Text style={styles.description}>{entry.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const entries = [
  {
    date: "18",
    title: "Reconnecting with Old Friends",
    description:
      "Catching up with an old friend was uplifting. Rekindling bonds reminded me of shared history. Staying connected holds deep value.",
  },
  {
    date: "17",
    title: "A Lesson in Patience",
    description:
      "A challenging morning taught me to practice patience. Slowing down revealed unexpected opportunities. The experience reshaped my perspective on delays.",
  },
  {
    date: "16",
    title: "The Power of a Smile",
    description:
      "A smile led to an unexpected, uplifting connection. This moment reinforced the value of simple kindness. Small gestures carry great power.",
  },
  {
    date: "15",
    title: "Finding Joy in the Ordinary",
    description:
      "Ordinary routines brought unexpected joy. Savoring small pleasures added richness to the day. Gratitude anchored my perspective.",
  },
  {
    date: "14",
    title: "Growth Through Discomfort",
    description:
      "Facing discomfort brought clarity and growth. Difficult moments often lead to positive change. Learning from challenges strengthened me.",
  },
  {
    date: "13",
    title: "Nature’s Whisper",
    description:
      "A walk in nature provided peace and renewal. Simple natural beauty has restorative power. I plan to connect with it more.",
  },
];

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
});

export default UserJournals;
