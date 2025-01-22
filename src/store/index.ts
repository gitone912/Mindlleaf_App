import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import taskReducer from "./slices/actionSlice";
import mindReducer from "./slices/mindSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    mind: mindReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;