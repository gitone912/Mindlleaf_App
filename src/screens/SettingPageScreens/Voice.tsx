import * as React from "react";
import { StyleSheet, Text, Pressable, View, Modal, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateSettings } from '../../api/settingsApi';

const VoiceSelection = () => {
  const [selectedVoice, setSelectedVoice] = React.useState("William");
  const [showModal, setShowModal] = React.useState(false);
  const [tempVoice, setTempVoice] = React.useState('');
  const [userId, setUserId] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    loadUserDataAndSettings();
  }, []);

  const loadUserDataAndSettings = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserId(userData.user_id);
      }

      const settings = await AsyncStorage.getItem('userSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setSelectedVoice(parsedSettings.voiceType);
      } else {
        const defaultSettings = {
          voiceType: "William",
          language: "English",
          therapyType: "Cognitive-Behavioral"
        };
        await AsyncStorage.setItem('userSettings', JSON.stringify(defaultSettings));
        setSelectedVoice(defaultSettings.voiceType);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleVoiceSelect = (voice: string) => {
    setTempVoice(voice);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const currentSettings = await AsyncStorage.getItem('userSettings');
      const parsedSettings = currentSettings ? JSON.parse(currentSettings) : {
        language: "English",
        therapyType: "Cognitive-Behavioral"
      };

      const updatedSettings = {
        ...parsedSettings,
        voiceType: tempVoice
      };

      const response = await updateSettings(
        userId,
        tempVoice,
        updatedSettings.language,
        updatedSettings.therapyType
      );

      await AsyncStorage.setItem('userSettings', JSON.stringify(updatedSettings));
      setSelectedVoice(tempVoice);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating voice type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ConfirmationModal = () => (
    <Modal
      transparent={true}
      visible={showModal}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm Voice Change</Text>
          <Text style={styles.modalText}>
            Are you sure you want to change the voice to {tempVoice}?
          </Text>
          <View style={styles.modalButtons}>
            <Pressable 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
            <Pressable 
              style={[styles.modalButton, styles.confirmButton]} 
              onPress={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.modalButtonText}>Confirm</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice</Text>

      {["Laura", "William"].map((voice) => (
        <Pressable
          key={voice}
          style={[
            styles.button,
            selectedVoice === voice && styles.selectedButton,
          ]}
          onPress={() => handleVoiceSelect(voice)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedVoice === voice && styles.selectedButtonText,
            ]}
          >
            {voice}
          </Text>
        </Pressable>
      ))}

      <ConfirmationModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfaf0",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 40,
    color: "#000",
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#a7a7a7",
    borderRadius: 7,
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#fcfaf0",
  },
  selectedButton: {
    backgroundColor: "#474d41",
    borderColor: "#474d41",
  },
  buttonText: {
    fontSize: 16,
    color: "#979797",
  },
  selectedButtonText: {
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fcfaf0',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: '#979797',
  },
  confirmButton: {
    backgroundColor: '#474d41',
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  }
});

export default VoiceSelection;
