// File: src/app/page.tsx
import { prisma } from "@/lib/prisma";
import { DoctorCard } from "@/components/DoctorCard";
import Link from "next/link";

export const revalidate = 3600;

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { doctors: true } } }
  });
  const featuredDoctors = await prisma.doctor.findMany({
    take: 5,
    where: { isActive: true },
    orderBy: { rating: 'desc' },
    include: { category: true }
  });

  const stats = {
    doctors: await prisma.doctor.count({ where: { isActive: true } }),
    categories: categories.length,
    reviews: await prisma.review.count({ where: { isApproved: true } })
  };

  return (
    <div className="space-y-6 md:max-w-7xl md:mx-auto md:py-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden md:rounded-2xl md:mx-4 md:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-mashhad-600 via-mashhad-700 to-mashhad-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative px-6 py-12 md:py-16 text-white text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="font-medium">خدمة متاحة 24/7</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            علاجك في مشهد<br/>بأمان وثقة
          </h2>
          <p className="text-mashhad-50 text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            نربطك بأفضل الأطباء المتخصصين مع مترجم خاص يرافقك في كل خطوة من رحلتك العلاجية
          </p>
          
          <Link 
            href="/doctors" 
            className="inline-flex items-center gap-3 text-black bg-white text-mashhad-700 px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg"
          >
            <span>ابحث عن طبيب الآن</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/20 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{stats.doctors}+</div>
              <div className="text-sm md:text-base text-mashhad-100">طبيب متخصص</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{stats.categories}</div>
              <div className="text-sm md:text-base text-mashhad-100">تخصص طبي</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{stats.reviews}+</div>
              <div className="text-sm md:text-base text-mashhad-100">تقييم موثق</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900">التخصصات الطبية</h3>
          <Link href="/categories" className="text-sm font-medium text-mashhad-600 hover:text-mashhad-700 flex items-center gap-1">
            <span>الكل</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link 
              key={cat.id} 
              href={`/doctors?cat=${cat.id}`} 
              className="group bg-white p-4 md:p-6 rounded-2xl border-2 border-gray-100 hover:border-mashhad-300 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-mashhad-50 to-mashhad-100 rounded-2xl flex items-center justify-center text-3xl md:text-4xl mb-3 mx-auto group-hover:scale-110 transition-transform">
                {cat.icon || '🏥'}
              </div>
              <span className="text-xs md:text-sm font-bold text-center block text-gray-900 leading-tight">{cat.nameAr}</span>
              <span className="text-[10px] md:text-xs text-gray-500 text-center block mt-1">{cat._count.doctors} طبيب</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="px-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">أطباء متميزون</h3>
            <p className="text-sm text-gray-600">الأعلى تقييماً من المرضى</p>
          </div>
          <Link href="/doctors" className="text-sm font-medium text-mashhad-600 hover:text-mashhad-700 flex items-center gap-1">
            <span>عرض الكل</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {featuredDoctors.map((doc) => (
            <DoctorCard 
              key={doc.id}
              id={doc.id}
              name={doc.nameAr}
              specialty={doc.category.nameAr}
              rating={doc.rating}
              experience={doc.experience}
              image={doc.imageUrl || undefined}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 pb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 md:p-10 text-white text-center shadow-xl">
          <div className="text-5xl md:text-6xl mb-4">💬</div>
          <h3 className="text-2xl md:text-3xl font-bold mb-3">تحتاج مساعدة؟</h3>
          <p className="text-base md:text-lg text-green-50 mb-6 max-w-md mx-auto">
            فريقنا متاح للرد على استفساراتك وحجز موعدك
          </p>
          <a 
            href="https://wa.me/989123456789" 
            target="_blank"
            className="inline-flex items-center gap-3 bg-white text-green-600 px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg"
          >
            <span>تواصل عبر واتساب</span>
            <span className="text-2xl">💬</span>
          </a>
        </div>
      </section>
    </div>
  );
}
