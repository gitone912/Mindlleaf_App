import axios from 'axios';
import { BASE_URL_AUTH } from './baseUrls';

export const getGreeting = async (firstName: string, language = 'English', voice = 'William') => {
  try {
    const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/getgreetings`, {
      language,
      voice,
      firstname: firstName,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendMessage = async (
  chatInput: string,
  firstName: string,
  history: string[],
  language = 'English',
  voice = 'Laura'
) => {
  try {
    const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/sendmessage`, {
      voice,
      language,
      chatInput,
      firstName,
      History: history,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Make sure these exports are properly exposed
export const getGratitudePrompt = async (userId: string, language = 'English') => {
  try {
    const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/getgratitude`, {
      language,
      userId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJournalPrompt = async (userId: string, language = 'English') => {
  try {
    const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/getprompt`, {
      language,
      userId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
