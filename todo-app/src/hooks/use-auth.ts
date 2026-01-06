import { useQuery } from '@tanstack/react-query';
import { authClient } from '@/components/providers';

export function useAuth() {
  const { data: session, isLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const session = await authClient.getSession();
      return session.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    user: session?.user,
    session,
    isLoading,
    isAuthenticated: !!session?.user,
  };
}