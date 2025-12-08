// File: src/actions/categories.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function createCategory(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN]);
  if (!auth.authorized) redirect(auth.redirect!);

  const nameAr = formData.get('nameAr') as string;
  const icon = formData.get('icon') as string;
  const slug = nameAr.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-أ-ي]/g, '');

  await prisma.category.create({
    data: { nameAr, icon, slug }
  });

  revalidatePath('/');
  revalidatePath('/admin/categories');
  redirect('/admin/categories?success=created');
}

export async function deleteCategory(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN]);
  if (!auth.authorized) redirect('/admin');

  const id = parseInt(formData.get('id') as string);
  await prisma.category.delete({ where: { id } });
  
  revalidatePath('/');
  revalidatePath('/admin/categories');
  redirect('/admin/categories?success=deleted');
}
