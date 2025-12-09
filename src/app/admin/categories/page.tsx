// File: src/app/admin/categories/page.tsx
import { prisma } from '@/lib/prisma';
import { requireAuth, canDelete } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { deleteCategory } from '@/actions/categories'; // Import the action
import { AdminWrapper } from '@/components/AdminWrapper';
import { DeleteButton } from '@/components/DeleteButton';

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const auth = await requireAuth();
  if (!auth.authorized) redirect(auth.redirect!);

  const params = await searchParams;
  const categories = await prisma.category.findMany({
    include: { _count: { select: { doctors: true } } },
    orderBy: { nameAr: 'asc' }
  });

  const canUserDelete = canDelete(auth.user!.role);

  return (
    <AdminWrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة التخصصات</h1>
          </div>
          <Link
            href="/admin/categories/new"
            className="px-6 py-3 bg-mashhad-600 text-white rounded-xl hover:bg-mashhad-700 transition shadow-sm flex items-center gap-2"
          >
            <span>➕</span>
            <span>إضافة تخصص</span>
          </Link>
        </div>

        {params.success && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
            ✅ تم تنفيذ العملية بنجاح
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{category.icon || '📋'}</div>
                                {canUserDelete && category._count.doctors === 0 && (
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={category.id} />
                      <DeleteButton
                        message="هل أنت متأكد من حذف هذا التخصص؟"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="حذف"
                      >
                        🗑️
                      </DeleteButton>
                    </form>
                  )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{category.nameAr}</h3>
              <p className="text-sm text-gray-600">
                {category._count.doctors} طبيب متاح
              </p>
            </div>
          ))}
        </div>
      </div>
    </AdminWrapper>
  );
}
