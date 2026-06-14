import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";

import { AppShell } from "@/components/layout/AppShell";
import { getPublicCategories } from "@/lib/content";
import { getAbsoluteImageUrl, getSiteUrl, siteDescription, siteName } from "@/lib/site";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "bunediyola | Sade ve modern icerik platformu",
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName,
    title: "bunediyola | Sade ve modern icerik platformu",
    description: siteDescription,
    images: [
      {
        url: getAbsoluteImageUrl("/images/posts/gundem-gunluk.svg"),
        width: 1200,
        height: 630,
        alt: "bunediyola",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "bunediyola | Sade ve modern icerik platformu",
    description: siteDescription,
    images: [getAbsoluteImageUrl("/images/posts/gundem-gunluk.svg")],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getPublicCategories();

  return (
    <html
      lang="tr"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${dmSerifDisplay.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var savedTheme = localStorage.getItem("bunediyola-theme");
                var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                var theme = savedTheme === "dark" || savedTheme === "light"
                  ? savedTheme
                  : (prefersDark ? "dark" : "light");
                document.documentElement.classList.toggle("dark", theme === "dark");
                document.documentElement.style.colorScheme = theme;
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#fffbf7] text-[#111827] antialiased">
        <div className="relative flex min-h-screen flex-col">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.22),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_28%),linear-gradient(180deg,_#fff7ed_0%,_#fffbf7_55%,_#fffbf7_100%)]" />
          <AppShell categories={categories}>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}
