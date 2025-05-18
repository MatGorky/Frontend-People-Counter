import getAxiosInstance from './axios';
import { CountItem } from '@/types/counter';

const axios = getAxiosInstance();

export interface ApiResponse {
  data: CountItem[];
}

export const fetchDailyCounts = async (date: string) => {
  const response = await axios.get<ApiResponse>(`data-tracker/daily/${date}`);
  return response;
};
