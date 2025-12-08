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

  const [doctorsCount, categoriesCount, reviewsCount, pendingReviews] = await Promise.all([
    prisma.doctor.count(),
    prisma.category.count(),
    prisma.review.count(),
    prisma.review.count({ where: { isApproved: false } })
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-mashhad-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                م
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">لوحة التحكم</h1>
                <p className="text-xs text-gray-500">دليل مشهد الطبي</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-end">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <form action={logout}>
                <button className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">
                  تسجيل الخروج
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-mashhad-600 to-mashhad-900 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <h2 className="text-3xl font-bold mb-2">مرحباً، {user.name} 👋</h2>
          <p className="text-mashhad-100">إليك نظرة سريعة على نشاط الموقع اليوم</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/doctors" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition">
                👨‍⚕️
              </div>
              <span className="text-xs text-gray-500">عرض الكل ←</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{doctorsCount}</div>
            <div className="text-sm text-gray-500">إجمالي الأطباء</div>
          </Link>

          <Link href="/admin/categories" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition">
                📋
              </div>
              <span className="text-xs text-gray-500">عرض الكل ←</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{categoriesCount}</div>
            <div className="text-sm text-gray-500">التخصصات الطبية</div>
          </Link>

          <Link href="/admin/reviews" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition">
                ⭐
              </div>
              <span className="text-xs text-gray-500">عرض الكل ←</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{reviewsCount}</div>
            <div className="text-sm text-gray-500">إجمالي التقييمات</div>
          </Link>

          <Link href="/admin/reviews" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition group border-2 border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition">
                ⏳
              </div>
              <span className="text-xs text-orange-600 font-medium">يتطلب إجراء</span>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">{pendingReviews}</div>
            <div className="text-sm text-gray-500">تقييمات قيد الموافقة</div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">إجراءات سريعة</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/doctors/new"
              className="flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-mashhad-500 hover:bg-mashhad-50 transition group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition">➕</div>
              <div className="text-sm font-medium text-gray-700 text-center">إضافة طبيب جديد</div>
            </Link>

            <Link
              href="/admin/categories/new"
              className="flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-mashhad-500 hover:bg-mashhad-50 transition group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition">📁</div>
              <div className="text-sm font-medium text-gray-700 text-center">إضافة تخصص</div>
            </Link>

            <Link
              href="/admin/reviews"
              className="flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-mashhad-500 hover:bg-mashhad-50 transition group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition">✅</div>
              <div className="text-sm font-medium text-gray-700 text-center">مراجعة التقييمات</div>
            </Link>

            <a
              href="/"
              target="_blank"
              className="flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-mashhad-500 hover:bg-mashhad-50 transition group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition">🌐</div>
              <div className="text-sm font-medium text-gray-700 text-center">عرض الموقع</div>
            </a>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/doctors"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition border-s-4 border-blue-500"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">👨‍⚕️</div>
              <div>
                <h4 className="font-bold text-gray-900">إدارة الأطباء</h4>
                <p className="text-sm text-gray-500">إضافة وتعديل معلومات الأطباء</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition border-s-4 border-purple-500"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📋</div>
              <div>
                <h4 className="font-bold text-gray-900">التخصصات الطبية</h4>
                <p className="text-sm text-gray-500">إدارة أقسام التخصصات</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/reviews"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition border-s-4 border-green-500"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">⭐</div>
              <div>
                <h4 className="font-bold text-gray-900">إدارة التقييمات</h4>
                <p className="text-sm text-gray-500">اعتماد ومراجعة التقييمات</p>
              </div>
            </div>
          </Link>

          {user.role === 'SUPER_ADMIN' && (
            <Link
              href="/admin/users"
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition border-s-4 border-orange-500"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">👥</div>
                <div>
                  <h4 className="font-bold text-gray-900">إدارة المستخدمين</h4>
                  <p className="text-sm text-gray-500">التحكم في صلاحيات الوصول</p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
