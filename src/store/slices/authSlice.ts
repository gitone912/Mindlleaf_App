import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signupUser, signinUser } from "../../api/authApi";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  loading: boolean;
  error: string | null;
  message: string | null;
  user: any | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  message: null,
  user: null,
};

// Async thunk for signup
export const signup = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: string }
>("auth/signup", async (payload, { rejectWithValue }) => {
  try {
    return await signupUser(payload);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Signup failed");
  }
});

export const signin = createAsyncThunk(
  "auth/signin",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await signinUser(payload);
      console.log('Signin response:', response);
      
      if (response.message === "User not found") {
        return rejectWithValue("User not found");
      }
      
      if (response.user) {
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
      }
      return response;
    } catch (error: any) {
      console.log('Error during signin:', error);
      return rejectWithValue(error.response?.data?.message || "Sign in failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearMessage(state) {
      state.message = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.user = action.payload.user || null;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessage, clearError } = authSlice.actions;
export default authSlice.reducer;
