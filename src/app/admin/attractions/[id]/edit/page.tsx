// File: src/app/admin/attractions/[id]/edit/page.tsx
import { AdminWrapper } from '@/components/AdminWrapper';
import { requireAuth, canEdit } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { updateAttraction } from '@/actions/attractions';
import { prisma } from '@/lib/prisma';

export default async function EditAttractionPage({ params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (!auth.authorized || !canEdit(auth.user!.role)) redirect('/admin');

  const { id } = await params;
  const attraction = await prisma.attraction.findUnique({
    where: { id: parseInt(id) },
    include: { category: true },
  });

  if (!attraction) notFound();

  const categories = await prisma.attractionCategory.findMany({
    where: { isActive: true },
    orderBy: { nameAr: 'asc' },
  });

  const images = JSON.parse(attraction.images || '[]');

  return (
    <AdminWrapper>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">تعديل: {attraction.nameAr}</h1>
          <p className="text-gray-500 mt-1">تحديث معلومات المكان</p>
        </div>

        <form action={updateAttraction.bind(null, attraction.id)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-r-4 border-gray-900 pr-3">
              المعلومات الأساسية
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  الاسم بالعربية *
                </label>
                <input
                  name="nameAr"
                  type="text"
                  required
                  defaultValue={attraction.nameAr}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  الاسم بالإنجليزية
                </label>
                <input
                  name="nameEn"
                  type="text"
                  defaultValue={attraction.nameEn || ''}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                التصنيف *
              </label>
              <select
                name="categoryId"
                required
                defaultValue={attraction.categoryId}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
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
                الوصف بالعربية *
              </label>
              <textarea
                name="descriptionAr"
                rows={5}
                required
                defaultValue={attraction.descriptionAr}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                الوصف بالإنجليزية
              </label>
              <textarea
                name="descriptionEn"
                rows={4}
                defaultValue={attraction.descriptionEn || ''}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition resize-none"
              />
            </div>
          </div>

          {/* Location & Contact */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-r-4 border-blue-600 pr-3">
              الموقع ومعلومات الاتصال
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                العنوان *
              </label>
              <input
                name="address"
                type="text"
                required
                defaultValue={attraction.address}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  رقم الهاتف
                </label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={attraction.phone || ''}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  واتساب
                </label>
                <input
                  name="whatsapp"
                  type="tel"
                  defaultValue={attraction.whatsapp || ''}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                الموقع الإلكتروني
              </label>
              <input
                name="website"
                type="url"
                defaultValue={attraction.website || ''}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                رابط الخريطة
              </label>
              <input
                name="mapLink"
                type="url"
                defaultValue={attraction.mapLink || ''}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                صورة الخريطة
              </label>
              <input
                name="mapImageUrl"
                type="url"
                defaultValue={attraction.mapImageUrl || ''}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                dir="ltr"
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-r-4 border-green-600 pr-3">
              الصور
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                روابط الصور (JSON Array)
              </label>
              <textarea
                name="images"
                rows={4}
                defaultValue={JSON.stringify(images, null, 2)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition resize-none font-mono text-sm"
                dir="ltr"
              />
            </div>
          </div>

          {/* Pricing & Hours */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-r-4 border-orange-600 pr-3">
              السعر وساعات العمل
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  النطاق السعري
                </label>
                <select
                  name="priceRange"
                  defaultValue={attraction.priceRange || ''}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                >
                  <option value="">غير محدد</option>
                  <option value="FREE">مجاني</option>
                  <option value="BUDGET">اقتصادي</option>
                  <option value="MODERATE">متوسط</option>
                  <option value="EXPENSIVE">مرتفع</option>
                  <option value="VERY_EXPENSIVE">مرتفع جداً</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  ساعات العمل
                </label>
                <input
                  name="openingHours"
                  type="text"
                  defaultValue={attraction.openingHours || ''}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl">
              <input
                type="checkbox"
                name="isFeatured"
                value="true"
                id="isFeatured"
                defaultChecked={attraction.isFeatured}
                className="w-5 h-5 text-yellow-600 rounded focus:ring-2 focus:ring-yellow-500"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-yellow-900 cursor-pointer">
                تمييز هذا المكان
              </label>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-r-4 border-purple-600 pr-3">
              إعدادات SEO
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                عنوان SEO
              </label>
              <input
                name="seoTitle"
                type="text"
                maxLength={60}
                defaultValue={attraction.seoTitle || ''}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                وصف SEO
              </label>
              <textarea
                name="seoDescription"
                rows={3}
                maxLength={160}
                defaultValue={attraction.seoDescription || ''}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                الكلمات المفتاحية
              </label>
              <input
                name="seoKeywords"
                type="text"
                defaultValue={attraction.seoKeywords || ''}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 sticky bottom-4 bg-white rounded-2xl shadow-lg border p-4">
            <button
              type="submit"
              className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-md hover:shadow-lg"
            >
              حفظ التعديلات
            </button>
            <a
              href="/admin/attractions"
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
            >
              إلغاء
            </a>
          </div>
        </form>
      </div>
    </AdminWrapper>
  );
}
