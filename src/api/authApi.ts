import axios from "axios";
import { BASE_URL_AUTH } from "./baseUrls";

interface SignupPayload {
  email: string;
}

interface SigninPayload {
  email: string;
  password: string;
}

interface OtpVerifyPayload {
  email: string;
  password: string;
  otp: string;
}

interface User {
  cover_choice: string;
  created_at: string;
  email: string;
  is_onboarded: boolean;
  name: string;
  notification_days: string[];
  notification_time: string;
  points: number;
  updated_at: string;
  user_id: string;
}

interface SigninResponse {
  message: string;
  user?: User;
}

export const signupUser = async (payload: SignupPayload): Promise<{ message: string }> => {
  const response = await axios.post(`${BASE_URL_AUTH}/signup`, payload);
  return response.data;
};

export const signinUser = async (payload: SigninPayload): Promise<SigninResponse> => {
  const response = await axios.post(`${BASE_URL_AUTH}/v1/users/sign-in`, payload);
  return response.data;
};

export const initiateSignup = async (payload: SignupPayload): Promise<{ message: string }> => {
  const response = await axios.post(`${BASE_URL_AUTH}/v1/users/sign-up`, payload);
  return response.data;
};

export const verifyOTP = async (payload: OtpVerifyPayload): Promise<SigninResponse> => {
  const response = await axios.post(`${BASE_URL_AUTH}/v1/users/verify-otp`, payload);
  return response.data;
};

interface SurveyPayload {
  userId: string;
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  question5: string;
}

export const submitSurvey = async (payload: SurveyPayload): Promise<{ message: string }> => {
  const response = await axios.post(`${BASE_URL_AUTH}/v1/surveys`, payload);
  return response.data;
};

interface UpdateUserPayload {
  userId: string;
  name: string;
  isOnboarded: boolean;
  notificationTime: string;
  notificationDays: string[];
  points: number;
  coverChoice: string;
  subscription:string;
}

export const updateUser = async (payload: UpdateUserPayload): Promise<{ message: string }> => {
  const response = await axios.post(`${BASE_URL_AUTH}/v1/users/update`, payload);
  return response.data;
};
