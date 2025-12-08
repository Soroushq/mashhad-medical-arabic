// File: src/actions/reviews.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function approveReview(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]);
  if (!auth.authorized) redirect('/admin');

  const id = parseInt(formData.get('id') as string);
  await prisma.review.update({
    where: { id },
    data: { isApproved: true }
  });

  const review = await prisma.review.findUnique({ where: { id } });
  if (review) {
    const approvedReviews = await prisma.review.findMany({
      where: { doctorId: review.doctorId, isApproved: true }
    });
    const avgRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length;
    
    await prisma.doctor.update({
      where: { id: review.doctorId },
      data: { rating: avgRating }
    });
  }

  revalidatePath('/admin/reviews');
  redirect('/admin/reviews');
}

export async function deleteReview(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN]);
  if (!auth.authorized) redirect('/admin');

  const id = parseInt(formData.get('id') as string);
  await prisma.review.delete({ where: { id } });

  revalidatePath('/admin/reviews');
  redirect('/admin/reviews?success=deleted');
}

export async function replyToReview(formData: FormData) {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]);
  if (!auth.authorized) redirect('/admin');

  const reviewId = parseInt(formData.get('reviewId') as string);
  const message = formData.get('message') as string;

  await prisma.reviewReply.create({
    data: {
      reviewId,
      userId: auth.user!.id,
      message
    }
  });

  revalidatePath('/admin/reviews');
  redirect('/admin/reviews');
}
