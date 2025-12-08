// File: src/app/admin/users/new/page.tsx
import { requireAuth, canManageUsers } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createUser } from '@/actions/users';
import { Role } from '@prisma/client';
import { AdminWrapper } from '@/components/AdminWrapper';
import Link from 'next/link';

export default async function NewUserPage() {
  const auth = await requireAuth([Role.SUPER_ADMIN]);
  if (!auth.authorized || !canManageUsers(auth.user!.role)) redirect('/admin');

  return (
    <AdminWrapper>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">إضافة مستخدم جديد</h1>
          <p className="text-gray-600 mt-1">منح صلاحيات الوصول لمستخدم جديد</p>
        </div>

        <form action={createUser} className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              الاسم الكامل *
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
              placeholder="أحمد محمد"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              اسم المستخدم *
            </label>
            <input
              name="username"
              type="text"
              required
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
              placeholder="ahmad123"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              كلمة المرور *
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              الصلاحية *
            </label>
            <select
              name="role"
              required
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
            >
              <option value="VIEWER">VIEWER - عرض فقط</option>
              <option value="EDITOR">EDITOR - تحرير</option>
              <option value="ADMIN">ADMIN - إداري</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN - مدير رئيسي</option>
            </select>
            <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-gray-700 space-y-2">
              <p><strong className="text-gray-900">VIEWER:</strong> عرض البيانات فقط بدون صلاحيات تعديل</p>
              <p><strong className="text-gray-900">EDITOR:</strong> إضافة وتعديل الأطباء والمحتوى</p>
              <p><strong className="text-gray-900">ADMIN:</strong> جميع الصلاحيات ماعدا إدارة المستخدمين</p>
              <p><strong className="text-gray-900">SUPER_ADMIN:</strong> جميع الصلاحيات بما فيها إدارة المستخدمين</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-mashhad-600 text-white rounded-xl font-bold hover:bg-mashhad-700 transition shadow-sm hover:shadow-md"
            >
              💾 إنشاء المستخدم
            </button>
            <Link
              href="/admin/users"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
            >
              إلغاء
            </Link>
          </div>
        </form>
      </div>
    </AdminWrapper>
  );
}
