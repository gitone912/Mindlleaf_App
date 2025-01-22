import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import taskReducer from "./slices/actionSlice";
import mindReducer from "./slices/mindSlice";
import therapyReducer from './slices/therapySlice';
import moodReducer from "./slices/moodSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    mind: mindReducer,
    therapy: therapyReducer,
    mood: moodReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;