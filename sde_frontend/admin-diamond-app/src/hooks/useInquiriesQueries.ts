import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:3000/admin';

export type Inquiry = {
  _id: string;
  diamondId: {
    _id: string;
    shape: string;
    carat: number;
    color: string;
    price: number;
  };
  buyerId: {
    _id: string;
    role?: string;
    companyName: string;
    ownerName: string;
    trustScore?: number;
  };
  sellerId: {
    _id: string;
    role?: string;
    companyName: string;
    ownerName: string;
  };
  offeredPrice: number;
  currentStatus: string;
  message: string;
  isClosed: boolean;
  createdAt: string;
};

type InquiriesResponse = {
  success: boolean;
  data: Inquiry[];
};

type CreateInquiryData = {
  diamondId: string;
  offeredPrice: number;
  message: string;
};

type UpdateStatusData = {
  status: string;
};

export const useInquiriesQueries = () => {
  const useGetAllInquiries = () => {
    return useQuery<Inquiry[]>({
      queryKey: ['inquiries', 'all'],
      queryFn: async () => {
        const { data } = await axios.get<InquiriesResponse>(`${API_URL}/all-inquiries`);
        return data.data || [];
      },
      staleTime: 1000 * 60 * 2,
    });
  };

  const useGetDiamondInquiries = (diamondId: string | undefined) => {
    return useQuery<Inquiry[]>({
      queryKey: ['inquiries', 'diamond', diamondId],
      queryFn: async () => {
        if (!diamondId) return [];
        const { data } = await axios.get<InquiriesResponse>(`${API_URL}/diamond/${diamondId}/inquiries`);
        return data.data || [];
      },
      enabled: !!diamondId,
      staleTime: 1000 * 60 * 2,
    });
  };

  const useGetSellerInquiries = () => {
    return useQuery<Inquiry[]>({
      queryKey: ['inquiries', 'my-offers'],
      queryFn: async () => {
        const { data } = await axios.get<InquiriesResponse>(`${API_URL}/inquiries/my-offers`);
        return data.data || [];
      },
      staleTime: 1000 * 60 * 2,
    });
  };

  const useCreateInquiry = () => {
    return useMutation({
      mutationFn: async (inquiryData: CreateInquiryData) => {
        const { data } = await axios.post(`${API_URL}/inquiries/send`, inquiryData);
        return data;
      },
    });
  };

  const useUpdateInquiryStatus = () => {
    return useMutation({
      mutationFn: async ({ id, statusData }: { id: string; statusData: UpdateStatusData }) => {
        const { data } = await axios.put(`${API_URL}/inquiries/${id}/status`, statusData);
        return data;
      },
    });
  };

  return {
    useGetAllInquiries,
    useGetDiamondInquiries,
    useGetSellerInquiries,
    useCreateInquiry,
    useUpdateInquiryStatus,
  };
};