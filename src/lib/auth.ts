// File: src/lib/auth.ts
import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { Role } from '@prisma/client';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;
  
  if (!userId) return null;
  
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId), isActive: true },
    select: { id: true, username: true, name: true, role: true }
  });
  
  return user;
}

export async function requireAuth(requiredRoles?: Role[]) {
  const user = await getCurrentUser();
  
  if (!user) {
    return { authorized: false, user: null, redirect: '/admin/login' };
  }
  
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return { authorized: false, user, redirect: '/admin/unauthorized' };
  }
  
  return { authorized: true, user, redirect: null };
}

export function canEdit(userRole: Role): boolean {
  // Fix: Use array literal type instead of checking against hardcoded values
  const editRoles: Role[] = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];
  return editRoles.includes(userRole);
}

export function canDelete(userRole: Role): boolean {
  const deleteRoles: Role[] = ['SUPER_ADMIN', 'ADMIN'];
  return deleteRoles.includes(userRole);
}

export function canManageUsers(userRole: Role): boolean {
  return userRole === 'SUPER_ADMIN';
}
