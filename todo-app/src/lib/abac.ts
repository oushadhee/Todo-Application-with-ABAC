import type { Role, Status } from '@prisma/client';

export function canViewTodo(userRole: Role, todoUserId: string, currentUserId: string): boolean {
  return userRole === 'MANAGER' || userRole === 'ADMIN' || todoUserId === currentUserId;
}

export function canCreateTodo(userRole: Role): boolean {
  return userRole === 'USER';
}

export function canUpdateTodo(userRole: Role, todoUserId: string, currentUserId: string): boolean {
  return userRole === 'USER' && todoUserId === currentUserId;
}

export function canDeleteTodo(userRole: Role, todoStatus: Status, todoUserId: string, currentUserId: string): boolean {
  if (userRole === 'USER') return todoUserId === currentUserId && todoStatus === 'DRAFT';
  if (userRole === 'ADMIN') return true;
  return false;
}