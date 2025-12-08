// File: src/app/categories/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 3600;

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { doctors: true } } },
    orderBy: { nameAr: 'asc' }
  });

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">التخصصات الطبية</h1>
        <p className="text-gray-600">تصفح جميع التخصصات المتاحة</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/doctors?cat=${cat.id}`}
            className="bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-mashhad-500 hover:shadow-lg transition-all group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-mashhad-50 to-mashhad-100 rounded-2xl flex items-center justify-center text-4xl mb-4 mx-auto group-hover:scale-110 transition-transform">
                {cat.icon || '🏥'}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{cat.nameAr}</h3>
              <p className="text-sm text-gray-500">{cat._count.doctors} طبيب متاح</p>
            </div>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500">لا توجد تخصصات متاحة حالياً</p>
        </div>
      )}
    </div>
  );
}
