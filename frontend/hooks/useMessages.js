import useSWR from 'swr';
import { conversationsAPI } from '../lib/api';

export function useMessages(wa_id, options = {}) {
  const { limit = 50, skip = 0 } = options;
  
  const { data, error, mutate } = useSWR(
    wa_id ? [`messages-${wa_id}`, wa_id, { limit, skip }] : null,
    ([key, wa_id, params]) => conversationsAPI.getMessages(wa_id, params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    messages: data || [],
    isLoading: !error && !data && wa_id,
    isError: error,
    mutate,
  };
}
