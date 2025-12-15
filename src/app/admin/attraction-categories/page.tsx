// File: src/app/admin/attraction-categories/page.tsx
import { prisma } from '@/lib/prisma';
import { requireAuth, canDelete, canEdit } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { deleteAttractionCategory, toggleCategoryStatus } from '@/actions/attraction-categories';
import { AdminWrapper } from '@/components/AdminWrapper';
import { DeleteButton } from '@/components/DeleteButton';

export default async function AttractionCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const auth = await requireAuth();
  if (!auth.authorized) redirect(auth.redirect!);

  const params = await searchParams;
  const categories = await prisma.attractionCategory.findMany({
    include: { _count: { select: { attractions: true } } },
    orderBy: { nameAr: 'asc' }
  });

  const canUserEdit = canEdit(auth.user!.role);
  const canUserDelete = canDelete(auth.user!.role);

  return (
    <AdminWrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تصنيفات الأماكن السياحية</h1>
            <p className="text-gray-500 mt-1">إدارة أنواع الأماكن الترفيهية والسياحية</p>
          </div>
          {canUserEdit && (
            <Link
              href="/admin/attraction-categories/new"
              className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition shadow-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>إضافة تصنيف</span>
            </Link>
          )}
        </div>

        {params.success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
            ✅ تم تنفيذ العملية بنجاح
          </div>
        )}

        {params.error === 'has_attractions' && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            ❌ لا يمكن حذف تصنيف يحتوي على أماكن مسجلة
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{category.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{category.nameAr}</h3>
                    <p className="text-sm text-gray-500">{category._count.attractions} مكان</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {canUserEdit && (
                    <form action={toggleCategoryStatus}>
                      <input type="hidden" name="id" value={category.id} />
                      <button
                        type="submit"
                        className={`p-2 rounded-lg transition ${
                          category.isActive
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title={category.isActive ? 'نشط' : 'معطل'}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </form>
                  )}
                  {canUserDelete && category._count.attractions === 0 && (
                    <form action={deleteAttractionCategory}>
                      <input type="hidden" name="id" value={category.id} />
                      <DeleteButton
                        message="هل أنت متأكد من حذف هذا التصنيف؟"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="حذف"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </DeleteButton>
                    </form>
                  )}
                </div>
              </div>
              
              {category.seoTitle && (
                <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
                  SEO: {category.seoTitle}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminWrapper>
  );
}
