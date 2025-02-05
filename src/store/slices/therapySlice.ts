import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { scheduleTherapy } from '../../api/therapyTasks.Api';

interface TherapyResponse {
  message: string;
  therapy: {
    therapy_id: string;
    user_id: string;
    therapy_name: string;
    session_time: string;
    points_used: number;
  };
}

interface TherapyState {
  loading: boolean;
  error: string | null;
  currentBooking: TherapyResponse | null;
}

export const bookTherapySession = createAsyncThunk<
  TherapyResponse,
  { userId: string; therapyName: string; pointsUsed: number }
>('therapy/bookSession', async ({ userId, therapyName, pointsUsed }) => {
  const response = await scheduleTherapy(userId, therapyName, pointsUsed);
  return response;
});

const initialState: TherapyState = {
  loading: false,
  error: null,
  currentBooking: null
};

const therapySlice = createSlice({
  name: 'therapy',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bookTherapySession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookTherapySession.fulfilled, (state, action: PayloadAction<TherapyResponse>) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(bookTherapySession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export default therapySlice.reducer;
