// File: src/app/doctors/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LikeButton } from "@/components/LikeButton";
import { checkIfLiked } from "@/actions/likes";
import { submitReview } from "@/actions/public-reviews";
import { Suspense } from "react";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const doctor = await prisma.doctor.findUnique({
    where: { id: parseInt(id) },
    include: { category: true }
  });

  if (!doctor) return { title: 'طبيب غير موجود' };

  return {
    title: `${doctor.nameAr} - ${doctor.titleAr} | دليل مشهد الطبي`,
    description: doctor.bioAr.substring(0, 160),
    keywords: [doctor.nameAr, doctor.category.nameAr, 'طبيب', 'مشهد'],
  };
}

export default async function DoctorDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const query = await searchParams;
  
  const doctor = await prisma.doctor.findUnique({
    where: { id: parseInt(id), isActive: true },
    include: { 
      category: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
        take: 20
      }
    }
  });

  if (!doctor) notFound();

  // Track page view
  await prisma.doctor.update({
    where: { id: doctor.id },
    data: { viewsCount: { increment: 1 } }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await prisma.analytics.upsert({
    where: { date: today },
    update: { 
      pageViews: { increment: 1 },
      doctorViews: { increment: 1 }
    },
    create: {
      date: today,
      pageViews: 1,
      doctorViews: 1
    }
  });

  const isLiked = await checkIfLiked(doctor.id);
  const whatsappMessage = encodeURIComponent(
    `مرحباً، أريد حجز موعد مع الدكتور ${doctor.nameAr}`
  );

  return (
    <div className="space-y-4 md:max-w-5xl md:mx-auto md:py-8">
      {/* Success/Error Messages */}
      {query.success === 'review' && (
        <div className="mx-4 p-4 bg-green-50 border-2 border-green-200 text-green-700 rounded-xl flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-bold">تم إرسال تقييمك بنجاح!</p>
            <p className="text-sm">سيظهر بعد مراجعة الإدارة</p>
          </div>
        </div>
      )}

      {/* Doctor Header */}
      <div className="bg-gradient-to-br from-mashhad-600 to-mashhad-900 md:rounded-2xl md:mx-4 md:shadow-xl">
        <div className="p-6 md:p-8 text-white">
          <div className="flex items-start gap-4 mb-6">
            {doctor.imageUrl ? (
              <img 
                src={doctor.imageUrl} 
                alt={doctor.nameAr}
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-white/30 shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/30 shadow-xl">
                <span className="text-4xl md:text-5xl font-bold">{doctor.nameAr.charAt(0)}</span>
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{doctor.nameAr}</h1>
              <p className="text-mashhad-100 mb-3">{doctor.titleAr}</p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
                  <span className="text-gold-300 text-lg">⭐</span>
                  <span className="font-bold">{doctor.rating.toFixed(1)}</span>
                  <span className="text-xs text-mashhad-100">({doctor.reviews.length})</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full text-sm">
                  {doctor.experience} سنوات خبرة
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full text-sm flex items-center gap-1">
                  <span>👁️</span>
                  <span>{doctor.viewsCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://wa.me/${doctor.whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-3 rounded-xl font-bold transition shadow-lg text-center"
            >
              <span className="text-xl">💬</span>
              <span>واتساب</span>
            </a>
            <a
              href={`tel:${doctor.phone}`}
              className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-xl font-bold transition shadow-lg border-2 border-white/30 text-center"
            >
              <span className="text-xl">📞</span>
              <span>اتصال</span>
            </a>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Category & Like */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/doctors?cat=${doctor.categoryId}`}
            className="flex-1 bg-white border-2 border-purple-200 rounded-xl p-4 flex items-center gap-3 hover:border-purple-400 transition"
          >
            <div className="text-3xl">{doctor.category.icon || '📋'}</div>
            <div>
              <div className="text-xs text-purple-600 font-medium">التخصص</div>
              <div className="font-bold text-gray-900">{doctor.category.nameAr}</div>
            </div>
          </Link>
          
          <Suspense fallback={<div className="w-24 h-20 bg-gray-100 rounded-xl animate-pulse" />}>
            <LikeButton 
              doctorId={doctor.id} 
              initialLikes={doctor.likesCount} 
              initialLiked={isLiked}
            />
          </Suspense>
        </div>

        {/* Bio */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📝</span>
            <span>نبذة تعريفية</span>
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{doctor.bioAr}</p>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>📍</span>
            <span>الموقع</span>
          </h2>
          <p className="text-gray-700">{doctor.locationAr}</p>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>⭐</span>
            <span>تقييمات المرضى</span>
            {doctor.reviews.length > 0 && (
              <span className="text-sm font-normal text-gray-500">({doctor.reviews.length})</span>
            )}
          </h2>
          
          {doctor.reviews.length > 0 ? (
            <div className="space-y-4">
              {doctor.reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="font-semibold text-gray-900">{review.userName}</span>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`${i < review.rating ? 'text-gold-500' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">⭐</div>
              <p>كن أول من يقيم هذا الطبيب</p>
            </div>
          )}
        </div>

        {/* Review Submission Form */}
        <div className="bg-gradient-to-br from-mashhad-50 to-mashhad-100 rounded-2xl p-6 border-2 border-mashhad-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>✍️</span>
            <span>شارك تجربتك</span>
          </h3>
          
          <form action={submitReview} className="space-y-4">
            <input type="hidden" name="doctorId" value={doctor.id} />
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                الاسم *
              </label>
              <input
                name="userName"
                type="text"
                required
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
                placeholder="أحمد محمد"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                البريد الإلكتروني (اختياري)
              </label>
              <input
                name="userEmail"
                type="email"
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                التقييم *
              </label>
              <div className="flex gap-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <label key={star} className="flex-1">
                    <input
                      type="radio"
                      name="rating"
                      value={star}
                      required
                      className="peer hidden"
                    />
                    <div className="cursor-pointer bg-white border-2 border-gray-200 rounded-xl p-3 text-center hover:border-gold-400 peer-checked:bg-gold-500 peer-checked:border-gold-500 peer-checked:text-white transition">
                      <div className="text-2xl mb-1">{'⭐'.repeat(star)}</div>
                      <div className="text-xs font-medium">{star}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                تعليقك (اختياري)
              </label>
              <textarea
                name="comment"
                rows={4}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition resize-none"
                placeholder="شارك تجربتك مع الطبيب..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-mashhad-600 text-white py-3 rounded-xl font-bold hover:bg-mashhad-700 transition shadow-md hover:shadow-lg"
            >
              إرسال التقييم
            </button>
            
            <p className="text-xs text-gray-600 text-center">
              سيتم مراجعة تقييمك قبل نشره للتأكد من جودة المحتوى
            </p>
          </form>
        </div>

        {/* Back Button */}
        <Link
          href="/doctors"
          className="flex items-center justify-center gap-2 bg-white text-gray-700 p-4 rounded-xl font-bold hover:bg-gray-50 transition border-2 border-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>العودة إلى قائمة الأطباء</span>
        </Link>
      </div>
    </div>
  );
}
