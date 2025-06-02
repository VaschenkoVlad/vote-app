import axios from 'axios';
import { Poll } from "./types";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchPolls = async (): Promise<Poll[]> => {
  try {
    const response = await api.get<Poll[]>('/polls');
    return response.data;
  } catch (error) {
    console.error('Error fetching polls:', error);
    throw error;
  }
};

export const createPoll = async (pollData: { title: string; options: string[] }): Promise<Poll> => {
  try {
    const response = await api.post<Poll>('/polls', { poll: pollData });
    return response.data;
  } catch (error) {
    console.error('Error creating poll:', error);
    throw error;
  }
};

export const fetchPollById = async (id: string): Promise<Poll> => {
  try {
    const response = await api.get<Poll>(`/polls/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching poll ${id}:`, error);
    throw error;
  }
};

export const updatePoll = async (id: string, pollData: { title: string; options: string[] }): Promise<Poll> => {
  try {
    const response = await api.patch<Poll>(`/polls/${id}`, pollData);
    return response.data;
  } catch (error) {
    console.error(`Error updating poll ${id}:`, error);
    throw error;
  }
};
