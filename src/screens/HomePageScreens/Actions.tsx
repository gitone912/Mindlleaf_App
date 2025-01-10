import * as React from "react";
import { Image, StyleSheet, Text, View, FlatList } from "react-native";

const actionsData = [
  { id: "1", text: "Walk for 30 minutes outside.", completed: false },
  { id: "2", text: "Enroll to a hobby class.", completed: false },
  { id: "3", text: "Sleep at 9:00pm tonight.", completed: false },
  { id: "4", text: "Meditate for 15 minutes.", completed: false },
  { id: "5", text: "Read book for 30 minutes.", completed: true },
  { id: "6", text: "Call a friend for 10 minutes.", completed: true },
];

const ActionScreen = () => {
  const renderActionItem = ({ item }: { item: { id: string; text: string; completed: boolean } }) => (
    <View style={styles.actionRow}>
      <View
        style={[
          styles.actionItem,
          item.completed && styles.highlightedAction,
        ]}
      >
        <Text
          style={item.completed ? styles.actionTextHighlighted : styles.actionText}
        >
          {item.text}
        </Text>
      </View>
      <View style={styles.tickBox}>
        <Image
          style={styles.actionIcon}
          resizeMode="cover"
          source={
            item.completed
              ? require("../../assets/tickmark.png")
              : require("../../assets/tickmarkgrey.png")
          }
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Text style={styles.header}>Actions</Text>
      {/* Subheader Description */}
      <Text style={styles.subheaderText}>
        Based on your journal entries, here are recommended actions that you need to complete to improve your mental health.
      </Text>

      {/* Actions List */}
      <FlatList
        data={actionsData}
        renderItem={renderActionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.actionsList}
      />

      {/* Footer Navigation */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    fontFamily:'Ova'
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    
  },
  subheaderText: {
    fontSize: 14,
    color: "#979797",
    textAlign: "center",
    marginBottom: 20,
  },
  actionsList: {
    flexGrow: 1,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft:10
  },
  actionItem: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 7,
borderStyle: "solid",
borderColor: "#a7a7a7",
borderWidth: 0.5,
width: "100%",
height: 54,
  },
  highlightedAction: {
    backgroundColor: "#41ad49",
    borderColor: "#41ad49",
  },
  actionText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Inter-Regular",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
display: "flex",
  },
  actionTextHighlighted: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Inter-Regular",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
display: "flex",
  },
  tickBox: {
    width: 54,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#a7a7a7",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  actionIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eaeaea",
  },
  footerButton: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#6d6d6d",
  },
});

export default ActionScreen;
