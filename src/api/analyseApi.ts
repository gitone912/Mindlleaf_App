import axios from 'axios';
import { BASE_URL_AUTH } from './baseUrls';

export const compileJournal = async (content: string) => {
  const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/compilejournal`, {
    language: "English",
    chatHistory: [content]
  });
  return response.data;
};

export const getJournalSummary = async (journalEntry: string) => {
  const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/journalsummary`, {
    language: "English",
    journalEntry
  });
  return response.data;
};

export const getSatisfactionScore = async (journalEntry: string) => {
  const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/satisfactionscore`, {
    language: "English",
    journalEntry
  });
  return response.data;
};

export const getKeywords = async (journalEntry: string) => {
  const response = await axios.post(`${BASE_URL_AUTH}/v1/gpt/getkeywords`, {
    language: "English",
    journalEntry
  });
  return response.data;
};
