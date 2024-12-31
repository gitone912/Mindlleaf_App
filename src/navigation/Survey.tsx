import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const Survey = ({ navigation }: any) => {
  const questions = [
    "Why do you want to use mindleaf?",
    "What do you want to focus on?",
    "How often do you plan to use this app?",
    "What is your primary goal?",
    "How do you feel right now?",
  ];

  const options = [
    ["Journal easily", "Develop self-reflection habits", "Improve mental health", "Reduce stress or anxiety", "Something else"],
    ["Work-life balance", "Better sleep", "Mindfulness", "Time management", "Other"],
    ["Daily", "Weekly", "Occasionally", "Rarely", "Not sure yet"],
    ["Happiness", "Calmness", "Clarity", "Productivity", "Other"],
    ["Very happy", "Content", "Neutral", "Stressed", "Anxious"],
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(Array(questions.length).fill(null));
  const [otherText, setOtherText] = useState("");
  const [showSomethingElseInput, setShowSomethingElseInput] = useState(false);

  const handleOptionPress = (option: string) => {
    if (option === "Something else" && currentQuestionIndex === 0) {
      setShowSomethingElseInput(true);
      setSelectedOptions((prev) => {
        const updated = [...prev];
        updated[currentQuestionIndex] = option;
        return updated;
      });
    } else {
      setShowSomethingElseInput(false);
      const updatedSelections = [...selectedOptions];
      updatedSelections[currentQuestionIndex] = option;
      setSelectedOptions(updatedSelections);
      setOtherText(""); // Clear "Something else" text if another option is selected
    }
  };

  const handleNext = () => {
    const updatedSelections = [...selectedOptions];

    if (selectedOptions[currentQuestionIndex] === "Something else" && currentQuestionIndex === 0) {
      updatedSelections[currentQuestionIndex] = otherText;
    }

    setSelectedOptions(updatedSelections);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowSomethingElseInput(false); // Reset "Something else" input visibility
    } else {
      console.log("Survey completed:", updatedSelections);
      navigation.replace('Login');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowSomethingElseInput(false); // Reset "Something else" input visibility
    }
  };

  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <View style={styles.stepIndicatorContainer}>
        <View
          style={{
            height: 4,
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            backgroundColor: '#333',
            borderRadius: 2,
          }}
        />
      </View>

      {/* Question */}
      <Text style={styles.questionText}>{questions[currentQuestionIndex]}</Text>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {!showSomethingElseInput &&
          options[currentQuestionIndex].map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOptions[currentQuestionIndex] === option && styles.selectedOptionButton,
              ]}
              onPress={() => handleOptionPress(option)}
            >
              <Text style={[
                styles.optionText,
                selectedOptions[currentQuestionIndex] === option && styles.selectedOptionText,
              ]}>{option}</Text>
            </TouchableOpacity>
          ))}

        {/* "Something else" text input */}
        {showSomethingElseInput && (
          <TextInput
            style={styles.textInput}
            placeholder="Please specify"
            value={otherText}
            onChangeText={(text) => setOtherText(text)}
            
          />
        )}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.navigationButton,
            (!selectedOptions[currentQuestionIndex] || (selectedOptions[currentQuestionIndex] === "Something else" && currentQuestionIndex === 0 && otherText.trim() === "")) && { backgroundColor: '#CCC' },
          ]}
          onPress={handleNext}
          disabled={
            !selectedOptions[currentQuestionIndex] ||
            (selectedOptions[currentQuestionIndex] === "Something else" && currentQuestionIndex === 0 && otherText.trim() === "")
          }
        >
          <Text style={styles.navigationButtonText}>Next</Text>
        </TouchableOpacity>
        {currentQuestionIndex > 0 && (
          <TouchableOpacity style={styles.navigationButtonBack} onPress={handleBack}>
            <Text style={styles.navigationButtonTextBack}>Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF9EE',
    justifyContent: 'space-between',
  },
  stepIndicatorContainer: {
    height: 4,
    width: '100%',
    backgroundColor: '#EEE',
    borderRadius: 2,
    marginVertical: 20,
    overflow: 'hidden',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: '#FDFBF5',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  selectedOptionButton: {
    borderColor: '#333',
    backgroundColor: "#474d41", // Dark background for selected option
  },
  selectedOptionText: {
    color: '#FFF', // White text for selected option
    fontWeight: '600',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#cfcfcf",
    borderStyle: "solid",
    borderRadius: 28,
    padding: 15,
    marginVertical: 20,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFF9EE',
    alignSelf: 'center',
    width: '85%',
    textAlign: 'center',
    height: 150,
    marginBottom: 30, // Adjust spacing to prevent overlap
  },
  navigationButtonsContainer: {
    flexDirection: 'column',
    alignItems: 'center', // Center the buttons
    justifyContent: 'center',
    marginVertical: 20,
    gap: 10, // Reduce the space between buttons
  },
  navigationButton: {
    backgroundColor: '#333', // Black background for Next button
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    alignItems: 'center',
  },
  navigationButtonText: {
    fontSize: 16,
    color: '#FFF', // White text for Next button
  },
  navigationButtonBack: {
    backgroundColor: 'transparent', // Transparent background for Back button
    borderWidth: 1, // Black border
    borderColor: '#000',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    alignItems: 'center',
  },
  navigationButtonBackText: {
    fontSize: 16,
    color: '#000', // Black text for Back button
  },
  navigationButtonTextBack: {
    fontSize: 16,
    color: 'black', // White text for Next button
  },
});


export default Survey;
