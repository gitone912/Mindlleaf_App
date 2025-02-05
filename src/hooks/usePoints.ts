import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import eventEmitter, { EVENTS } from '../services/EventEmitter';

export const notifyPointsUpdated = () => {
  eventEmitter.emit(EVENTS.POINTS_UPDATED);
};

export const usePoints = (): number => {
  const [points, setPoints] = useState<number>(0);

  const loadPoints = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        setPoints(parsed.points || 0);
      }
    } catch (error) {
      console.error('Error loading points:', error);
    }
  };

  useEffect(() => {
    loadPoints();
    
    const subscription = eventEmitter.addListener(
      EVENTS.POINTS_UPDATED,
      loadPoints
    );
    
    return () => {
      subscription.remove();
    };
  }, []);

  return points;
};