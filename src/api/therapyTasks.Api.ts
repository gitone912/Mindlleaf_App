import axios from 'axios';
import { BASE_URL_AUTH } from './baseUrls';

export const scheduleTherapy = async (userId: string, therapyName: string, pointsUsed: number) => {
  try {
    const response = await axios.post(`${BASE_URL_AUTH}/v1/therapy/schedule`, {
      userId,
      therapyName,
      pointsUsed
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
