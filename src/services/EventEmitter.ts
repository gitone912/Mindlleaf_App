import { NativeEventEmitter, NativeModule } from 'react-native';

class EventEmitterService extends NativeEventEmitter {
  constructor() {
    super({} as NativeModule);
  }
}

const eventEmitter = new EventEmitterService();

export const EVENTS = {
  POINTS_UPDATED: 'POINTS_UPDATED',
};

export default eventEmitter;