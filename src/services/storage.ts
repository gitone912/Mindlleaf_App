import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserData {
  notification_time: string;
  notification_days: string[];
}

export const getUserData = async (): Promise<UserData | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('userData');
    if (jsonValue) {
      const parsedData = JSON.parse(jsonValue);
      return {
        notification_time: parsedData.notification_time,
        notification_days: parsedData.notification_days,
      };
    }
  } catch (error) {
    console.error('Error fetching user data from AsyncStorage:', error);
  }
  return null;
};
