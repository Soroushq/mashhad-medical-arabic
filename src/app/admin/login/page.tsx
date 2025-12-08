// File: src/app/admin/login/page.tsx
import { login, createInitialAdmin } from '@/actions/auth';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect('/admin');

  const params = await searchParams;
  const errorMessages: Record<string, string> = {
    missing: 'اسم المستخدم وكلمة المرور مطلوبة',
    invalid: 'اسم المستخدم أو كلمة المرور غير صحيحة',
    exists: 'المسؤول موجود بالفعل',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mashhad-600 to-mashhad-900 p-4" suppressHydrationWarning>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-mashhad-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏥</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
          <p className="text-gray-500">دليل مشهد الطبي</p>
        </div>

        {params.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {errorMessages[params.error] || 'حدث خطأ'}
          </div>
        )}

        {params.success === 'created' && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            تم إنشاء الحساب بنجاح! استخدم admin/admin123
          </div>
        )}

        <form action={login} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم المستخدم
            </label>
            <input
              name="username"
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mashhad-500 focus:border-transparent"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mashhad-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-mashhad-600 text-white py-3 rounded-lg font-bold hover:bg-mashhad-700 transition"
          >
            تسجيل الدخول
          </button>
        </form>

        <form action={createInitialAdmin} className="mt-4">
          <button
            type="submit"
            className="w-full text-sm text-gray-500 hover:text-mashhad-600"
          >
            إنشاء حساب المسؤول الأول (admin/admin123)
          </button>
        </form>
      </div>
    </div>
  );
}
