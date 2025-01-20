import axios from "axios";
import { BASE_URL_AUTH } from "./baseUrls";

interface SignupPayload {
  email: string;
}

interface SigninPayload {
  email: string;
  password: string;
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
