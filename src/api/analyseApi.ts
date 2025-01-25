import axios from 'axios';
import { BASE_URL_AUTH } from './baseUrls';

export const compileJournal = async (content: string) => {
  const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/compilejournal`, {
    language: "English",
    chatHistory: [content]
  });
  return response.data;
};

export const getJournalSummary = async (journalEntry: string) => {
  const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/journalsummary`, {
    language: "English",
    journalEntry
  });
  return response.data;
};

export const getSatisfactionScore = async (journalEntry: string) => {
  const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/satisfactionscore`, {
    language: "English",
    journalEntry
  });
  return response.data;
};

export const getKeywords = async (journalEntry: string) => {
  const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/getkeywords`, {
    language: "English",
    journalEntry
  });
  return response.data;
};

export const getRecommendedActions = async (journalEntry: string) => {
  try {
    console.log('Making API call to get recommended actions...');
    const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/getrecommendedactions`, {
      language: "English",
      journalEntry
    });
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export const getJournalTitle = async (journalEntry: string) => {
  const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/getjournaltitle`, {
    language: "English",
    journalEntry
  });
  return response.data;
};

export const createJournal = async (journalData: {
  userId: string;
  type: string;
  originalContent: string;
  content: string;
  moodEmoji: string;
  moodKeywords: string[];
  summary: string;
  actions: string[];
}) => {
  try {
    const response = await axios.post(`${BASE_URL_AUTH}/v1/journal/create`, journalData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });
    return response.data;
  } catch (error: any) {
    console.error('Journal creation error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(error.response?.data?.message || 'Failed to create journal entry');
  }
};

export const updateJourneyStreak = async (userId: string, utcOffset: number) => {
  try {
    const response = await axios.post(`${BASE_URL_AUTH}/v1/journey/update`, {
      userId,
      utcOffset
    });
    return response.data;
  } catch (error: any) {
    console.error('Journey update error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update journey streak');
  }
};
