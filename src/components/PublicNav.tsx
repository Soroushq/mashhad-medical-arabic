// File: src/components/PublicNav.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/styles/nav.css';

export function PublicNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    {
      name: 'الرئيسية',
      href: '/',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      ),
    },
    {
      name: 'الأطباء',
      href: '/doctors',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      ),
    },
    {
      name: 'التخصصات',
      href: '/categories',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      ),
    },
    {
      name: 'الأماكن السياحية',
      href: '/attractions',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10l9-7 9 7v9a2 2 0 01-2 2h-5m-8-11v9a2 2 0 002 2h3"
        />
      ),
    },
    {
      name: 'عن المشروع',
      href: '/about',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    {
      name: 'اتصل بنا',
      href: '/contact',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      ),
    },
  ];

  const isActive = (path: string) => pathname === path;
  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    const index = navItems.findIndex((item) => item.href === pathname);
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [pathname, navItems]);

  if (isAdminRoute) return null;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 nav-shadow">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-mashhad-500 to-mashhad-700 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 transition-colors group-hover:text-mashhad-600">
                  دليل مشهد الطبي
                </h1>
                <p className="text-xs text-gray-500">Medical Directory</p>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            <Link href="/admin/login" className="admin-btn">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>دخول الإدارة</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <header className="mobile-header">
          <div className="flex justify-between items-center h-16 px-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-bold leading-tight">دليل مشهد الطبي</h1>
                <p className="text-[10px] text-mashhad-100">Medical Directory</p>
              </div>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="menu-toggle"
              aria-label="Menu"
            >
              <span className={`hamburger ${isOpen ? 'open' : ''}`} />
            </button>
          </div>
        </header>

        <div
          className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(false)}
        />

        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2 className="text-lg font-bold text-gray-900">القائمة الرئيسية</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="close-btn"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {item.icon}
                </svg>
                <span>{item.name}</span>
              </Link>
            ))}

            <div className="sidebar-divider" />

            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="sidebar-admin-btn"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>دخول الإدارة</span>
            </Link>
          </nav>
        </aside>

        {/* Floating Bottom Nav */}
        <div className="bottom-nav">
          <div className="bottom-nav-container">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`bottom-nav-link ${isActive(item.href) ? 'active' : ''}`}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {item.icon}
                </svg>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
