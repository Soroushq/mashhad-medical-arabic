// File: src/app/admin/users/page.tsx
import { prisma } from '@/lib/prisma';
import { requireAuth, canManageUsers } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { toggleUserStatus, deleteUser } from '@/actions/users';
import { Role } from '@prisma/client';
import { AdminWrapper } from '@/components/AdminWrapper';
import { DeleteButton } from '@/components/DeleteButton';

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const auth = await requireAuth([Role.SUPER_ADMIN]);
  if (!auth.authorized || !canManageUsers(auth.user!.role)) redirect('/admin');

  const params = await searchParams;
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const roleColors: Record<Role, string> = {
    SUPER_ADMIN: 'bg-purple-100 text-purple-800',
    ADMIN: 'bg-blue-100 text-blue-800',
    EDITOR: 'bg-green-100 text-green-800',
    VIEWER: 'bg-gray-100 text-gray-800'
  };

  return (
    <AdminWrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
            <p className="text-gray-600 mt-1">التحكم في صلاحيات الوصول للنظام</p>
          </div>
          <Link
            href="/admin/users/new"
            className="px-6 py-3 bg-mashhad-600 text-white rounded-xl hover:bg-mashhad-700 transition shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <span>➕</span>
            <span>إضافة مستخدم</span>
          </Link>
        </div>

        {params.success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
            ✅ تم تنفيذ العملية بنجاح
          </div>
        )}

        {params.error === 'self' && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            ❌ لا يمكنك حذف حسابك الخاص
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">الاسم</th>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">اسم المستخدم</th>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">الصلاحية</th>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">الحالة</th>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className={`hover:bg-gray-50 transition ${!user.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{user.username}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {user.isActive ? 'نشط' : 'معطل'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.id !== auth.user!.id && (
                          <>
                            <form action={toggleUserStatus}>
                              <input type="hidden" name="id" value={user.id} />
                              <button 
                                type="submit" 
                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                                title={user.isActive ? 'تعطيل' : 'تفعيل'}
                              >
                                {user.isActive ? '🚫' : '✅'}
                              </button>
                            </form>
                            <form action={deleteUser}>
                              <input type="hidden" name="id" value={user.id} />
                              <DeleteButton
                                action={() => {}}
                                message="هل أنت متأكد من حذف هذا المستخدم؟"
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                🗑️
                              </DeleteButton>
                            </form>
                          </>
                        )}
                        {user.id === auth.user!.id && (
                          <span className="text-xs text-gray-400 px-3 py-1 bg-gray-50 rounded-full">(أنت)</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}
