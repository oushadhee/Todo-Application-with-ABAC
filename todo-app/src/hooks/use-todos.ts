import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/components/providers';

interface Todo {
  id: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';
  userId: string;
  user: {
    id: string;
    name?: string;
    email: string;
    role: 'USER' | 'MANAGER' | 'ADMIN';
  };
  createdAt: string;
  updatedAt: string;
}

export function useTodos(userId?: string) {
  return useQuery({
    queryKey: ['todos', userId],
    queryFn: async () => {
      const url = userId ? `/api/todos?userId=${userId}` : '/api/todos';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      return response.json() as Promise<Todo[]>;
    },
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; description?: string; status?: string }) => {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create todo');
      }
      return response.json() as Promise<Todo>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<{ title: string; description?: string; status: string }> }) => {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update todo');
      }
      return response.json() as Promise<Todo>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete todo');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}