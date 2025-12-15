// File: src/app/admin/attraction-reviews/page.tsx
import { AdminWrapper } from '@/components/AdminWrapper';
import { prisma } from '@/lib/prisma';
import { requireAuth, canEdit, canDelete } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { approveAttractionReview, deleteAttractionReview } from '@/actions/attraction-reviews';
import { DeleteButton } from '@/components/DeleteButton';

export default async function AttractionReviewsPage() {
  const auth = await requireAuth();
  if (!auth.authorized) redirect(auth.redirect!);

  const canUserEdit = canEdit(auth.user!.role);
  const canUserDelete = canDelete(auth.user!.role);

  const [pending, approved] = await Promise.all([
    prisma.attractionReview.findMany({
      where: { isApproved: false },
      include: { attraction: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.attractionReview.findMany({
      where: { isApproved: true },
      include: { attraction: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);

  return (
    <AdminWrapper>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة تقييمات الأماكن السياحية</h1>
            <p className="text-gray-500 mt-1">مراجعة واعتماد تقييمات الزوار</p>
          </div>
        </div>

        {/* Pending reviews */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">قيد المراجعة</h2>
            <span className="px-3 py-1 text-xs rounded-full bg-orange-50 text-orange-700">
              {pending.length} تقييم بانتظار الموافقة
            </span>
          </div>

          {pending.length === 0 ? (
            <p className="text-gray-500 text-sm">لا توجد تقييمات قيد المراجعة حالياً.</p>
          ) : (
            <div className="space-y-4">
              {pending.map((review) => (
                <div
                  key={review.id}
                  className="border border-orange-100 rounded-xl p-4 bg-orange-50/40 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{review.userName}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleString('ar')}
                        </span>
                      </div>
                      <a
                        href={`/attractions/${review.attractionId}`}
                        target="_blank"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {review.attraction.nameAr}
                      </a>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {review.comment && <p className="text-sm text-gray-800">{review.comment}</p>}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {review.userEmail || 'بدون بريد إلكتروني'}
                    </span>
                    <div className="flex gap-2">
                      {canUserEdit && (
                        <form action={approveAttractionReview}>
                          <input type="hidden" name="id" value={review.id} />
                          <button
                            type="submit"
                            className="px-4 py-1.5 text-xs rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                          >
                            اعتماد
                          </button>
                        </form>
                      )}
                      {canUserDelete && (
                        <form action={deleteAttractionReview}>
                          <input type="hidden" name="id" value={review.id} />
                          <DeleteButton
                            message="هل أنت متأكد من حذف هذا التقييم؟"
                            className="px-4 py-1.5 text-xs rounded-lg text-red-600 hover:bg-red-50 transition"
                            title="حذف"
                          >
                            حذف
                          </DeleteButton>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Approved reviews */}
        <section className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">آخر التقييمات المعتمدة</h2>
            <span className="text-xs text-gray-400">آخر 50 تقييم</span>
          </div>

          {approved.length === 0 ? (
            <p className="text-gray-500 text-sm">لا توجد تقييمات معتمدة بعد.</p>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {approved.map((review) => (
                <div key={review.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex justify-between items-start gap-4 mb-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{review.userName}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('ar')}
                        </span>
                      </div>
                      <a
                        href={`/attractions/${review.attractionId}`}
                        target="_blank"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {review.attraction.nameAr}
                      </a>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminWrapper>
  );
}
