// File: src/actions/users.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAuth, canManageUsers } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import { Role } from '@prisma/client';

export async function createUser(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN]);
  if (!auth.authorized || !canManageUsers(auth.user!.role)) redirect('/admin');

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const role = formData.get('role') as Role;

  await prisma.user.create({
    data: {
      username,
      password: hashPassword(password),
      name,
      role
    }
  });

  revalidatePath('/admin/users');
  redirect('/admin/users?success=created');
}

export async function toggleUserStatus(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN]);
  if (!auth.authorized) redirect('/admin');

  const id = parseInt(formData.get('id') as string);
  const user = await prisma.user.findUnique({ where: { id } });
  
  await prisma.user.update({
    where: { id },
    data: { isActive: !user?.isActive }
  });

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function deleteUser(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN]);
  if (!auth.authorized) redirect('/admin');

  const id = parseInt(formData.get('id') as string);
  
  // Prevent deleting self
  if (id === auth.user!.id) {
    redirect('/admin/users?error=self');
  }

  await prisma.user.delete({ where: { id } });

  revalidatePath('/admin/users');
  redirect('/admin/users?success=deleted');
}
