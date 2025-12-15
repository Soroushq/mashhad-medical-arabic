// File: src/app/attractions/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata = {
  title: 'الأماكن السياحية والترفيهية في مشهد | دليل مشهد الطبي',
  description: 'اكتشف أفضل المطاعم، المقاهي، الحدائق، الأسواق والمعالم السياحية في مدينة مشهد المقدسة',
  keywords: 'مشهد، سياحة، مطاعم، مقاهي، حدائق، معالم سياحية، إيران',
};

async function AttractionsContent({ 
  categoryId, 
  priceRange 
}: { 
  categoryId?: string; 
  priceRange?: string; 
}) {
  const attractions = await prisma.attraction.findMany({
    where: {
      isActive: true,
      ...(categoryId && { categoryId: parseInt(categoryId) }),
      ...(priceRange && { priceRange: priceRange as any }),
    },
    include: { category: true },
    orderBy: [
      { isFeatured: 'desc' },
      { rating: 'desc' },
      { createdAt: 'desc' }
    ],
  });

  const categories = await prisma.attractionCategory.findMany({
    where: { isActive: true },
    include: { _count: { select: { attractions: true } } },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">الأماكن السياحية والترفيهية</h1>
          <p className="text-xl text-gray-300">اكتشف أجمل الأماكن في مدينة مشهد المقدسة</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-r-4 border-gray-900 pr-3">
                تصفية النتائج
              </h3>

              {/* Categories Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">التصنيفات</h4>
                <div className="space-y-2">
                  <Link
                    href="/attractions"
                    className={`block px-4 py-2 rounded-lg transition ${
                      !categoryId
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    الكل ({attractions.length})
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/attractions?category=${cat.id}`}
                      className={`block px-4 py-2 rounded-lg transition flex items-center justify-between ${
                        categoryId === cat.id.toString()
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.nameAr}</span>
                      </span>
                      <span className="text-sm">({cat._count.attractions})</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">النطاق السعري</h4>
                <div className="space-y-2">
                  {[
                    { value: '', label: 'الكل' },
                    { value: 'FREE', label: 'مجاني' },
                    { value: 'BUDGET', label: 'اقتصادي' },
                    { value: 'MODERATE', label: 'متوسط' },
                    { value: 'EXPENSIVE', label: 'مرتفع' },
                    { value: 'VERY_EXPENSIVE', label: 'مرتفع جداً' },
                  ].map((price) => (
                    <Link
                      key={price.value}
                      href={`/attractions${categoryId ? `?category=${categoryId}` : ''}${
                        price.value ? `${categoryId ? '&' : '?'}price=${price.value}` : ''
                      }`}
                      className={`block px-4 py-2 rounded-lg transition ${
                        priceRange === price.value || (!priceRange && !price.value)
                          ? 'bg-purple-100 text-purple-700 font-medium'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {price.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Attractions Grid */}
          <div className="lg:col-span-3">
            {attractions.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border p-16 text-center">
                <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-500 text-lg">لا توجد أماكن متاحة حالياً</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {attractions.map((attraction) => {
                  const images = JSON.parse(attraction.images || '[]') as string[];
                  const firstImage = images[0] || '/placeholder-attraction.jpg';

                  return (
                    <Link
                      key={attraction.id}
                      href={`/attractions/${attraction.id}`}
                      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border"
                    >
                      {/* Image */}
                      <div className="relative h-48 bg-gray-200 overflow-hidden">
                        <img
                          src={firstImage}
                          alt={attraction.nameAr}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                        {attraction.isFeatured && (
                          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                            مميز
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <span>{attraction.category.icon}</span>
                          <span>{attraction.category.nameAr}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition line-clamp-1">
                          {attraction.nameAr}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {attraction.descriptionAr}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-bold text-gray-900">{attraction.rating.toFixed(1)}</span>
                          </div>

                          {attraction.priceRange && (
                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                              {
                                {
                                  FREE: 'مجاني',
                                  BUDGET: 'اقتصادي',
                                  MODERATE: 'متوسط',
                                  EXPENSIVE: 'مرتفع',
                                  VERY_EXPENSIVE: 'مرتفع جداً',
                                }[attraction.priceRange]
                              }
                            </span>
                          )}
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-2 mt-3 pt-3 border-t text-sm text-gray-500">
                          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="line-clamp-1">{attraction.address}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function AttractionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; price?: string }>;
}) {
  const params = await searchParams;

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AttractionsContent categoryId={params.category} priceRange={params.price} />
    </Suspense>
  );
}
