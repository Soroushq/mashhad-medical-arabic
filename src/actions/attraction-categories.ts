// File: src/actions/attraction-categories.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAuth, canEdit, canDelete } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function createAttractionCategory(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]);
  if (!auth.authorized) redirect(auth.redirect!);

  const nameAr = formData.get('nameAr') as string;
  const slug = nameAr.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');

  const data = {
    nameAr,
    nameEn: formData.get('nameEn') as string || null,
    icon: formData.get('icon') as string,
    slug,
    isActive: formData.get('isActive') === 'true',
    seoTitle: formData.get('seoTitle') as string || null,
    seoDescription: formData.get('seoDescription') as string || null,
    seoKeywords: formData.get('seoKeywords') as string || null,
  };

  await prisma.attractionCategory.create({ data });
  revalidatePath('/admin/attraction-categories');
  revalidatePath('/attractions');
  redirect('/admin/attraction-categories?success=created');
}

export async function updateAttractionCategory(id: number, formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]);
  if (!auth.authorized) redirect(auth.redirect!);

  const data = {
    nameAr: formData.get('nameAr') as string,
    nameEn: formData.get('nameEn') as string || null,
    icon: formData.get('icon') as string,
    isActive: formData.get('isActive') === 'true',
    seoTitle: formData.get('seoTitle') as string || null,
    seoDescription: formData.get('seoDescription') as string || null,
    seoKeywords: formData.get('seoKeywords') as string || null,
  };

  await prisma.attractionCategory.update({ where: { id }, data });
  revalidatePath('/admin/attraction-categories');
  revalidatePath('/attractions');
  redirect('/admin/attraction-categories?success=updated');
}

export async function deleteAttractionCategory(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN]);
  if (!auth.authorized) redirect('/admin');

  const id = parseInt(formData.get('id') as string);
  
  // Check if category has attractions
  const count = await prisma.attraction.count({ where: { categoryId: id } });
  if (count > 0) {
    redirect('/admin/attraction-categories?error=has_attractions');
  }

  await prisma.attractionCategory.delete({ where: { id } });
  revalidatePath('/admin/attraction-categories');
  revalidatePath('/attractions');
  redirect('/admin/attraction-categories?success=deleted');
}

export async function toggleCategoryStatus(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN]);
  if (!auth.authorized) redirect('/admin');

  const id = parseInt(formData.get('id') as string);
  const category = await prisma.attractionCategory.findUnique({ where: { id } });
  
  await prisma.attractionCategory.update({
    where: { id },
    data: { isActive: !category?.isActive }
  });
  
  revalidatePath('/admin/attraction-categories');
  revalidatePath('/attractions');
  redirect('/admin/attraction-categories');
}
