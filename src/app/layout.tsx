import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";

import { AppShell } from "@/components/layout/AppShell";

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
  title: "bunediyola | Sade ve modern icerik platformu",
  description:
    "Gundemden mizaha, teknolojiden yasama kadar farkli konularda kolay gezilen bir icerik deneyimi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${dmSerifDisplay.variable}`}
    >
      <body className="min-h-screen bg-[#fffbf7] text-[#111827] antialiased">
        <div className="relative flex min-h-screen flex-col">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.22),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_28%),linear-gradient(180deg,_#fff7ed_0%,_#fffbf7_55%,_#fffbf7_100%)]" />
          <AppShell>{children}</AppShell>
        </div>
      </body>
    </html>
  );
}
