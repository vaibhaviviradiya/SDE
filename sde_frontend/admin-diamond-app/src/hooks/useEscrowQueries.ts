import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

type Order = {
  _id: string;
  orderId: string;
  buyerId: {
    _id: string;
    ownerName: string;
    companyName: string;
  };
  sellerId: {
    _id: string;
    ownerName: string;
    companyName: string;
  };
  diamondId: {
    _id: string;
    price: number;
    shape: string;
    carat: number;
  };
  agreedPrice: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
};

export const useGetEscrowStats = () => {
  return useQuery<Order[]>({
    queryKey: ['escrow', 'all'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/escrow/all`, {
        validateStatus: (status) => status === 200 || status === 304,
      });
      const payload = response.data;

      if (!payload) {
        return [];
      }

      if (Array.isArray(payload)) {
        return payload;
      }

      if (Array.isArray((payload as any).data)) {
        return (payload as any).data;
      }

      return [];
    },
    staleTime: 1000 * 60 * 2,
  });
};

export const useVerifyDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await axios.put(`${API_URL}/escrow/verify-deposit/${orderId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escrow', 'all'] });
    },
  });
};

export const useReleaseFunds = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await axios.put(`${API_URL}/escrow/release-funds/${orderId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escrow', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['diamonds'] });
    },
  });
};