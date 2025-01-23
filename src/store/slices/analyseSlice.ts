import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as analyseApi from '../../api/analyseApi';

interface AnalyseState {
  compiledJournal: string;
  summary: string;
  satisfactionScore: number;
  keywords: string;
  loading: {
    compile: boolean;
    summary: boolean;
    satisfaction: boolean;
    keywords: boolean;
  };
  error: string | null;
  isAnalyzing: boolean;  // Add this new property
}

const initialState: AnalyseState = {
  compiledJournal: '',
  summary: '',
  satisfactionScore: 0,
  keywords: '',
  loading: {
    compile: false,
    summary: false,
    satisfaction: false,
    keywords: false,
  },
  error: null,
  isAnalyzing: false,  // Add this new property
};

export const compileJournal = createAsyncThunk(
  'analyse/compileJournal',
  async (content: string) => {
    const response = await analyseApi.compileJournal(content);
    return response.journalEntry;
  }
);

export const getJournalSummary = createAsyncThunk(
  'analyse/getJournalSummary',
  async (journalEntry: string) => {
    const response = await analyseApi.getJournalSummary(journalEntry);
    return response.summary;
  }
);

export const getSatisfactionScore = createAsyncThunk(
  'analyse/getSatisfactionScore',
  async (journalEntry: string) => {
    const response = await analyseApi.getSatisfactionScore(journalEntry);
    return response.satisfactionScore;
  }
);

export const getKeywords = createAsyncThunk(
  'analyse/getKeywords',
  async (journalEntry: string) => {
    const response = await analyseApi.getKeywords(journalEntry);
    return response.keywords;
  }
);

const analyseSlice = createSlice({
  name: 'analyse',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(compileJournal.pending, (state) => {
        state.loading.compile = true;
        state.isAnalyzing = true;
      })
      .addCase(compileJournal.fulfilled, (state, action) => {
        state.loading.compile = false;
        state.compiledJournal = action.payload;
        // Check if all operations are complete
        state.isAnalyzing = state.loading.compile || state.loading.summary || 
                           state.loading.satisfaction || state.loading.keywords;
      })
      .addCase(compileJournal.rejected, (state) => {
        state.loading.compile = false;
      })
      .addCase(getJournalSummary.pending, (state) => {
        state.loading.summary = true;
      })
      .addCase(getJournalSummary.fulfilled, (state, action) => {
        state.loading.summary = false;
        state.summary = action.payload;
        state.isAnalyzing = state.loading.compile || state.loading.summary || 
                           state.loading.satisfaction || state.loading.keywords;
      })
      .addCase(getSatisfactionScore.pending, (state) => {
        state.loading.satisfaction = true;
      })
      .addCase(getSatisfactionScore.fulfilled, (state, action) => {
        state.loading.satisfaction = false;
        state.satisfactionScore = action.payload;
        state.isAnalyzing = state.loading.compile || state.loading.summary || 
                           state.loading.satisfaction || state.loading.keywords;
      })
      .addCase(getKeywords.pending, (state) => {
        state.loading.keywords = true;
      })
      .addCase(getKeywords.fulfilled, (state, action) => {
        state.loading.keywords = false;
        state.keywords = action.payload;
        state.isAnalyzing = state.loading.compile || state.loading.summary || 
                           state.loading.satisfaction || state.loading.keywords;
      });
  },
});

export default analyseSlice.reducer;
