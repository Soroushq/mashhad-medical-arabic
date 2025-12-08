// File: src/app/contact/page.tsx
export default function ContactPage() {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">تواصل معنا</h1>
        <p className="text-gray-600">نحن هنا لمساعدتك في أي وقت</p>
      </div>

      <div className="space-y-4">
        <a
          href="https://wa.me/989123456789"
          target="_blank"
          className="block bg-green-500 text-white p-6 rounded-2xl hover:bg-green-600 transition"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl">
              💬
            </div>
            <div>
              <h3 className="font-bold text-lg">واتساب</h3>
              <p className="text-green-50 text-sm">تواصل فوري عبر واتساب</p>
            </div>
          </div>
        </a>

        <a
          href="tel:+989123456789"
          className="block bg-mashhad-600 text-white p-6 rounded-2xl hover:bg-mashhad-700 transition"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl">
              📞
            </div>
            <div>
              <h3 className="font-bold text-lg">اتصال هاتفي</h3>
              <p className="text-mashhad-100 text-sm" dir="ltr">+98 912 345 6789</p>
            </div>
          </div>
        </a>

        <div className="bg-white p-6 rounded-2xl border-2 border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-mashhad-50 rounded-full flex items-center justify-center text-3xl">
              ⏰
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">ساعات العمل</h3>
              <p className="text-gray-600 text-sm">متاح 24/7 للرد على استفساراتكم</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-mashhad-50 rounded-full flex items-center justify-center text-3xl">
              📍
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">الموقع</h3>
              <p className="text-gray-600 text-sm">مشهد، إيران</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
