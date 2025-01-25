import axios from 'axios';
import { BASE_URL_SETTINGS } from './baseUrls';

export const updateSettings = async (
  userId: string,
  voiceType: string,
  language: string,
  therapyType: string
) => {
  const response = await axios.post(`${BASE_URL_SETTINGS}/update`, {
    userId,
    voiceType,
    language,
    therapyType,
  });
  return response.data;
};
