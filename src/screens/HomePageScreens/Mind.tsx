import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../../store/hooks';
import { getMindData } from '../../store/slices/mindSlice';
import { MindData } from '../../api/mindTaskApi';

const MindScreen = () => {
  const dispatch = useAppDispatch();
  const [latestMind, setLatestMind] = useState<MindData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const { user_id } = JSON.parse(userData);
          const result = await dispatch(getMindData(user_id)).unwrap();
          
          // Find the latest entry with proper typing
          const entries = Object.values(result) as MindData[];
          if (entries.length > 0) {
            const latest = entries.reduce((prev: MindData, current: MindData) => {
              return new Date(prev.created_at) > new Date(current.created_at) ? prev : current;
            });
            
            setLatestMind(latest);
          }
        }
      } catch (error) {
        console.error('Error fetching mind data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>MindScreen</Text>

      {/* Status Section */}
      <Text style={styles.subtitle}>Based on your journal entries, here’s a snapshot of your mental health status.</Text>
      <View style={styles.statusWrapper}>
        <Text style={styles.statusText}>{latestMind?.title || 'Loading...'}</Text>
      </View>

      {/* Description Section */}
      <View style={styles.descriptionWrapper}>
        <Text style={styles.descriptionText}>
          {latestMind ? 
            latestMind.insight 
            : 
            "No data available yet. Please continue journaling for at least one day to receive insights about your mental health status."
          }
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Talk to a therapist</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Journal</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontFamily: "Ovo",
    color: "#000",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#979797",
    textAlign: "center",
    marginVertical: 20,
    lineHeight: 20,
  },
  statusWrapper: {
    backgroundColor: "#b78418",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 10,
  },
  statusText: {
    fontSize: 25,
    color: "#fff",
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
  descriptionWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#b2b0b0",
    padding: 17,
    marginVertical: 15,
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#979797",
    lineHeight: 20,
    textAlign: "justify",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#474d41",
    borderRadius: 7,
    padding: 10,
    marginHorizontal: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Inter-Regular",
  },
});

export default MindScreen;
