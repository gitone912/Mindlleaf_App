import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMoodData } from '../../api/moodApi';

interface MoodData {
  day: string;
  value: number;
  mood: string;
}

interface MoodState {
  moodData: MoodData[];
  loading: boolean;
  error: string | null;
}

const getMoodEmoji = (value: number): string => {
  if (value >= 80) return '😁';
  if (value >= 60) return '🙂';
  if (value >= 40) return '😐';
  if (value >= 20) return '☹️';
  return '😞';
};

export const fetchMoodData = createAsyncThunk(
  'mood/fetchMoodData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMoodData();
      console.log(response)
      const moodWithEmojis = response.mood.mood.map((item: any) => ({
        ...item,
        mood: getMoodEmoji(item.value)
      }));
      return moodWithEmojis;
    } catch (error) {
      return rejectWithValue('Please complete more journal entries to get mood insights.');
    }
  }
);

const initialState: MoodState = {
  moodData: [],
  loading: false,
  error: null
};

const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoodData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoodData.fulfilled, (state, action) => {
        state.loading = false;
        state.moodData = action.payload;
      })
      .addCase(fetchMoodData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default moodSlice.reducer;
