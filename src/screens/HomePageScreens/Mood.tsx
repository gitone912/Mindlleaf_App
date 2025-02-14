import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ReportScreen = () => {
  return (
    <View style={styles.container}>
      {/* Report Text at the Top */}
      <Text style={styles.title}>Report</Text>
      <Text style={styles.subtitle}>
        Based on your journal entries, here’s a psychological report you can submit to your therapist for accurate diagnosis and support.
      </Text>
      
      {/* Blurred Background */}
      <View style={styles.blurredContent}>
        {/* Placeholder for future content */}
      </View>
      
      {/* Coming Soon Overlay */}
      <View style={styles.comingSoonOverlay}>
        <Text style={styles.comingSoonText}>Coming Soon!</Text>
        <Text style={styles.comingSoonSubtext}>We're working on something amazing!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: "Ovo",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#979797",
    textAlign: "center",
    marginBottom: 20,
  },
  blurredContent: {
    flex: 1,
    opacity: 0.5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  comingSoonOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(252, 250, 240, 0.7)",
  },
  comingSoonText: {
    fontSize: 40,
    fontFamily: "Ovo",
    color: "#777",
    textAlign: "center",
    marginBottom: 10,
  },
  comingSoonSubtext: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#777",
    textAlign: "center",
  },
});

export default ReportScreen;
