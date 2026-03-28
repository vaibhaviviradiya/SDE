import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:3000/admin';

export type Diamond = {
  _id?: string;
  labCertificate?: {
    lab: string;
    certificateNumber: string;
  };
  sellerId?: {
    _id?: string;
    companyName?: string;
  };
  shape?: string;
  carat?: number;
  color?: string;
  clarity?: string;
  cut?: string;
  polish?: string;
  price?: number;
  status?: string;
  createdAt?: string;
};

export const useDiamondQueries = () => {

  const useGetAllDiamonds = () => {
    return useQuery<Diamond[]>({
      queryKey: ['diamonds', 'all'],
      queryFn: async () => {
        const { data } = await axios.get(`${API_URL}/diamonds`);
        // backend may send { success, data: [diamonds] } or raw []
        if (data && Array.isArray(data)) {
          return data;
        }
        if (data && data.data && Array.isArray(data.data)) {
          return data.data;
        }
        return [];
      },
      staleTime: 1000 * 60 * 1,
      gcTime: 1000 * 60 * 15,
    });
  };

  const useGetDiamondDetails = (diamondId: string | undefined) => {
    return useQuery({
      queryKey: ['diamonds', 'detail', diamondId],
      queryFn: async () => {
        const { data } = await axios.get(`${API_URL}/diamonds/${diamondId}`);
        return data;
      },
      enabled: !!diamondId, 
      staleTime: 1000 * 60 * 5, 
    });
  };

  return {
    useGetAllDiamonds,
    useGetDiamondDetails,
  };
};