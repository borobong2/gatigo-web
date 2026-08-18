import DashboardScreen from '@/screens/dashboard';
import { hasSupabaseEnv } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';

const DashboardPage = async () => {
  if (!hasSupabaseEnv()) {
    return <DashboardScreen />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <DashboardScreen email={user?.email} />;
};

export const dynamic = 'force-dynamic';

export default DashboardPage;
