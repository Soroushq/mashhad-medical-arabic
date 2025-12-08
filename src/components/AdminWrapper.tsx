// File: src/components/AdminWrapper.tsx
import { ReactNode } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { logout } from '@/actions/auth';
import Link from 'next/link';

export async function AdminWrapper({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Top Navigation with proper z-index */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-mashhad-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  م
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">لوحة التحكم</h1>
                </div>
              </Link>
              
              {/* Quick Nav */}
              <div className="hidden md:flex items-center gap-2">
                <Link href="/admin/doctors" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-mashhad-600 hover:bg-gray-50 rounded-lg transition">
                  👨‍⚕️ الأطباء
                </Link>
                <Link href="/admin/categories" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-mashhad-600 hover:bg-gray-50 rounded-lg transition">
                  📋 التخصصات
                </Link>
                <Link href="/admin/reviews" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-mashhad-600 hover:bg-gray-50 rounded-lg transition">
                  ⭐ التقييمات
                </Link>
                <Link href="/admin/analytics" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-mashhad-600 hover:bg-gray-50 rounded-lg transition">
                  📊 التحليلات
                </Link>
                {user.role === 'SUPER_ADMIN' && (
                  <Link href="/admin/users" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-mashhad-600 hover:bg-gray-50 rounded-lg transition">
                    👥 المستخدمين
                  </Link>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                className="hidden sm:block px-3 py-2 text-sm font-medium text-mashhad-600 hover:bg-mashhad-50 rounded-lg transition"
              >
                🌐 الموقع
              </a>
              <div className="text-end hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <form action={logout}>
                <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition">
                  خروج
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
