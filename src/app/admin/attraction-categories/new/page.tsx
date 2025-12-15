// File: src/app/admin/attraction-categories/new/page.tsx
import { AdminWrapper } from '@/components/AdminWrapper';
import { requireAuth, canEdit } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createAttractionCategory } from '@/actions/attraction-categories';
import { IconSelector } from '@/components/IconSelector';

export default async function NewAttractionCategoryPage() {
  const auth = await requireAuth();
  if (!auth.authorized || !canEdit(auth.user!.role)) redirect('/admin');

  // Define tourism icons for the selector
  const tourismIcons = [
    { emoji: '🍽️', name: 'مطاعم' },
    { emoji: '☕', name: 'مقاهي' },
    { emoji: '🌳', name: 'حدائق' },
    { emoji: '🛍️', name: 'أسواق' },
    { emoji: '🕌', name: 'معالم سياحية' },
    { emoji: '🏨', name: 'فنادق' },
    { emoji: '🏬', name: 'مراكز تسوق' },
    { emoji: '🎡', name: 'ملاهي' },
    { emoji: '🏛️', name: 'متاحف' },
    { emoji: '🎭', name: 'مسارح' },
    { emoji: '🎪', name: 'فعاليات' },
    { emoji: '🎨', name: 'فنون' },
    { emoji: '🏖️', name: 'شواطئ' },
    { emoji: '⛰️', name: 'جبال' },
    { emoji: '🏞️', name: 'طبيعة' },
    { emoji: '🌉', name: 'جسور' },
    { emoji: '🍔', name: 'وجبات سريعة' },
    { emoji: '🍕', name: 'بيتزا' },
    { emoji: '🍜', name: 'طعام آسيوي' },
    { emoji: '🍰', name: 'حلويات' },
  ];

  return (
    <AdminWrapper>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">إضافة تصنيف سياحي</h1>
          <p className="text-gray-500 mt-1">أضف نوع جديد من الأماكن الترفيهية</p>
        </div>

        <form action={createAttractionCategory} className="bg-white rounded-2xl shadow-sm border p-8 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-r-4 border-gray-900 pr-3">المعلومات الأساسية</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                الاسم بالعربية *
              </label>
              <input
                name="nameAr"
                type="text"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                placeholder="مطاعم"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                الاسم بالإنجليزية
              </label>
              <input
                name="nameEn"
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition"
                placeholder="Restaurants"
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                الأيقونة *
              </label>
              <input
                name="icon"
                type="text"
                required
                defaultValue="📍"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition text-2xl"
                placeholder="📍"
                readOnly
              />
              <IconSelector icons={tourismIcons} />
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                name="isActive"
                value="true"
                id="isActive"
                className="w-5 h-5 text-gray-900 rounded focus:ring-2 focus:ring-gray-900"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-900 cursor-pointer">
                تفعيل التصنيف وإظهاره للمستخدمين
              </label>
            </div>
          </div>

          {/* SEO Section */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-bold text-gray-900 border-r-4 border-purple-600 pr-3">إعدادات SEO</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                عنوان SEO
              </label>
              <input
                name="seoTitle"
                type="text"
                maxLength={60}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                placeholder="أفضل المطاعم في مشهد"
              />
              <p className="text-xs text-gray-500 mt-1">60 حرف كحد أقصى (محركات البحث)</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                وصف SEO
              </label>
              <textarea
                name="seoDescription"
                rows={3}
                maxLength={160}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition resize-none"
                placeholder="دليل شامل لأفضل المطاعم في مدينة مشهد المقدسة"
              />
              <p className="text-xs text-gray-500 mt-1">160 حرف كحد أقصى</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                الكلمات المفتاحية
              </label>
              <input
                name="seoKeywords"
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                placeholder="مطاعم, مشهد, إيران, طعام حلال"
              />
              <p className="text-xs text-gray-500 mt-1">افصل بينها بفاصلة</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t">
            <button
              type="submit"
              className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-md hover:shadow-lg"
            >
              حفظ التصنيف
            </button>
            <a
              href="/admin/attraction-categories"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
            >
              إلغاء
            </a>
          </div>
        </form>
      </div>
    </AdminWrapper>
  );
}
