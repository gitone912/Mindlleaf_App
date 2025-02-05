
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserSettings {
  voiceType: string;
  language: string;
  therapyType: string;
}

export const getUserSettings = async (): Promise<UserSettings> => {
  try {
    const settings = await AsyncStorage.getItem('userSettings');
    return settings ? JSON.parse(settings) : { voiceType: 'William', language: 'English', therapyType: 'Behavioral' };
  } catch (error) {
    console.error('Error getting user settings:', error);
    return { voiceType: 'William', language: 'English', therapyType: 'Behavioral' };
  }
};