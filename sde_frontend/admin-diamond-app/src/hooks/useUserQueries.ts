import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:3000/admin';
const DEFAULT_STALE_TIME = 1000 * 60 * 5; 

export const useUserQueries = () => {
  
  const useGetAllUsers = () => {
    return useQuery({
      queryKey: ['users', 'all'],
      queryFn: async () => {
        const { data } = await axios.get(`${API_URL}/getallusers`);
        return data;
      },
      staleTime: DEFAULT_STALE_TIME, //  stays for 5 mins
    });
  };

  const useGetUserDetails = (id: string | undefined) => {
    return useQuery({
      queryKey: ['users', 'detail', id],
      queryFn: async () => {
        const { data } = await axios.get(`${API_URL}/getuserdetails/${id}`);
        return data;
      },
      enabled: !!id,
      staleTime: 1000 * 60 * 10, //  stay fresh for 10 mins
    });
  };


  const useUserTrustScore = (id: string | undefined) => {
    return useQuery({
      queryKey: ['users', 'trust-score', id],
      queryFn: async () => {
        const { data } = await axios.get(`${API_URL}/${id}/trust-score`);
        return data;
      },
      enabled: !!id,
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: true, // Auto-update when admin switches back to tab
    });
  };

  const useGetUsersByRole = (role: string | undefined) => {
    return useQuery({
      // We include 'role' in the queryKey so that switching 
      // from 'seller' to 'buyer' triggers a new fetch/cache entry
      queryKey: ['users', 'role', role],
      queryFn: async () => {
        const { data } = await axios.get(`${API_URL}/getusersbyrole/${role}`);
        return data;
      },
      // Configuration
      enabled: !!role,           // Only fetch if a role is actually passed
      staleTime: 1000 * 60 * 10, // 10 minutes (Role lists don't change often)
      gcTime: 1000 * 60 * 30,    // Keep in garbage collection for 30 mins
    });
  };

  return {
    useGetAllUsers,
    useGetUserDetails,
    useUserTrustScore,
    useGetUsersByRole,
  };
};