// File: src/app/admin/analytics/page.tsx
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminWrapper } from '@/components/AdminWrapper';
import { Role } from '@prisma/client';

export default async function AnalyticsPage() {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN]);
  if (!auth.authorized) redirect('/admin');

  // Get last 30 days analytics
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const analytics = await prisma.analytics.findMany({
    where: {
      date: { gte: thirtyDaysAgo }
    },
    orderBy: { date: 'desc' }
  });

  const totals = analytics.reduce((acc, day) => ({
    pageViews: acc.pageViews + day.pageViews,
    uniqueVisitors: acc.uniqueVisitors + day.uniqueVisitors,
    doctorViews: acc.doctorViews + day.doctorViews,
    searches: acc.searches + day.searches,
    reviews: acc.reviews + day.reviews,
  }), {
    pageViews: 0,
    uniqueVisitors: 0,
    doctorViews: 0,
    searches: 0,
    reviews: 0,
  });

  // Get today's stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStats = await prisma.analytics.findUnique({
    where: { date: today }
  });

  // Top doctors by views
  const topDoctors = await prisma.doctor.findMany({
    take: 10,
    orderBy: { viewsCount: 'desc' },
    include: { category: true }
  });

  // Top doctors by likes
  const mostLiked = await prisma.doctor.findMany({
    take: 10,
    orderBy: { likesCount: 'desc' },
    include: { category: true }
  });

  // Recent reviews
  const recentReviews = await prisma.review.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { doctor: true }
  });

  return (
    <AdminWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة التحليلات</h1>
          <p className="text-gray-600 mt-1">إحصائيات الموقع والأداء</p>
        </div>

        {/* Today Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-3xl mb-2">👁️</div>
            <div className="text-3xl font-bold">{todayStats?.pageViews || 0}</div>
            <div className="text-sm text-blue-100">زيارات اليوم</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-3xl mb-2">👤</div>
            <div className="text-3xl font-bold">{todayStats?.uniqueVisitors || 0}</div>
            <div className="text-sm text-green-100">زوار فريدون</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-3xl mb-2">👨‍⚕️</div>
            <div className="text-3xl font-bold">{todayStats?.doctorViews || 0}</div>
            <div className="text-sm text-purple-100">عرض أطباء</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-3xl font-bold">{todayStats?.searches || 0}</div>
            <div className="text-sm text-orange-100">عمليات بحث</div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-3xl font-bold">{todayStats?.reviews || 0}</div>
            <div className="text-sm text-pink-100">تقييمات جديدة</div>
          </div>
        </div>

        {/* 30 Days Summary */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">آخر 30 يوم</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totals.pageViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600">إجمالي الزيارات</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{totals.uniqueVisitors.toLocaleString()}</div>
              <div className="text-sm text-gray-600">زوار فريدون</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{totals.doctorViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600">عرض أطباء</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{totals.searches.toLocaleString()}</div>
              <div className="text-sm text-gray-600">عمليات بحث</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">{totals.reviews.toLocaleString()}</div>
              <div className="text-sm text-gray-600">تقييمات</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Doctors by Views */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🏆</span>
              <span>الأكثر مشاهدة</span>
            </h2>
            <div className="space-y-3">
              {topDoctors.map((doctor, index) => (
                <div key={doctor.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{doctor.nameAr}</div>
                    <div className="text-sm text-gray-600">{doctor.category.nameAr}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{doctor.viewsCount}</div>
                    <div className="text-xs text-gray-500">مشاهدة</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Liked Doctors */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>❤️</span>
              <span>الأكثر إعجاباً</span>
            </h2>
            <div className="space-y-3">
              {mostLiked.map((doctor, index) => (
                <div key={doctor.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{doctor.nameAr}</div>
                    <div className="text-sm text-gray-600">{doctor.category.nameAr}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">{doctor.likesCount}</div>
                    <div className="text-xs text-gray-500">إعجاب</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>⭐</span>
            <span>أحدث التقييمات</span>
          </h2>
          <div className="space-y-3">
            {recentReviews.map((review) => (
              <div key={review.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{review.userName}</span>
                    <span className="text-gold-500">{'⭐'.repeat(review.rating)}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${review.isApproved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {review.isApproved ? 'معتمد' : 'قيد المراجعة'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">للطبيب: {review.doctor.nameAr}</div>
                  {review.comment && (
                    <p className="text-sm text-gray-700">{review.comment.substring(0, 100)}...</p>
                  )}
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(review.createdAt).toLocaleDateString('ar-SA')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}
