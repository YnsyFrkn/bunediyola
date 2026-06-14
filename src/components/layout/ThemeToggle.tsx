"use client";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  function toggleTheme() {
    const nextTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";

    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem("bunediyola-theme", nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={
        compact
          ? "inline-flex min-h-11 w-full items-center justify-between rounded-2xl border border-[#e7e5e4] bg-white px-4 py-3 text-sm font-semibold text-[#374151] transition hover:border-[#fdba74] hover:text-[#c2410c]"
          : "inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-[#e7e5e4] bg-white px-3 text-sm font-semibold text-[#374151] transition hover:border-[#fdba74] hover:text-[#c2410c]"
      }
      aria-label="Acik ve koyu tema arasinda gecis yap"
      title="Temayi degistir"
    >
      <span aria-hidden="true">Tema</span>
      {compact ? <span>Gorunumu Degistir</span> : null}
    </button>
  );
}
