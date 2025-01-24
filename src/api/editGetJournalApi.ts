import { BASE_URL_JOURNAL } from "./baseUrls";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getJournals = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (!userData) throw new Error('No user data found');
    
    const { user_id } = JSON.parse(userData);
    const response = await fetch(`${BASE_URL_JOURNAL}/${user_id}`);
    
    if (!response.ok) throw new Error('Failed to fetch journals');
    const data = await response.json();
    return data; // API returns object with journal IDs as keys
  } catch (error) {
    console.error('Error fetching journals:', error);
    throw error;
  }
};

export const updateJournal = async (journalId: string, data: {
  content: string;
  moodEmoji: string;
  moodKeywords: string[];
  actions: string[];
  summary: string;
  type: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL_JOURNAL}/edit/${journalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to update journal');
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};
