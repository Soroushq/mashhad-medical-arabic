// File: src/app/admin/layout.tsx
import type { ReactNode } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50" dir="rtl">
      {/* Top Navigation - Glassmorphism */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900">لوحة التحكم</h1>
                <p className="text-xs text-gray-500">دليل مشهد الطبي</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* زر العودة للموقع العام */}
              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
                  />
                </svg>
                <span>العودة للموقع</span>
              </Link>

              {user && (
                <div className="text-end hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 font-medium">{user.role}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content + Admin Nav pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 mb-6 text-xs sm:text-sm">
          <Link
            href="/admin"
            className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            لوحة التحكم
          </Link>
          <Link
            href="/admin/doctors"
            className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            الأطباء
          </Link>
          <Link
            href="/admin/categories"
            className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            تخصصات الأطباء
          </Link>
          {/* الأماكن السياحية الجديدة */}
          <Link
            href="/admin/attractions"
            className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            الأماكن السياحية
          </Link>
          <Link
            href="/admin/attraction-categories"
            className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            تصنيفات الأماكن
          </Link>
          <Link
            href="/admin/attraction-reviews"
            className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            تقييمات الأماكن
          </Link>
          {user?.role === 'SUPER_ADMIN' && (
            <Link
              href="/admin/users"
              className="px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
            >
              المستخدمون
            </Link>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
