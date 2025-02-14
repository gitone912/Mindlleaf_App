import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchMoodData } from '../../store/slices/moodSlice';

const MoodGraphComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { moodData, loading, error } = useSelector((state: RootState) => state.mood);

  useEffect(() => {
    dispatch(fetchMoodData());
  }, [dispatch]);

  const getMoodStatement = () => {
    if (!moodData.length) return "No mood data available";
    
    const average = moodData.reduce((acc: number, curr: any) => acc + curr.value, 0) / moodData.length;
    
    if (average >= 90) {
      return "You're experiencing peak emotional well-being! Your positive outlook and engagement with life are creating meaningful experiences. Remember these moments as they shape your journey.";
    } else if (average >= 80) {
      return "Your emotional resilience is impressive. You're finding joy in daily activities and maintaining strong social connections. This balanced state reflects inner harmony.";
    } else if (average >= 70) {
      return "You're navigating life's challenges with grace. While not everything is perfect, you're maintaining a positive perspective and finding opportunities for growth.";
    } else if (average >= 60) {
      return "Your self-awareness is helping you maintain emotional stability. Small positive changes in your routine are contributing to your overall well-being.";
    } else if (average >= 50) {
      return "You're in a period of reflection and adjustment. Remember that it's natural to experience both ups and downs - this is part of the human experience.";
    } else if (average >= 40) {
      return "You might be feeling the weight of daily pressures. Consider incorporating mindful moments and gentle self-care practices into your routine.";
    } else if (average >= 30) {
      return "Life's challenges may feel more intense right now. Remember that seeking support and connection with others can provide new perspectives and comfort.";
    } else if (average >= 20) {
      return "You're showing strength by acknowledging your emotions. Small steps toward self-care and reaching out to trusted friends or professionals can make a difference.";
    } else if (average >= 10) {
      return "During these challenging moments, remember that emotions are temporary. Consider professional support to help navigate this period with compassion for yourself.";
    } else {
      return "You're experiencing a significant emotional challenge. Remember that seeking help is a sign of wisdom and strength. Professional support can provide valuable perspectives and coping strategies.";
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2e2e2e" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          {getMoodStatement()}
        </Text>
      </View>
      <View style={styles.chartContainer}>
        {moodData.map((data:any, index:any) => (
          <View key={index} style={styles.barContainer}>
            <Text style={styles.moodIcon}>{data.mood}</Text>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFilled,
                  { height: `${data.value}%` },
                ]}
              ></View>
            </View>
            <Text style={styles.dayLabel}>{data.day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fcfaf0",
    alignItems: "center",
    width: "100%",
  },
  title: {
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
    marginVertical: 10,
  },
  messageContainer: {
    backgroundColor: "#e8e4d8",
    paddingVertical: 20, // Increased padding for left/right spacing
    paddingHorizontal: 50,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  message: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#000",
    textAlign: "center",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20, // Added padding for the left and right sides
    width: "100%",
    marginTop: 20,
  },
  barContainer: {
    alignItems: "center",
    width: 35, // Reduced width for bars to minimize space between them
  },
  moodIcon: {
    fontSize: 18,
    marginBottom: 5,
  },
  barBackground: {
    width: 25, // Slightly wider bars
    height: 140, // Increased overall bar height
    backgroundColor: "#e8e4d8",
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  barFilled: {
    backgroundColor: "#2e2e2e",
    width: "100%",
    borderRadius: 12,
  },
  dayLabel: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#000",
    marginTop: 5,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    padding: 20,
  },
});

export default MoodGraphComponent;
