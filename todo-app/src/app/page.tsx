'use client';

import { useAuth } from '@/hooks/use-auth';
import { AuthForm } from '@/components/auth-form';
import { TodoList } from '@/components/todo-list';
import { Button } from '@/components/ui/button';
import { authClient } from '@/components/providers';

export default function Home() {
  const { user, isLoading } = useAuth();

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Todo App with ABAC</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user.name || user.email} ({user.role})
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <TodoList />
      </main>
    </div>
  );
}
