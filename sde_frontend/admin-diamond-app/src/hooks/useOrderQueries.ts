import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:3000/orders'; 
type CreateOrderData = {
  buyerId: string;
  sellerId: string;
  diamondId: string;
  quantity: number;
  totalPrice: number;
};

type UpdatePaymentData = {
  status: string;
};
export const useOrderQueries = () => {
  

  const useGetAllOrders = () => {
    return useQuery({
      queryKey: ['orders', 'all'],
      queryFn: async () => {
        const { data } = await axios.get(`${API_URL}/allorders`);
        return data;
      },
      staleTime: 1000 * 60 * 2, // 2 minutes
    });
  };

  const useGetOrderDetails = (orderId: string | undefined) => {
    return useQuery({
      queryKey: ['orders', 'detail', orderId],
      queryFn: async () => {
        const { data } = await axios.get(`${API_URL}/orders/${orderId}/order-details`);
        return data;
      },
      enabled: !!orderId, 
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  const useCreateOrder = () => {
    return useMutation({
      mutationFn: async (orderData: CreateOrderData) => {
        const { data } = await axios.post(`${API_URL}/orders/create`, orderData);
        return data;
      },
    });
  };

  const useUpdatePaymentStatus = () => {
    return useMutation({
      mutationFn: async ({ id, paymentData }: { id: string; paymentData: UpdatePaymentData }) => {
        const { data } = await axios.put(`${API_URL}/orders/${id}/payment`, paymentData);
        return data;
      },
    });
  };

  return {
    useGetAllOrders,
    useGetOrderDetails,
    useCreateOrder,
    useUpdatePaymentStatus,
  };
};