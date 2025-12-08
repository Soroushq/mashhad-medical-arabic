// File: src/components/PublicNav.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function PublicNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'الرئيسية', href: '/', icon: '🏠' },
    { name: 'الأطباء', href: '/doctors', icon: '👨‍⚕️' },
    { name: 'التخصصات', href: '/categories', icon: '📋' },
    { name: 'عن المشروع', href: '/about', icon: 'ℹ️' },
    { name: 'اتصل بنا', href: '/contact', icon: '📞' },
  ];

  const isActive = (path: string) => pathname === path;
  const isAdminRoute = pathname?.startsWith('/admin');

  // Don't show public nav on admin routes
  if (isAdminRoute) return null;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-mashhad-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl">🏥</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">دليل مشهد الطبي</h1>
                <p className="text-xs text-gray-500">خدمات طبية بلغتك</p>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    isActive(item.href)
                      ? 'bg-mashhad-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>

            <Link
              href="/admin/login"
              className="px-4 py-2 bg-mashhad-600 text-white rounded-lg hover:bg-mashhad-700 transition font-medium"
            >
              🔐 دخول الإدارة
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Top Bar */}
        <header className="bg-gradient-to-r from-mashhad-600 to-mashhad-700 text-white sticky top-0 z-40 shadow-lg">
          <div className="p-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏥</span>
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">دليل مشهد الطبي</h1>
                <p className="text-xs text-mashhad-100">خدمات طبية بلغتك</p>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition"
              aria-label="Menu"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Sidebar with proper z-index */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setIsOpen(false)}
            />
            <div className="fixed top-0 left-0 bottom-0 w-72 bg-white z-[70] shadow-2xl">
              <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-mashhad-600 to-mashhad-700 text-white">
                <h2 className="text-lg font-bold">القائمة</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="p-4 space-y-2 overflow-y-auto h-full pb-24">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl transition font-medium ${
                      isActive(item.href)
                        ? 'bg-mashhad-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2 text-xl">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  <Link
                    href="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 bg-gradient-to-r from-mashhad-600 to-mashhad-700 text-white rounded-xl hover:from-mashhad-700 hover:to-mashhad-800 transition text-center font-bold shadow-lg"
                  >
                    🔐 دخول الإدارة
                  </Link>
                </div>
              </nav>
            </div>
          </>
        )}

        {/* Bottom Navigation with proper z-index */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t backdrop-blur-lg bg-white/95 z-50 shadow-lg max-w-md mx-auto">
          <div className="flex justify-around p-2">
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition ${
                  isActive(item.href) ? 'text-mashhad-600 bg-mashhad-50' : 'text-gray-500'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
