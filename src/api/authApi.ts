import axios from "axios";
import { BASE_URL_AUTH } from "./baseUrls";

interface SignupPayload {
  email: string;
}

export const signupUser = async (payload: SignupPayload): Promise<{ message: string }> => {
  const response = await axios.post(`${BASE_URL_AUTH}/signup`, payload);
  return response.data;
};
