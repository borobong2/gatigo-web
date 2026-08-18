import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseEnv } from './env';

export const createClient = () => {
  const { publishableKey, url } = getSupabaseEnv();
  return createBrowserClient(url, publishableKey);
};
