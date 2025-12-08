// File: src/app/admin/unauthorized/page.tsx
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">غير مصرح</h1>
        <p className="text-gray-600 mb-6">ليس لديك الصلاحيات للوصول إلى هذه الصفحة</p>
        <Link
          href="/admin"
          className="px-6 py-2 bg-mashhad-600 text-white rounded-lg hover:bg-mashhad-700 transition inline-block"
        >
          العودة للوحة التحكم
        </Link>
      </div>
    </div>
  );
}
