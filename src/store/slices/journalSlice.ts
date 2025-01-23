import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface JournalState {
  currentJournal: {
    content: string;
    title: string;
    date: string;
    type: 'chat' | 'type' | 'prompt' | 'gratitude';
    chatHistory?: string[];
  } | null;
}

const initialState: JournalState = {
  currentJournal: null,
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    setCurrentJournal: (state, action: PayloadAction<JournalState['currentJournal']>) => {
      state.currentJournal = action.payload;
    },
    clearCurrentJournal: (state) => {
      state.currentJournal = null;
    },
  },
});

export const { setCurrentJournal, clearCurrentJournal } = journalSlice.actions;
export default journalSlice.reducer;
