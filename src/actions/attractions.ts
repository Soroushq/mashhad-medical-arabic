// File: src/actions/attractions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Role, PriceRange } from '@prisma/client';

export async function createAttraction(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]);
  if (!auth.authorized) redirect(auth.redirect!);

  const nameAr = formData.get('nameAr') as string;
  const slug = `${nameAr}-${Date.now()}`.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');

  // Parse images JSON array
  const imagesRaw = formData.get('images') as string;
  const images = imagesRaw ? JSON.stringify(JSON.parse(imagesRaw)) : '[]';

  const data = {
    nameAr,
    nameEn: formData.get('nameEn') as string || null,
    descriptionAr: formData.get('descriptionAr') as string,
    descriptionEn: formData.get('descriptionEn') as string || null,
    categoryId: parseInt(formData.get('categoryId') as string),
    address: formData.get('address') as string,
    phone: formData.get('phone') as string || null,
    whatsapp: formData.get('whatsapp') as string || null,
    website: formData.get('website') as string || null,
    mapLink: formData.get('mapLink') as string || null,
    mapImageUrl: formData.get('mapImageUrl') as string || null,
    images,
    priceRange: (formData.get('priceRange') as PriceRange) || null,
    openingHours: formData.get('openingHours') as string || null,
    isFeatured: formData.get('isFeatured') === 'true',
    slug,
    seoTitle: formData.get('seoTitle') as string || null,
    seoDescription: formData.get('seoDescription') as string || null,
    seoKeywords: formData.get('seoKeywords') as string || null,
  };

  await prisma.attraction.create({ data });
  revalidatePath('/attractions');
  revalidatePath('/admin/attractions');
  redirect('/admin/attractions?success=created');
}

export async function updateAttraction(id: number, formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]);
  if (!auth.authorized) redirect(auth.redirect!);

  const imagesRaw = formData.get('images') as string;
  const images = imagesRaw ? JSON.stringify(JSON.parse(imagesRaw)) : '[]';

  const data = {
    nameAr: formData.get('nameAr') as string,
    nameEn: formData.get('nameEn') as string || null,
    descriptionAr: formData.get('descriptionAr') as string,
    descriptionEn: formData.get('descriptionEn') as string || null,
    categoryId: parseInt(formData.get('categoryId') as string),
    address: formData.get('address') as string,
    phone: formData.get('phone') as string || null,
    whatsapp: formData.get('whatsapp') as string || null,
    website: formData.get('website') as string || null,
    mapLink: formData.get('mapLink') as string || null,
    mapImageUrl: formData.get('mapImageUrl') as string || null,
    images,
    priceRange: (formData.get('priceRange') as PriceRange) || null,
    openingHours: formData.get('openingHours') as string || null,
    isFeatured: formData.get('isFeatured') === 'true',
    seoTitle: formData.get('seoTitle') as string || null,
    seoDescription: formData.get('seoDescription') as string || null,
    seoKeywords: formData.get('seoKeywords') as string || null,
  };

  await prisma.attraction.update({ where: { id }, data });
  revalidatePath('/attractions');
  revalidatePath('/admin/attractions');
  revalidatePath(`/attractions/${id}`);
  redirect('/admin/attractions?success=updated');
}

export async function deleteAttraction(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN]);
  if (!auth.authorized) redirect('/admin');

  const id = parseInt(formData.get('id') as string);
  await prisma.attraction.delete({ where: { id } });
  
  revalidatePath('/attractions');
  revalidatePath('/admin/attractions');
  redirect('/admin/attractions?success=deleted');
}

export async function toggleAttractionStatus(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN]);
  if (!auth.authorized) redirect('/admin');

  const id = parseInt(formData.get('id') as string);
  const attraction = await prisma.attraction.findUnique({ where: { id } });
  
  await prisma.attraction.update({
    where: { id },
    data: { isActive: !attraction?.isActive }
  });
  
  revalidatePath('/admin/attractions');
  redirect('/admin/attractions');
}
