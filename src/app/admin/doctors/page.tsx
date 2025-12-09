// File: src/app/admin/doctors/page.tsx
import { AdminWrapper } from '@/components/AdminWrapper';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, canEdit, canDelete } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { deleteDoctor, toggleDoctorStatus } from '@/actions/doctors';
import { DeleteButton } from '@/components/DeleteButton';

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');

  const params = await searchParams;
  const doctors = await prisma.doctor.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  const canUserEdit = canEdit(user.role);
  const canUserDelete = canDelete(user.role);

  const successMessages: Record<string, string> = {
    created: '✅ تم إضافة الطبيب بنجاح',
    updated: '✅ تم تحديث الطبيب بنجاح',
    deleted: '✅ تم حذف الطبيب بنجاح',
  };

  return (
    <AdminWrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الأطباء</h1>
            <p className="text-gray-500 mt-1">عرض وتعديل معلومات الأطباء المسجلين</p>
          </div>
          {canUserEdit && (
            <Link
              href="/admin/doctors/new"
              className="px-6 py-3 bg-mashhad-600 text-white rounded-xl hover:bg-mashhad-700 transition shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <span>➕</span>
              <span>إضافة طبيب</span>
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
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    الطبيب
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    التخصص
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    الهاتف
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    التقييم
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {doctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className={`hover:bg-gray-50 transition ${
                      !doctor.isActive ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-mashhad-100 rounded-full flex items-center justify-center text-mashhad-600 font-bold">
                          {doctor.nameAr.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {doctor.nameAr}
                          </div>
                          <div className="text-sm text-gray-500">
                            {doctor.titleAr}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                        {doctor.category.nameAr}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600" dir="ltr">
                      {doctor.phone}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-gold-500">⭐</span>
                        <span className="font-semibold text-gray-900">
                          {doctor.rating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          doctor.isActive
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {doctor.isActive ? 'نشط' : 'معطل'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/doctors/${doctor.id}`}
                          target="_blank"
                          className="p-2 text-mashhad-600 hover:bg-mashhad-50 rounded-lg transition"
                          title="عرض"
                        >
                          👁️
                        </Link>
                        {canUserEdit && (
                          <Link
                            href={`/admin/doctors/${doctor.id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="تعديل"
                          >
                            ✏️
                          </Link>
                        )}
                        {canUserDelete && (
                          <>
                            <form action={toggleDoctorStatus} className="inline">
                              <input type="hidden" name="id" value={doctor.id} />
                              <button
                                type="submit"
                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                                title={doctor.isActive ? 'تعطيل' : 'تفعيل'}
                              >
                                {doctor.isActive ? '🚫' : '✅'}
                              </button>
                            </form>
                            <form action={deleteDoctor} className="inline">
                              <input type="hidden" name="id" value={doctor.id} />
                              {/* FIXED: DeleteButton handles confirm in client, no onClick in server component */}
                              <DeleteButton
                                message="هل أنت متأكد من حذف هذا الطبيب؟"
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="حذف"
                              >
                                🗑️
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

          {doctors.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👨‍⚕️</div>
              <p className="text-gray-500 mb-4">
                لا توجد أطباء مسجلين حالياً
              </p>
              {canUserEdit && (
                <Link
                  href="/admin/doctors/new"
                  className="inline-block px-6 py-2 bg-mashhad-600 text-white rounded-lg hover:bg-mashhad-700 transition"
                >
                  إضافة أول طبيب
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminWrapper>
  );
}
