'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTodos, useUpdateTodo, useDeleteTodo } from '@/hooks/use-todos';
import { useAuth } from '@/hooks/use-auth';
import { TodoForm } from '@/components/todo-form';
import { canUpdateTodo, canDeleteTodo } from '@/lib/abac';
import { Status } from '@prisma/client';
import { Edit, Trash2, Plus } from 'lucide-react';

interface Todo {
  id: string;
  title: string;
  description?: string;
  status: Status;
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

function TodoCard({ todo }: { todo: Todo }) {
  const { user } = useAuth();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  if (!user) return null;

  const canEdit = canUpdateTodo((user as any).role, todo.userId, user.id);
  const canRemove = canDeleteTodo((user as any).role, todo.status, todo.userId, user.id);

  const handleStatusChange = async (newStatus: Status) => {
    try {
      await updateTodo.mutateAsync({
        id: todo.id,
        data: { status: newStatus }
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo.mutateAsync(todo.id);
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.DRAFT:
        return 'bg-gray-100 text-gray-800';
      case Status.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case Status.COMPLETED:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{todo.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(todo.status)}>
              {todo.status.replace('_', ' ')}
            </Badge>
            {canEdit && (
              <Select value={todo.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Status.DRAFT}>Draft</SelectItem>
                  <SelectItem value={Status.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={Status.COMPLETED}>Completed</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <CardDescription>
          By {todo.user.name || todo.user.email} • {new Date(todo.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      {todo.description && (
        <CardContent>
          <p className="text-sm text-gray-600">{todo.description}</p>
        </CardContent>
      )}
      {(canEdit || canRemove) && (
        <CardContent className="pt-0">
          <div className="flex gap-2">
            {canEdit && (
              <TodoForm
                todo={todo}
                trigger={
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                }
              />
            )}
            {canRemove && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={deleteTodo.isPending}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export function TodoList() {
  const { user } = useAuth();
  const { data: todos, isLoading, error } = useTodos();

  if (isLoading) {
    return <div className="text-center py-8">Loading todos...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error loading todos</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Todos</h1>
        {(user as any)?.role === 'USER' && (
          <TodoForm
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Add Todo
              </Button>
            }
          />
        )}
      </div>

      {todos && todos.length > 0 ? (
        <div className="grid gap-4">
          {todos.map((todo) => (
            <TodoCard key={todo.id} todo={todo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No todos found. {user?.role === 'USER' && 'Create your first todo!'}
        </div>
      )}
    </div>
  );
}