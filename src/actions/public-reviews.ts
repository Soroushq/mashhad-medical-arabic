// File: src/actions/public-reviews.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function submitReview(formData: FormData) {
  const userName = formData.get('userName') as string;
  const userEmail = formData.get('userEmail') as string;
  const rating = parseInt(formData.get('rating') as string);
  const comment = formData.get('comment') as string;
  const doctorId = parseInt(formData.get('doctorId') as string);

  if (!userName || !rating || !doctorId) {
    redirect(`/doctors/${doctorId}?error=missing`);
  }

  await prisma.review.create({
    data: {
      userName,
      userEmail: userEmail || null,
      rating,
      comment: comment || null,
      doctorId,
      isApproved: false,
    }
  });

  // Track analytics
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  await prisma.analytics.upsert({
    where: { date: today },
    update: { reviews: { increment: 1 } },
    create: {
      date: today,
      reviews: 1,
    }
  });

  revalidatePath(`/doctors/${doctorId}`);
  redirect(`/doctors/${doctorId}?success=review`);
}
