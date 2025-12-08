// File: src/actions/likes.ts
'use server';

import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleLike(doctorId: number) {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown';

  const existingLike = await prisma.doctorLike.findUnique({
    where: {
      doctorId_ipAddress: {
        doctorId,
        ipAddress,
      }
    }
  });

  if (existingLike) {
    // Unlike
    await prisma.doctorLike.delete({
      where: { id: existingLike.id }
    });
    await prisma.doctor.update({
      where: { id: doctorId },
      data: { likesCount: { decrement: 1 } }
    });
  } else {
    // Like
    await prisma.doctorLike.create({
      data: { doctorId, ipAddress }
    });
    await prisma.doctor.update({
      where: { id: doctorId },
      data: { likesCount: { increment: 1 } }
    });
  }

  revalidatePath(`/doctors/${doctorId}`);
  return { success: true };
}

export async function checkIfLiked(doctorId: number) {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown';

  const like = await prisma.doctorLike.findUnique({
    where: {
      doctorId_ipAddress: {
        doctorId,
        ipAddress,
      }
    }
  });

  return !!like;
}
