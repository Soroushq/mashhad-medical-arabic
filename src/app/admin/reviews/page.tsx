// File: src/app/admin/reviews/page.tsx
import { prisma } from '@/lib/prisma';
import { requireAuth, canDelete } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { approveReview, deleteReview } from '@/actions/reviews';
import { AdminWrapper } from '@/components/AdminWrapper';
import { DeleteButton } from '@/components/DeleteButton';

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const auth = await requireAuth();
  if (!auth.authorized) redirect(auth.redirect!);

  const params = await searchParams;
  const showPending = params.status !== 'approved';

  const reviews = await prisma.review.findMany({
    where: { isApproved: showPending ? false : true },
    include: { doctor: true },
    orderBy: { createdAt: 'desc' }
  });

  const canUserDelete = canDelete(auth.user!.role);
  const pendingCount = await prisma.review.count({ where: { isApproved: false } });

  return (
    <AdminWrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة التقييمات</h1>
            <p className="text-gray-600 mt-1">مراجعة واعتماد تقييمات المرضى</p>
          </div>
          <div className="flex gap-2">
            <a
              href="/admin/reviews"
              className={`px-4 py-2 rounded-xl transition font-medium ${!params.status ? 'bg-mashhad-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              قيد الموافقة {pendingCount > 0 && `(${pendingCount})`}
            </a>
            <a
              href="/admin/reviews?status=approved"
              className={`px-4 py-2 rounded-xl transition font-medium ${params.status === 'approved' ? 'bg-mashhad-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              المعتمدة
            </a>
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{review.userName}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    للطبيب: <span className="font-semibold text-gray-900">{review.doctor.nameAr}</span>
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xl ${i < review.rating ? 'text-gold-500' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!review.isApproved && (
                    <form action={approveReview}>
                      <input type="hidden" name="id" value={review.id} />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-sm font-medium"
                      >
                        ✅ اعتماد
                      </button>
                    </form>
                  )}
                  {canUserDelete && (
                    <form action={deleteReview}>
                      <input type="hidden" name="id" value={review.id} />
                      <DeleteButton
                        action={() => {}}
                        message="هل أنت متأكد من حذف هذا التقييم؟"
                        className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition text-sm font-medium"
                      >
                        🗑️ حذف
                      </DeleteButton>
                    </form>
                  )}
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{review.comment}</p>
              )}
              <p className="text-xs text-gray-400 mt-3">
                {new Date(review.createdAt).toLocaleDateString('ar-SA', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border p-16 text-center">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {showPending ? 'لا توجد تقييمات قيد الموافقة' : 'لا توجد تقييمات معتمدة'}
              </h3>
              <p className="text-gray-500">
                {showPending ? 'جميع التقييمات تم اعتمادها' : 'لم يتم اعتماد أي تقييمات بعد'}
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminWrapper>
  );
}
