// File: src/app/attractions/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { submitAttractionReview } from '@/actions/attraction-reviews';
import { checkIfAttractionLiked } from '@/actions/attraction-likes';
import { AttractionLikeButton } from '@/components/AttractionLikeButton';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const attraction = await prisma.attraction.findUnique({
    where: { id: parseInt(id) },
  });

  if (!attraction) return { title: 'المكان غير موجود' };

  return {
    title: attraction.seoTitle || `${attraction.nameAr} | دليل مشهد الطبي`,
    description: attraction.seoDescription || attraction.descriptionAr.substring(0, 160),
    keywords: attraction.seoKeywords || `${attraction.nameAr}, مشهد, سياحة`,
  };
}

export default async function AttractionDetailPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const search = await searchParams;
  
  const attraction = await prisma.attraction.findUnique({
    where: { id: parseInt(id), isActive: true },
    include: {
      category: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!attraction) notFound();

  // Increment view count
  await prisma.attraction.update({
    where: { id: attraction.id },
    data: { viewsCount: { increment: 1 } },
  });

  const isLiked = await checkIfAttractionLiked(attraction.id);
  const images = JSON.parse(attraction.images || '[]') as string[];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Gallery */}
      {images.length > 0 && (
        <div className="bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
              <div className="md:col-span-2 h-96 rounded-xl overflow-hidden">
                <img
                  src={images[0]}
                  alt={attraction.nameAr}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-rows-2 gap-2">
                  {images.slice(1, 3).map((img, idx) => (
                    <div key={idx} className="h-full rounded-xl overflow-hidden">
                      <img
                        src={img}
                        alt={`${attraction.nameAr} ${idx + 2}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              {search.success === 'review' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
                  ✅ تم إرسال تقييمك بنجاح! سيظهر بعد الموافقة عليه.
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{attraction.category.icon}</span>
                    <span className="text-sm text-gray-500">{attraction.category.nameAr}</span>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{attraction.nameAr}</h1>
                  {attraction.nameEn && (
                    <p className="text-lg text-gray-500">{attraction.nameEn}</p>
                  )}
                </div>
                {attraction.isFeatured && (
                  <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl font-bold text-sm">
                    مميز
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-1">
                  <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-2xl font-bold text-gray-900">{attraction.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({attraction.reviews.length} تقييم)</span>
                </div>

                <AttractionLikeButton attractionId={attraction.id} initialLiked={isLiked} initialCount={attraction.likesCount} />

                <div className="flex items-center gap-2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{attraction.viewsCount} مشاهدة</span>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="whitespace-pre-wrap leading-relaxed">{attraction.descriptionAr}</p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">التقييمات</h2>
              
              {attraction.reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">لا توجد تقييمات بعد. كن أول من يقيّم!</p>
              ) : (
                <div className="space-y-4 mb-8">
                  {attraction.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-900">{review.userName}</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      {review.comment && <p className="text-gray-700">{review.comment}</p>}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString('ar')}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Review Form */}
              <form action={submitAttractionReview} className="space-y-4 border-t pt-6">
                <h3 className="font-bold text-gray-900">أضف تقييمك</h3>
                <input type="hidden" name="attractionId" value={attraction.id} />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم *</label>
                  <input
                    name="userName"
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    name="userEmail"
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التقييم *</label>
                  <select
                    name="rating"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ ممتاز</option>
                    <option value="4">⭐⭐⭐⭐ جيد جداً</option>
                    <option value="3">⭐⭐⭐ جيد</option>
                    <option value="2">⭐⭐ مقبول</option>
                    <option value="1">⭐ ضعيف</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تعليقك</label>
                  <textarea
                    name="comment"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 resize-none"
                    placeholder="شاركنا تجربتك..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
                >
                  إرسال التقييم
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-4 space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">معلومات الاتصال</h3>
                
                {attraction.phone && (
                  <a href={`tel:${attraction.phone}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition mb-2" dir="ltr">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-900 font-medium">{attraction.phone}</span>
                  </a>
                )}

                {attraction.whatsapp && (
                  <a href={`https://wa.me/${attraction.whatsapp}`} target="_blank" className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span className="text-green-700 font-medium">واتساب</span>
                  </a>
                )}

                {attraction.website && (
                  <a href={attraction.website} target="_blank" className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span className="text-blue-700 font-medium">الموقع الإلكتروني</span>
                  </a>
                )}
              </div>

              {/* Location */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">الموقع</h3>
                <div className="flex items-start gap-2 text-gray-700 mb-3">
                  <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{attraction.address}</span>
                </div>
                
                {attraction.mapLink && (
                  <a
                    href={attraction.mapLink}
                    target="_blank"
                    className="block w-full bg-gray-900 text-white text-center py-3 rounded-lg font-bold hover:bg-gray-800 transition"
                  >
                    عرض على الخريطة
                  </a>
                )}

                {attraction.mapImageUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <img src={attraction.mapImageUrl} alt="Map" className="w-full h-auto" loading="lazy" />
                  </div>
                )}
              </div>

              {/* Price & Hours */}
              {(attraction.priceRange || attraction.openingHours) && (
                <div className="space-y-3 pt-6 border-t">
                  {attraction.priceRange && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">النطاق السعري:</span>
                      <span className="font-bold text-gray-900">
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
                    </div>
                  )}
                  
                  {attraction.openingHours && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">ساعات العمل:</span>
                      <span className="font-medium text-gray-900">{attraction.openingHours}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
