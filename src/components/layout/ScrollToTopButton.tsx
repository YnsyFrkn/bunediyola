"use client";

import { useEffect, useState } from "react";

import { smoothScrollToTop } from "@/utils/smoothScrollToTop";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 320);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => smoothScrollToTop(1150)}
      className="scroll-to-top-button fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#f0b48f] bg-white text-xl font-semibold text-[#c2410c] shadow-[0_18px_40px_rgba(17,24,39,0.12)] transition hover:-translate-y-1 hover:border-[#f97316] hover:text-[#9a3412]"
      aria-label="Sayfanin basina don"
      title="Yukari cik"
    >
      ^
    </button>
  );
}
