import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:3000/escrow';

type EscrowStats = {
  totalEscrows: number;
  pendingDeposits: number;
  verifiedDeposits: number;
  releasedFunds: number;
};

export const useEscrowQueries = () => {
  const useGetEscrowStats = () => {
    return useQuery<EscrowStats>({
      queryKey: ['escrow', 'stats'],
      queryFn: async () => {
        const { data } = await axios.get(`${API_URL}/escrow/all`);
        return data;
      },
      staleTime: 1000 * 60 * 2, // 2 minutes
    });
  };

  const useVerifyDeposit = () => {
    return useMutation({
      mutationFn: async (orderId: string) => {
        const { data } = await axios.put(`${API_URL}/escrow/verify-deposit/${orderId}`);
        return data;
      },
    });
  };

  const useReleaseFunds = () => {
    return useMutation({
      mutationFn: async (orderId: string) => {
        const { data } = await axios.put(`${API_URL}/escrow/release-funds/${orderId}`);
        return data;
      },
    });
  };

  return {
    useGetEscrowStats,
    useVerifyDeposit,
    useReleaseFunds,
  };
};