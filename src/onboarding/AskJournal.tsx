import * as React from "react";
import { Text, StyleSheet, View, Pressable, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
const AskJournal = ({ navigation }: any) => {
  React.useEffect(() => {
    const getSurveyResponses = async () => {
      try {
        const responses = await AsyncStorage.getItem('surveyResponses');
        if (responses) {
          console.log("Retrieved survey responses:", JSON.parse(responses));
        }
      } catch (error) {
        console.error("Error retrieving survey responses:", error);
      }
    };

    getSurveyResponses();
  }, []);
      return (
        <View style={styles.container}>
          {/* Subtitle */}
          <Text style={styles.subHeader}>
            Choose Your Journal Cover
          </Text>
    
          {/* Content Images */}
          <View style={styles.contentContainer}>
            <Image
              style={styles.contentImage}
              source={require("../assets/journalCovers/1.png")} // Replace with correct image path
            />
            <Image
              style={styles.contentImage}
              source={require("../assets/journalCovers/2.png")} // Replace with correct image path
            />
             <Image
              style={styles.contentImage}
              source={require("../assets/journalCovers/3.png")} // Replace with correct image path
            />
             <Image
              style={styles.contentImage}
              source={require("../assets/journalCovers/4.png")} // Replace with correct image path
            />
          </View>
    
          {/* Next Button */}
          <Pressable
            style={styles.nextButton}
            onPress={() => navigation.navigate("Main")} // Replace with the next screen or functionality
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: "#fcfaf0",
          alignItems: "center",
          paddingHorizontal: 20,
          justifyContent: "center",
        },
        header: {
          fontSize: 24,
          fontWeight: "600",
          color: "#000",
          marginTop: 50,
          marginBottom: 10,
          textAlign: "center",
        },
        stepCircle: {
          backgroundColor: "#474d41",
          width: 33,
          height: 33,
          borderRadius: 16.5,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
        },
        stepText: {
          color: "#fff",
          fontSize: 15,
          fontFamily: "Inter-Regular",
        },
        subHeader: {
          fontSize: 16,
          color: "#474d41",
          textAlign: "center",
          marginBottom: 30,
          paddingHorizontal: 30,
        },
        contentContainer: {
          flexDirection: "row",
          flexWrap: "wrap", // Enables wrapping
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: 40,
          paddingHorizontal: 40, // Adds padding for spacing
        },
        contentImage: {
          width: 120, // Adjust size for better layout
          height: 177,
          borderRadius: 7,
          marginBottom: 20, // Adds spacing between rows
          resizeMode: "cover",
        },
        nextButton: {
          backgroundColor: "#474d41",
          borderRadius: 25,
          paddingVertical: 12,
          paddingHorizontal: 40,
          position: "absolute",
          bottom: 40,
        },
        nextButtonText: {
          color: "#fcfaf0",
          fontSize: 16,
          textAlign: "center",
          fontFamily: "Inter-Regular",
        },
      });
      
    
    export default AskJournal;
    