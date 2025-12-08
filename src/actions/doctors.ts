// File: src/actions/doctors.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAuth, canEdit, canDelete } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function createDoctor(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]);
  if (!auth.authorized) redirect(auth.redirect!);

  const data = {
    nameAr: formData.get('nameAr') as string,
    titleAr: formData.get('titleAr') as string,
    bioAr: formData.get('bioAr') as string,
    phone: formData.get('phone') as string,
    whatsapp: formData.get('whatsapp') as string,
    experience: parseInt(formData.get('experience') as string),
    locationAr: formData.get('locationAr') as string,
    categoryId: parseInt(formData.get('categoryId') as string),
    imageUrl: formData.get('imageUrl') as string || null,
  };

  await prisma.doctor.create({ data });
  revalidatePath('/');
  revalidatePath('/admin/doctors');
  redirect('/admin/doctors?success=created');
}

export async function updateDoctor(id: number, formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]);
  if (!auth.authorized) redirect(auth.redirect!);

  const data = {
    nameAr: formData.get('nameAr') as string,
    titleAr: formData.get('titleAr') as string,
    bioAr: formData.get('bioAr') as string,
    phone: formData.get('phone') as string,
    whatsapp: formData.get('whatsapp') as string,
    experience: parseInt(formData.get('experience') as string),
    locationAr: formData.get('locationAr') as string,
    categoryId: parseInt(formData.get('categoryId') as string),
    imageUrl: formData.get('imageUrl') as string || null,
  };

  await prisma.doctor.update({ where: { id }, data });
  revalidatePath('/');
  revalidatePath('/admin/doctors');
  revalidatePath(`/doctors/${id}`);
  redirect('/admin/doctors?success=updated');
}

export async function deleteDoctor(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN]);
  if (!auth.authorized) redirect('/admin');

  const id = parseInt(formData.get('id') as string);
  await prisma.doctor.delete({ where: { id } });
  
  revalidatePath('/');
  revalidatePath('/admin/doctors');
  redirect('/admin/doctors?success=deleted');
}

export async function toggleDoctorStatus(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN]);
  if (!auth.authorized) redirect('/admin');

  const id = parseInt(formData.get('id') as string);
  const doctor = await prisma.doctor.findUnique({ where: { id } });
  
  await prisma.doctor.update({
    where: { id },
    data: { isActive: !doctor?.isActive }
  });
  
  revalidatePath('/admin/doctors');
  redirect('/admin/doctors');
}
