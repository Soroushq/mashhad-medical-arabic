// File: prisma/seed-attractions.ts
import { prisma } from '../src/lib/prisma'; // Use your existing prisma instance

async function main() {
  console.log('🌱 Seeding attraction categories...');

  const categories = [
    { nameAr: 'مطاعم', nameEn: 'Restaurants', icon: '🍽️', slug: 'restaurants' },
    { nameAr: 'مقاهي', nameEn: 'Cafes', icon: '☕', slug: 'cafes' },
    { nameAr: 'حدائق', nameEn: 'Parks', icon: '🌳', slug: 'parks' },
    { nameAr: 'أسواق', nameEn: 'Bazaars', icon: '🛍️', slug: 'bazaars' },
    { nameAr: 'معالم سياحية', nameEn: 'Tourist Sites', icon: '🕌', slug: 'tourist-sites' },
    { nameAr: 'فنادق', nameEn: 'Hotels', icon: '🏨', slug: 'hotels' },
    { nameAr: 'مراكز تسوق', nameEn: 'Shopping Malls', icon: '🏬', slug: 'malls' },
    { nameAr: 'ملاهي وترفيه', nameEn: 'Entertainment', icon: '🎡', slug: 'entertainment' },
  ];

  for (const cat of categories) {
    await prisma.attractionCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        ...cat,
        isActive: false,
        seoTitle: `${cat.nameAr} في مشهد`,
        seoDescription: `دليل شامل لأفضل ${cat.nameAr} في مدينة مشهد المقدسة`,
        seoKeywords: `${cat.nameAr}, مشهد, إيران, سياحة`,
      },
    });
  }

  console.log('✅ Categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
