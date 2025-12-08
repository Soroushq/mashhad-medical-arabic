// File: src/app/admin/doctors/[id]/edit/page.tsx
import { prisma } from '@/lib/prisma';
import { requireAuth, canEdit } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { updateDoctor } from '@/actions/doctors';
import { AdminWrapper } from '@/components/AdminWrapper';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditDoctorPage({ params }: Props) {
  const auth = await requireAuth();
  if (!auth.authorized || !canEdit(auth.user!.role)) redirect('/admin');

  const { id } = await params;
  const doctor = await prisma.doctor.findUnique({
    where: { id: parseInt(id) },
    include: { category: true }
  });

  if (!doctor) notFound();

  const categories = await prisma.category.findMany({
    orderBy: { nameAr: 'asc' }
  });

  return (
    <AdminWrapper>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">تعديل بيانات الطبيب</h1>
          <p className="text-gray-600 mt-1">{doctor.nameAr}</p>
        </div>

        <form action={updateDoctor.bind(null, doctor.id)} className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                الاسم بالعربية *
              </label>
              <input
                name="nameAr"
                type="text"
                required
                defaultValue={doctor.nameAr}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                التخصص *
              </label>
              <select
                name="categoryId"
                required
                defaultValue={doctor.categoryId}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.nameAr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                اللقب/المنصب *
              </label>
              <input
                name="titleAr"
                type="text"
                required
                defaultValue={doctor.titleAr}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                سنوات الخبرة *
              </label>
              <input
                name="experience"
                type="number"
                required
                min="1"
                defaultValue={doctor.experience}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                رقم هاتف المترجم *
              </label>
              <input
                name="phone"
                type="tel"
                required
                defaultValue={doctor.phone}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                رقم واتساب *
              </label>
              <input
                name="whatsapp"
                type="tel"
                required
                defaultValue={doctor.whatsapp}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                الموقع/العنوان *
              </label>
              <input
                name="locationAr"
                type="text"
                required
                defaultValue={doctor.locationAr}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                رابط الصورة
              </label>
              <input
                name="imageUrl"
                type="url"
                defaultValue={doctor.imageUrl || ''}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 يمكنك رفع الصورة على <a href="https://imgbb.com/" target="_blank" className="text-mashhad-600 hover:underline">ImgBB</a> ونسخ الرابط هنا
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                النبذة التعريفية *
              </label>
              <textarea
                name="bioAr"
                required
                rows={6}
                defaultValue={doctor.bioAr}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-mashhad-500 focus:border-mashhad-500 transition"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-mashhad-600 text-white rounded-xl font-bold hover:bg-mashhad-700 transition shadow-sm hover:shadow-md"
            >
              💾 حفظ التغييرات
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
