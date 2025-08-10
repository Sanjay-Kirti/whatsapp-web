import useSWR from 'swr';
import { conversationsAPI } from '../lib/api';

export function useConversations() {
  const { data, error, mutate } = useSWR(
    'conversations',
    conversationsAPI.getConversations,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    conversations: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
