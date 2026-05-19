"use client";

import { useMemo, useState } from "react";

type ShareButtonsProps = {
  title: string;
  summary: string;
  url: string;
};

function getShareLinks(title: string, url: string) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];
}

export function ShareButtons({ title, summary, url }: ShareButtonsProps) {
  const [copyLabel, setCopyLabel] = useState("Linki kopyala");
  const shareLinks = useMemo(() => getShareLinks(title, url), [title, url]);

  async function handleNativeShare() {
    if (!navigator.share) {
      await handleCopy();
      return;
    }

    try {
      await navigator.share({
        title,
        text: summary,
        url,
      });
    } catch {
      // The user may cancel the native share sheet.
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopyLabel("Kopyalandi");
      window.setTimeout(() => setCopyLabel("Linki kopyala"), 1800);
    } catch {
      setCopyLabel("Kopyalanamadi");
      window.setTimeout(() => setCopyLabel("Linki kopyala"), 1800);
    }
  }

  return (
    <section className="rounded-[28px] border border-[#f1e6dd] bg-[#fffaf5] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c2410c]">
            Paylas
          </p>
          <h2 className="mt-1 text-xl font-semibold text-[#111827]">Bu yaziyi arkadaslarina gonder</h2>
        </div>
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ea580c]"
        >
          Paylas
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#fed7aa] bg-white px-4 py-2 text-sm font-semibold text-[#9a3412] transition hover:border-[#fb923c] hover:bg-[#ffedd5]"
          >
            {link.label}
          </a>
        ))}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#d6d3d1] bg-white px-4 py-2 text-sm font-semibold text-[#1f2937] transition hover:border-[#fb923c] hover:text-[#9a3412]"
        >
          {copyLabel}
        </button>
      </div>
    </section>
  );
}
