import axios from 'axios';
import { BASE_URL_AUTH } from './baseUrls';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getMoodData = async () => {
  try {
    const userDataStr = await AsyncStorage.getItem('userData');
    
    if (!userDataStr) throw new Error('User data not found');
    
    // Fix: Parse JSON string only once and handle the 'userData|' prefix
    const cleanUserDataStr = userDataStr.replace('userData|', '');
    const userData = JSON.parse(cleanUserDataStr);
    
    const url = `${BASE_URL_AUTH}/v1/mood/${userData.user_id}`;
    
    const response = await axios.get(url);
    
    return response.data;
  } catch (error: any) {
    console.error('Mood API Error:', error.message);
    throw error;
  }
};
