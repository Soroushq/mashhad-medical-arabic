// File: src/actions/attraction-likes.ts
'use server';

import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function toggleAttractionLike(attractionId: number) {
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : headersList.get('x-real-ip') || 'unknown';

  const existing = await prisma.attractionLike.findUnique({
    where: { attractionId_ipAddress: { attractionId, ipAddress: ip } }
  });

  if (existing) {
    await prisma.attractionLike.delete({ where: { id: existing.id } });
    await prisma.attraction.update({
      where: { id: attractionId },
      data: { likesCount: { decrement: 1 } }
    });
    return { liked: false };
  } else {
    await prisma.attractionLike.create({ data: { attractionId, ipAddress: ip } });
    await prisma.attraction.update({
      where: { id: attractionId },
      data: { likesCount: { increment: 1 } }
    });
    return { liked: true };
  }
}

export async function checkIfAttractionLiked(attractionId: number): Promise<boolean> {
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : headersList.get('x-real-ip') || 'unknown';

  const existing = await prisma.attractionLike.findUnique({
    where: { attractionId_ipAddress: { attractionId, ipAddress: ip } }
  });

  return !!existing;
}
