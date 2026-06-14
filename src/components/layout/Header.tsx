"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { UserMenu } from "@/components/auth/UserMenu";
import type { Category } from "@/types/category";
import { smoothScrollToTop } from "@/utils/smoothScrollToTop";

import { Container } from "./Container";

type HeaderProps = {
  categories: Category[];
};

export function Header({ categories }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [areCategoriesOpen, setAreCategoriesOpen] = useState(false);
  const [desktopQuery, setDesktopQuery] = useState("");
  const [mobileQuery, setMobileQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const visibleCategories = categories.slice(0, 6);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.body.classList.add("mobile-menu-open");

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("mobile-menu-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  function submitSearch(query: string) {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      router.push("/arama");
      return;
    }

    router.push(`/arama?q=${encodeURIComponent(trimmedQuery)}`);
    setIsOpen(false);
  }

  function handleHomeClick() {
    setIsOpen(false);
    setAreCategoriesOpen(false);

    if (pathname === "/") {
      smoothScrollToTop(1150);
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[rgba(255,251,247,0.92)] backdrop-blur">
      <Container className="py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              onClick={handleHomeClick}
              className="font-heading text-[1.7rem] text-[#111827] sm:text-2xl"
            >
              bunediyola
            </Link>
            <nav className="hidden items-center gap-2 xl:flex">
              {visibleCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/kategori/${category.slug}`}
                  className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-[#374151] transition hover:bg-white hover:text-[#c2410c]"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-3 xl:flex">
            <form
              className="flex h-11 items-center gap-2 rounded-full border border-[#e7e5e4] bg-white px-4 text-sm text-[#6b7280] shadow-sm"
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch(desktopQuery);
              }}
            >
              <span aria-hidden="true">Ara</span>
              <input
                type="search"
                placeholder="Icerik ara"
                value={desktopQuery}
                onChange={(event) => setDesktopQuery(event.target.value)}
                className="w-36 bg-transparent text-[#111827] outline-none placeholder:text-[#9ca3af]"
              />
            </form>
            <Link
              href="/#son-eklenenler"
              className="whitespace-nowrap rounded-full bg-[#111827] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#ea580c]"
            >
              Yeni Icerikler
            </Link>
            <UserMenu />
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen((value) => !value);
              setAreCategoriesOpen(false);
            }}
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#d6d3d1] bg-white px-4 text-sm font-semibold text-[#111827] transition hover:border-[#fb923c] xl:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            Menu
          </button>
        </div>

        {isOpen ? (
          <div
            id="mobile-menu"
            className="mt-3 max-h-[calc(100dvh-5.5rem)] space-y-4 overflow-y-auto overscroll-contain rounded-[24px] border border-[#f1e3d9] bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_20px_40px_rgba(17,24,39,0.08)] sm:mt-4 sm:rounded-[28px] sm:p-5 xl:hidden"
          >
            <form
              className="flex h-11 items-center rounded-full border border-[#e7e5e4] px-4 text-sm text-[#6b7280]"
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch(mobileQuery);
              }}
            >
              <input
                type="search"
                placeholder="Icerik ara"
                value={mobileQuery}
                onChange={(event) => setMobileQuery(event.target.value)}
                className="w-full bg-transparent text-[#111827] outline-none placeholder:text-[#9ca3af]"
              />
            </form>
            <div className="rounded-2xl border border-[#f1e6dd]">
              <button
                type="button"
                onClick={() => setAreCategoriesOpen((value) => !value)}
                className="flex min-h-12 w-full items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[#1f2937] transition hover:bg-[#fff7ed] hover:text-[#c2410c]"
                aria-expanded={areCategoriesOpen}
                aria-controls="mobile-categories"
              >
                <span>Icerikler</span>
                <span
                  aria-hidden="true"
                  className={`text-base transition-transform ${
                    areCategoriesOpen ? "rotate-180" : ""
                  }`}
                >
                  v
                </span>
              </button>
              {areCategoriesOpen ? (
                <nav
                  id="mobile-categories"
                  className="grid grid-cols-2 gap-2 border-t border-[#f1e6dd] p-2"
                >
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/kategori/${category.slug}`}
                      className="rounded-xl px-3 py-3 text-sm font-semibold text-[#1f2937] transition hover:bg-[#fff7ed] hover:text-[#c2410c] sm:px-4"
                      onClick={() => {
                        setIsOpen(false);
                        setAreCategoriesOpen(false);
                      }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </nav>
              ) : null}
            </div>
            <div className="border-t border-[#f1e6dd] pt-4">
              <UserMenu compact onNavigate={() => setIsOpen(false)} />
            </div>
          </div>
        ) : null}
      </Container>
    </header>
  );
}
