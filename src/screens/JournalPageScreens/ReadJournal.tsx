import * as React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

const ReadJournal = () => {
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
});

export default ReadJournal;
