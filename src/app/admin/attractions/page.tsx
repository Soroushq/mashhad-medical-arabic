// File: src/app/admin/attractions/page.tsx
import { AdminWrapper } from '@/components/AdminWrapper';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, canEdit, canDelete } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { deleteAttraction, toggleAttractionStatus } from '@/actions/attractions';
import { DeleteButton } from '@/components/DeleteButton';

export default async function AttractionsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const params = await searchParams;
  const attractions = await prisma.attraction.findMany({
    include: { category: true, _count: { select: { reviews: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const canUserEdit = canEdit(user.role);
  const canUserDelete = canDelete(user.role);

  const successMessages: Record<string, string> = {
    created: '✅ تم إضافة المكان بنجاح',
    updated: '✅ تم تحديث المكان بنجاح',
    deleted: '✅ تم حذف المكان بنجاح',
  };

  return (
    <AdminWrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الأماكن السياحية</h1>
            <p className="text-gray-500 mt-1">عرض وتعديل الأماكن الترفيهية والسياحية</p>
          </div>
          {canUserEdit && (
            <Link
              href="/admin/attractions/new"
              className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>إضافة مكان</span>
            </Link>
          )}
        </div>

        {params.success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2">
            {successMessages[params.success]}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">المكان</th>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">التصنيف</th>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">التقييم</th>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">الإعجابات</th>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">الحالة</th>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attractions.map((attraction) => (
                  <tr key={attraction.id} className={`hover:bg-gray-50 transition ${!attraction.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700 font-bold">
                          {attraction.nameAr.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{attraction.nameAr}</div>
                          <div className="text-sm text-gray-500">{attraction.address.substring(0, 30)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm flex items-center gap-1 w-fit">
                        <span>{attraction.category.icon}</span>
                        <span>{attraction.category.nameAr}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-semibold text-gray-900">{attraction.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">({attraction._count.reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-600">{attraction.likesCount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${attraction.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {attraction.isActive ? 'نشط' : 'معطل'}
                        </span>
                        {attraction.isFeatured && (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-50 text-yellow-700">مميز</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/attractions/${attraction.id}`} target="_blank" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition" title="عرض">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        {canUserEdit && (
                          <Link href={`/admin/attractions/${attraction.id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="تعديل">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                        )}
                        {canUserDelete && (
                          <>
                            <form action={toggleAttractionStatus} className="inline">
                              <input type="hidden" name="id" value={attraction.id} />
                              <button type="submit" className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition" title={attraction.isActive ? 'تعطيل' : 'تفعيل'}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={attraction.isActive ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                                </svg>
                              </button>
                            </form>
                            <form action={deleteAttraction} className="inline">
                              <input type="hidden" name="id" value={attraction.id} />
                              <DeleteButton message="هل أنت متأكد من حذف هذا المكان؟" className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="حذف">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </DeleteButton>
                            </form>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {attractions.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-500 mb-4">لا توجد أماكن مسجلة حالياً</p>
              {canUserEdit && (
                <Link href="/admin/attractions/new" className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
                  إضافة أول مكان
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminWrapper>
  );
}
