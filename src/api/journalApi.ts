import axios from 'axios';
import { BASE_URL_AUTH } from './baseUrls';
import { getUserSettings } from './userSettings';

export const getGreeting = async (firstName: string) => {
  const settings = await getUserSettings();
  try {
    const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/getgreetings`, {
      language: settings.language,
      voice: settings.voiceType,
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
  history: string[]
) => {
  const settings = await getUserSettings();
  try {
    const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/sendmessage`, {
      voice: settings.voiceType,
      language: settings.language,
      chatInput,
      firstName,
      History: history,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGratitudePrompt = async (userId: string) => {
  const settings = await getUserSettings();
  try {
    const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/getgratitude`, {
      language: settings.language,
      userId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJournalPrompt = async (userId: string) => {
  const settings = await getUserSettings();
  try {
    const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/getprompt`, {
      language: settings.language,
      userId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
