// File: src/app/admin/page.tsx
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { logout } from '@/actions/auth';
import Link from 'next/link';

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/admin/login');
  }

  const [
    doctorsCount,
    categoriesCount,
    reviewsCount,
    pendingReviews,
    attractionsCount,
    attractionCategoriesCount,
    attractionReviewsPending,
  ] = await Promise.all([
    prisma.doctor.count(),
    prisma.category.count(),
    prisma.review.count(),
    prisma.review.count({ where: { isApproved: false } }),
    prisma.attraction.count().catch(() => 0),
    prisma.attractionCategory.count().catch(() => 0),
    prisma.attractionReview.count({ where: { isApproved: false } }).catch(() => 0),
  ]);

  return (
    <div className="pb-8" dir="rtl">
      {/* زر تسجيل الخروج يبقى هنا لأنه متعلق بالمستخدم فقط */}
      <div className="flex justify-end mb-4">
        <form action={logout}>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </button>
        </form>
      </div>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-1 bg-white/30 rounded-full" />
            <span className="text-sm text-gray-300 font-medium">مرحباً بعودتك</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
          <p className="text-gray-300">إليك نظرة سريعة على نشاط المنصة</p>
        </div>
      </div>

      {/* Stats Grid – أضف كروت للأماكن السياحية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Doctors */}
        <Link href="/admin/doctors" className="group">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-200/50 group-hover:border-gray-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-50" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{doctorsCount}</div>
              <div className="text-sm font-medium text-gray-500">إجمالي الأطباء</div>
            </div>
          </div>
        </Link>

        {/* Categories */}
        <Link href="/admin/categories" className="group">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-200/50 group-hover:border-gray-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-50" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{categoriesCount}</div>
              <div className="text-sm font-medium text-gray-500">التخصصات الطبية</div>
            </div>
          </div>
        </Link>

        {/* Doctors reviews (الطبية) */}
        <Link href="/admin/reviews" className="group">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-200/50 group-hover:border-gray-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-50" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{reviewsCount}</div>
              <div className="text-sm font-medium text-gray-500">تقييمات الأطباء</div>
            </div>
          </div>
        </Link>

        {/* Pending doctor reviews */}
        <Link href="/admin/reviews" className="group">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border-2 border-orange-200 group-hover:border-orange-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/50 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-orange-600 bg-white px-2 py-1 rounded-full">
                  يتطلب إجراء
                </span>
              </div>
              <div className="text-3xl font-bold text-orange-700 mb-1">{pendingReviews}</div>
              <div className="text-sm font-semibold text-orange-600">تقييمات الأطباء قيد الموافقة</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Grid للأماكن السياحية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/attractions" className="group">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-200/60 group-hover:border-gray-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-50 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-60" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-sky-100 to-sky-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-sky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.75 9l7.5-6 7.5 6M4.5 10.5V20.25h15V10.5"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">الأماكن السياحية</h4>
                <p className="text-sm text-gray-500 mb-1">إدارة أماكن السياحة والترفيه</p>
                <div className="text-2xl font-bold text-gray-900">{attractionsCount}</div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
        </Link>

        <Link href="/admin/attraction-categories" className="group">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-200/60 group-hover:border-gray-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-60" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">تصنيفات الأماكن</h4>
                <p className="text-sm text-gray-500 mb-1">أنواع المطاعم، الحدائق، الأسواق...</p>
                <div className="text-2xl font-bold text-gray-900">{attractionCategoriesCount}</div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
        </Link>

        <Link href="/admin/attraction-reviews" className="group">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/60 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-indigo-200 group-hover:border-indigo-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/60 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <svg className="w-7 h-7 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">تقييمات الأماكن</h4>
                <p className="text-sm text-gray-600 mb-1">إدارة تقييمات الزوار للأماكن السياحية</p>
                <div className="text-2xl font-bold text-indigo-800">{attractionReviewsPending}</div>
                <p className="text-xs font-semibold text-indigo-700">قيد الموافقة حالياً</p>
              </div>
              <svg className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions – نضيف أزرار للأماكن السياحية أيضاً */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-200/50">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-gray-900 rounded-full" />
          <h3 className="text-lg font-bold text-gray-900">إجراءات سريعة</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/doctors/new"
            className="group flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="text-sm font-semibold text-gray-700 text-center">إضافة طبيب</div>
          </Link>

          <Link
            href="/admin/categories/new"
            className="group flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="text-sm font-semibold text-gray-700 text-center">إضافة تخصص</div>
          </Link>

          <Link
            href="/admin/attractions/new"
            className="group flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10l9-7 9 7v10a1 1 0 01-1 1h-5m-6 0H4a1 1 0 01-1-1V10m9 11v-4a2 2 0 00-2-2H9"
                />
              </svg>
            </div>
            <div className="text-sm font-semibold text-gray-700 text-center">إضافة مكان سياحي</div>
          </Link>

          <Link
            href="/admin/attraction-categories/new"
            className="group flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <div className="text-sm font-semibold text-gray-700 text-center">
              إضافة تصنيف مكان
            </div>
          </Link>
        </div>
      </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/doctors"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border-r-4 border-gray-800"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">إدارة الأطباء</h4>
                <p className="text-sm text-gray-500">إضافة وتعديل معلومات الأطباء</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border-r-4 border-gray-700"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">التخصصات الطبية</h4>
                <p className="text-sm text-gray-500">إدارة أقسام التخصصات</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/admin/reviews"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border-r-4 border-gray-600"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">إدارة التقييمات</h4>
                <p className="text-sm text-gray-500">اعتماد ومراجعة التقييمات</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </Link>

          {user.role === 'SUPER_ADMIN' && (
            <Link
              href="/admin/users"
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border-r-4 border-gray-500"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">إدارة المستخدمين</h4>
                  <p className="text-sm text-gray-500">التحكم في صلاحيات الوصول</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </Link>
          )}
        </div>
      </div>
  );
}
       
