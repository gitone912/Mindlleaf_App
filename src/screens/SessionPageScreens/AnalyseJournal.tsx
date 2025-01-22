import * as React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable } from "react-native";

const AnalyseJournal = () => {
  const actions = [
    "Call one old friend this week.",
    "Set a monthly reminder to check in with friends.",
    "Write a thank-you message to a close friend today.",
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.date}>December 18, 2024</Text>
          <Text style={styles.title}>Reconnecting with Old Friends</Text>
          <Text style={styles.body}>
            An unexpected call from an old friend completely brightened my day. It
            had been years since we last spoke, and yet, as soon as I heard their
            voice, it felt like no time had passed at all. We dove into a lively
            conversation, reminiscing about the adventures and mischief we shared
            when life seemed a little simpler and freer. There was laughter, a
            hint of nostalgia, and a realization that some connections remain
            deeply rooted no matter how much time has gone by.

            We spoke about everything—our families, careers, dreams, and even
            some of the struggles we’ve faced since we last connected. What stood
            out most was how natural it felt to share these updates, as though
            the foundation of trust and understanding we built years ago remained
            untouched. It reminded me of the unique beauty of old friendships:
            they carry a sense of comfort, familiarity, and shared history that
            can’t be replicated elsewhere.

            At the same time, I couldn’t help but think about how easily life
            gets in the way of maintaining relationships. The years flew by so
            quickly, and neither of us made the effort to reach out until now.
            This call was a wake-up call—a reminder that nurturing connections
            like these takes intention and effort. Friendships this meaningful
            are rare and deserve to be valued.

            I ended the conversation feeling lighter, happier, and more motivated
            to reconnect with others I may have unintentionally drifted away
            from. Life is too short to let time and distance weaken the bonds we
            hold dear. From now on, I want to be more proactive in keeping these
            connections alive and thriving. There’s something truly special about
            old friends—they’re like a mirror reflecting a part of yourself that
            only they can understand. I don’t want to lose that again.
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
