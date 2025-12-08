// File: src/app/admin/categories/new/page.tsx
import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createCategory } from '@/actions/categories';
import { Role } from '@prisma/client';
import { AdminWrapper } from '@/components/AdminWrapper';
import { IconSelector } from '@/components/IconSelector';
import Link from 'next/link';

export default async function NewCategoryPage() {
  const auth = await requireAuth([Role.SUPER_ADMIN, Role.ADMIN]);
  if (!auth.authorized) redirect('/admin');

  const commonIcons = [
    { emoji: '🦷', name: 'أسنان' },
    { emoji: '👁️', name: 'عيون' },
    { emoji: '❤️', name: 'قلب' },
    { emoji: '🧠', name: 'أعصاب' },
    { emoji: '🦴', name: 'عظام' },
    { emoji: '👂', name: 'أنف وأذن' },
    { emoji: '🩺', name: 'باطنة' },
    { emoji: '💉', name: 'جراحة' },
    { emoji: '👶', name: 'أطفال' },
    { emoji: '🤰', name: 'نساء وولادة' },
  ];

  return (
    <AdminWrapper>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">إضافة تخصص جديد</h1>
          <p className="text-gray-600 mt-1">أضف تخصص طبي جديد للموقع</p>
        </div>

        <form action={createCategory} className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              اسم التخصص *
            </label>
            <input
              name="nameAr"
              type="text"
              required
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
              placeholder="مثال: طب الأسنان"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              الأيقونة (Emoji) *
            </label>
            <input
              name="icon"
              type="text"
              required
              maxLength={2}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition text-3xl text-center"
              placeholder="🦷"
            />
            <p className="text-xs text-gray-500 mt-2 mb-3">اختر أيقونة من الأسفل أو اكتب emoji مباشرة</p>
            <IconSelector icons={commonIcons} />
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-mashhad-600 text-white rounded-xl font-bold hover:bg-mashhad-700 transition shadow-sm hover:shadow-md"
            >
              💾 حفظ التخصص
            </button>
            <Link
              href="/admin/categories"
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
