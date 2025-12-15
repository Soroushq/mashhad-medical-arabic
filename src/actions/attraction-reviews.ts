// File: src/actions/attraction-reviews.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function submitAttractionReview(formData: FormData) {
  const attractionId = parseInt(formData.get('attractionId') as string);
  
  const data = {
    attractionId,
    userName: formData.get('userName') as string,
    userEmail: formData.get('userEmail') as string || null,
    rating: parseInt(formData.get('rating') as string),
    comment: formData.get('comment') as string || null,
  };

  await prisma.attractionReview.create({ data });
  redirect(`/attractions/${attractionId}?success=review`);
}

export async function approveAttractionReview(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]);
  if (!auth.authorized) redirect('/admin');

  const id = parseInt(formData.get('id') as string);
  const review = await prisma.attractionReview.update({
    where: { id },
    data: { isApproved: true },
    include: { attraction: true }
  });

  // Recalculate attraction rating
  const approved = await prisma.attractionReview.findMany({
    where: { attractionId: review.attractionId, isApproved: true }
  });
  
  const avgRating = approved.reduce((sum, r) => sum + r.rating, 0) / approved.length;
  
  await prisma.attraction.update({
    where: { id: review.attractionId },
    data: { rating: avgRating }
  });

  revalidatePath('/admin/attraction-reviews');
  revalidatePath(`/attractions/${review.attractionId}`);
  redirect('/admin/attraction-reviews');
}

export async function deleteAttractionReview(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN]);
  if (!auth.authorized) redirect('/admin');

  const id = parseInt(formData.get('id') as string);
  const review = await prisma.attractionReview.findUnique({ where: { id } });
  
  await prisma.attractionReview.delete({ where: { id } });

  // Recalculate rating
  if (review) {
    const approved = await prisma.attractionReview.findMany({
      where: { attractionId: review.attractionId, isApproved: true }
    });
    
    const avgRating = approved.length > 0 
      ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length 
      : 0;
    
    await prisma.attraction.update({
      where: { id: review.attractionId },
      data: { rating: avgRating }
    });
  }

  revalidatePath('/admin/attraction-reviews');
  redirect('/admin/attraction-reviews?success=deleted');
}
