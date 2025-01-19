import axios from "axios";
import { BASE_URL_CATEGORY } from "./baseUrls";

// Define the API response types
interface Category {
  id: string;
  name: string;
}

// Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${BASE_URL_CATEGORY}/categories`);
  return response.data;
};

// Add a new category
export const addCategory = async (name: string): Promise<Category> => {
  const response = await axios.post(`${BASE_URL_CATEGORY}/categories`, { name });
  return response.data;
};

// Delete a category
export const deleteCategory = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL_CATEGORY}/categories/${id}`);
};
