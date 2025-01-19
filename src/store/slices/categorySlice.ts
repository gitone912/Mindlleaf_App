import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchCategories, addCategory, deleteCategory } from "../../api/categoryApi";

interface CategoryState {
  categories: { id: string; name: string }[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

// Async thunk for fetching categories
export const getCategories = createAsyncThunk(
  "categories/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCategories();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch categories");
    }
  }
);

// Async thunk for adding a category
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (name: string, { rejectWithValue }) => {
    try {
      return await addCategory(name);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to add category");
    }
  }
);

// Async thunk for deleting a category
export const removeCategory = createAsyncThunk(
  "categories/removeCategory",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteCategory(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to delete category");
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action: PayloadAction<{ id: string; name: string }[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<{ id: string; name: string }>) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.categories = state.categories.filter((cat) => cat.id !== action.payload);
      })
      .addCase(removeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;
