// File: src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="p-4 space-y-6">
      <div className="bg-gradient-to-br from-mashhad-600 to-mashhad-900 rounded-2xl p-8 text-white text-center">
        <div className="text-5xl mb-4">🏥</div>
        <h1 className="text-3xl font-bold mb-3">دليل مشهد الطبي</h1>
        <p className="text-mashhad-100">جسر التواصل بينك وبين أفضل الأطباء</p>
      </div>

      <div className="bg-white rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">من نحن؟</h2>
        <p className="text-gray-600 leading-relaxed">
          دليل مشهد الطبي هو منصة متخصصة تربط المرضى العرب بأفضل الأطباء والمراكز الطبية في مدينة مشهد المقدسة. نوفر لك خدمة ترجمة احترافية ومترجمين مرافقين لضمان تواصل فعال مع الكادر الطبي.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">خدماتنا</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-bold text-gray-900">مترجم مرافق</h3>
              <p className="text-sm text-gray-600">مترجم طبي محترف يرافقك في كل زيارة</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-bold text-gray-900">حجز المواعيد</h3>
              <p className="text-sm text-gray-600">نساعدك في حجز المواعيد مع الأطباء</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-bold text-gray-900">استشارات طبية</h3>
              <p className="text-sm text-gray-600">استشارات أولية لتحديد التخصص المناسب</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">لماذا مشهد؟</h2>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center gap-2">
            <span>🏆</span>
            <span>أطباء ذوي كفاءة عالية ومعتمدين</span>
          </li>
          <li className="flex items-center gap-2">
            <span>💰</span>
            <span>أسعار مناسبة مقارنة بالدول العربية</span>
          </li>
          <li className="flex items-center gap-2">
            <span>🏥</span>
            <span>مستشفيات مجهزة بأحدث التقنيات</span>
          </li>
          <li className="flex items-center gap-2">
            <span>🕌</span>
            <span>بيئة آمنة ومريحة للزوار العرب</span>
          </li>
        </ul>
      </div>

      <div className="bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl p-6 text-white text-center">
        <h3 className="text-xl font-bold mb-3">هل لديك استفسار؟</h3>
        <p className="text-gold-50 text-sm mb-4">تواصل معنا الآن وسنكون سعداء بمساعدتك</p>
        <a
          href="https://wa.me/989123456789"
          target="_blank"
          className="inline-block bg-white text-gold-600 px-6 py-3 rounded-full font-bold hover:bg-gold-50 transition"
        >
          تواصل عبر واتساب
        </a>
      </div>
    </div>
  );
}
