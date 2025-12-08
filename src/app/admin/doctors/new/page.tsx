// File: src/app/admin/doctors/new/page.tsx
import { prisma } from '@/lib/prisma';
import { requireAuth, canEdit } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createDoctor } from '@/actions/doctors';
import { AdminWrapper } from '@/components/AdminWrapper';
import Link from 'next/link';

export default async function NewDoctorPage() {
  const auth = await requireAuth();
  if (!auth.authorized || !canEdit(auth.user!.role)) redirect('/admin');

  const categories = await prisma.category.findMany({
    orderBy: { nameAr: 'asc' }
  });

  return (
    <AdminWrapper>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">إضافة طبيب جديد</h1>
          <p className="text-gray-600 mt-1">املأ جميع المعلومات المطلوبة</p>
        </div>

        <form action={createDoctor} className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                الاسم بالعربية *
              </label>
              <input
                name="nameAr"
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
                placeholder="د. أحمد محمد"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                التخصص *
              </label>
              <select
                name="categoryId"
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
              >
                <option value="">اختر التخصص</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                اللقب/المنصب *
              </label>
              <input
                name="titleAr"
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
                placeholder="أخصائي جراحة العيون"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                سنوات الخبرة *
              </label>
              <input
                name="experience"
                type="number"
                required
                min="1"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
                placeholder="10"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                رقم هاتف المترجم *
              </label>
              <input
                name="phone"
                type="tel"
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
                placeholder="+98 123 456 7890"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                رقم واتساب (مع رمز الدولة) *
              </label>
              <input
                name="whatsapp"
                type="tel"
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
                placeholder="989123456789"
              />
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                الموقع/العنوان *
              </label>
              <input
                name="locationAr"
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
                placeholder="شارع الإمام الرضا، مشهد"
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                رابط صورة الطبيب
              </label>
              <input
                name="imageUrl"
                type="url"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
                placeholder="https://example.com/doctor.jpg"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 يمكنك رفع الصورة على <a href="https://imgbb.com/" target="_blank" className="text-mashhad-600 hover:underline">ImgBB</a> أو <a href="https://postimages.org/" target="_blank" className="text-mashhad-600 hover:underline">PostImages</a> ونسخ الرابط هنا
              </p>
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                النبذة التعريفية *
              </label>
              <textarea
                name="bioAr"
                required
                rows={6}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
                placeholder="نبذة تفصيلية عن الطبيب وخبراته..."
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-mashhad-600 text-white rounded-xl font-bold hover:bg-mashhad-700 transition shadow-sm hover:shadow-md"
            >
              💾 حفظ الطبيب
            </button>
            <Link
              href="/admin/doctors"
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
