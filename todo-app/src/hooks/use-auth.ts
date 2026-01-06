import { useQuery } from '@tanstack/react-query';
import { authClient } from '@/components/providers';

export function useAuth() {
  const { data: session, isLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const session = await authClient.getSession();
      if (session.data?.user) {
        // Fetch user with role from API
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const userData = await response.json();
          return { ...session.data, user: { ...session.data.user, role: userData.role } };
        }
      }
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