// File: src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { PublicNav } from "@/components/PublicNav";

const noto = Noto_Kufi_Arabic({ 
  subsets: ["arabic"],
  variable: "--font-noto-kufi",
  weight: ["300", "400", "500", "700"]
});

export const metadata: Metadata = {
  title: "دليل مشهد الطبي | أفضل الأطباء في مشهد",
  description: "ابحث عن أفضل الأطباء في مشهد مع خدمات ترجمة احترافية. نربطك بالمتخصصين مع مترجم طبي يرافقك في كل خطوة.",
  keywords: ["مشهد", "أطباء", "ترجمة طبية", "علاج في إيران", "Mashhad doctors", "medical translation"],
  authors: [{ name: "دليل مشهد الطبي" }],
  icons: {
    icon: [
      { url: '/mmg.png', sizes: 'any', type: 'image/png' },
    ],
    apple: [
      { url: '/mmg.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/mmg.png',
  },
  openGraph: {
    title: "دليل مشهد الطبي | أفضل الأطباء في مشهد",
    description: "ابحث عن أفضل الأطباء في مشهد مع خدمات ترجمة احترافية",
    type: "website",
    locale: "ar_SA",
    images: [
      {
        url: '/mmg.png',
        width: 1200,
        height: 630,
        alt: 'دليل مشهد الطبي',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "دليل مشهد الطبي",
    description: "ابحث عن أفضل الأطباء في مشهد مع خدمات ترجمة احترافية",
    images: ['/mmg.png'],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0284c7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={noto.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/mmg.png" type="image/png" />
      </head>
      <body className="bg-gray-50 text-slate-800 antialiased" suppressHydrationWarning>
        <PublicNav />
        
        {/* Desktop Layout */}
        <div className="hidden md:block min-h-screen">
          {children}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden max-w-md mx-auto min-h-screen bg-white shadow-2xl relative pb-20">
          {children}
        </div>
      </body>
    </html>
  );
}
