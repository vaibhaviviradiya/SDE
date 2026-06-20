import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export type Dispute = {
  _id: string;
  orderId: any;
  raisedBy: any;
  raisedAgainst: any;
  reason: string;
  details?: string;
  attachments?: string[];
  status?: string;
  financeNotified?: boolean;
  createdAt?: string;
};

type DisputesResponse = {
  success: boolean;
  data: Dispute[];
};

export const useDisputeQueries = () => {
  const useGetAllDisputes = () => {
    return useQuery<Dispute[]>({
      queryKey: ['disputes', 'all'],
      queryFn: async () => {
        const { data } = await axios.get<DisputesResponse>(`${API_URL}/disputes`);
        return data.data || [];
      },
      staleTime: 1000 * 60,
      refetchInterval: 10000, // poll every 10s for new disputes
    });
  };

  const useGetDisputeById = (id?: string) => {
    return useQuery<Dispute | null>({
      queryKey: ['disputes', id],
      queryFn: async () => {
        if (!id) return null;
        const { data } = await axios.get(`${API_URL}/disputes/${id}`);
        return data.data || null;
      },
      enabled: !!id,
    });
  };

  const useMarkFinanceNotified = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const { data } = await axios.put(`${API_URL}/disputes/${id}/finance-notify`);
        return data;
      },
    });
  };

  return { useGetAllDisputes, useGetDisputeById, useMarkFinanceNotified };
};

export default useDisputeQueries;
