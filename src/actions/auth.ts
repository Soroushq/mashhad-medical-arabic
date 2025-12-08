// File: src/actions/auth.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/password';

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    redirect('/admin/login?error=missing');
  }

  const user = await prisma.user.findUnique({
    where: { username, isActive: true }
  });

  if (!user || !verifyPassword(password, user.password)) {
    redirect('/admin/login?error=invalid');
  }

  const cookieStore = await cookies();
  cookieStore.set('user_id', user.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  redirect('/admin');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('user_id');
  redirect('/admin/login');
}

export async function createInitialAdmin() {
  const existingUser = await prisma.user.findFirst();
  
  if (existingUser) {
    redirect('/admin/login?error=exists');
  }

  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashPassword('admin123'),
      name: 'Super Admin',
      role: 'SUPER_ADMIN'
    }
  });

  redirect('/admin/login?success=created');
}
