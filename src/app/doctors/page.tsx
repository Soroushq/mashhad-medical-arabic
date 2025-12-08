// File: src/app/doctors/page.tsx
import { prisma } from "@/lib/prisma";
import { DoctorCard } from "@/components/DoctorCard";
import { SearchBar } from "@/components/SearchBar";
import Link from "next/link";

export const revalidate = 3600;

interface Props {
  searchParams: Promise<{ cat?: string; search?: string }>;
}

export default async function DoctorsPage({ searchParams }: Props) {
  const params = await searchParams;
  const categoryId = params.cat ? parseInt(params.cat) : undefined;
  const searchTerm = params.search || '';

  const doctors = await prisma.doctor.findMany({
    where: {
      isActive: true,
      ...(categoryId && { categoryId }),
      ...(searchTerm && {
        OR: [
          { nameAr: { contains: searchTerm } },
          { titleAr: { contains: searchTerm } },
          { bioAr: { contains: searchTerm } },
        ]
      })
    },
    include: { category: true },
    orderBy: { rating: 'desc' }
  });

  const categories = await prisma.category.findMany({
    orderBy: { nameAr: 'asc' }
  });

  const selectedCategory = categoryId 
    ? categories.find(c => c.id === categoryId)
    : null;

  // Track search analytics
  if (searchTerm) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await prisma.analytics.upsert({
      where: { date: today },
      update: { searches: { increment: 1 } },
      create: { date: today, searches: 1 }
    });
  }

  return (
    <div className="p-4 md:max-w-7xl md:mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {selectedCategory ? selectedCategory.nameAr : 'جميع الأطباء'}
        </h1>
        <p className="text-gray-600 text-sm">
          {doctors.length} طبيب متاح
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar />

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Link
          href="/doctors"
          className={`px-4 py-2 rounded-full whitespace-nowrap transition font-medium ${
            !categoryId 
              ? 'bg-mashhad-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          الكل
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/doctors?cat=${cat.id}`}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition flex items-center gap-2 font-medium ${
              categoryId === cat.id
                ? 'bg-mashhad-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.nameAr}</span>
          </Link>
        ))}
      </div>

      {/* Doctors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            id={doctor.id}
            name={doctor.nameAr}
            specialty={doctor.category.nameAr}
            rating={doctor.rating}
            experience={doctor.experience}
            image={doctor.imageUrl || undefined}
          />
        ))}
      </div>

      {doctors.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="text-6xl mb-4">👨‍⚕️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد نتائج</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? `لم نجد أطباء بالبحث عن "${searchTerm}"` : 'لم نجد أطباء في هذا التخصص'}
          </p>
          <Link
            href="/doctors"
            className="inline-block px-6 py-3 bg-mashhad-600 text-white rounded-xl hover:bg-mashhad-700 transition"
          >
            عرض جميع الأطباء
          </Link>
        </div>
      )}
    </div>
  );
}
