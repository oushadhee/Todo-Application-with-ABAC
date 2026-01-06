'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreateTodo, useUpdateTodo } from '@/hooks/use-todos';
import { Status } from '@prisma/client';

interface TodoFormProps {
  todo?: {
    id: string;
    title: string;
    description?: string;
    status: Status;
  };
  trigger: React.ReactNode;
}

export function TodoForm({ todo, trigger }: TodoFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [status, setStatus] = useState<Status>(todo?.status || Status.DRAFT);

  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();

  const isEditing = !!todo;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      if (isEditing) {
        await updateTodo.mutateAsync({
          id: todo.id,
          data: { title, description, status }
        });
      } else {
        await createTodo.mutateAsync({ title, description, status });
      }
      setOpen(false);
      setTitle('');
      setDescription('');
      setStatus(Status.DRAFT);
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && !isEditing) {
      setTitle('');
      setDescription('');
      setStatus(Status.DRAFT);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Todo' : 'Create Todo'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update your todo item.' : 'Add a new todo item to your list.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">
                Status
              </label>
              <Select value={status} onValueChange={(value) => setStatus(value as Status)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Status.DRAFT}>Draft</SelectItem>
                  <SelectItem value={Status.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={Status.COMPLETED}>Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createTodo.isPending || updateTodo.isPending}>
              {createTodo.isPending || updateTodo.isPending ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}