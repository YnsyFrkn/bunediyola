"use client";

import { useEffect, useRef, useState } from "react";

import { type PendingAuthAction, useAuthModal } from "@/components/auth/AuthModalProvider";
import { ReportForm } from "@/components/reports/ReportForm";

type ReportButtonProps = {
  targetType: "post" | "comment";
  targetId: string;
  isAuthenticated: boolean;
  label?: string;
};

function isMatchingIntent(
  intent: PendingAuthAction,
  targetType: "post" | "comment",
  targetId: string,
) {
  return intent?.type === "report" && intent.targetType === targetType && intent.targetId === targetId;
}

export function ReportButton({
  targetType,
  targetId,
  isAuthenticated,
  label = "Bildir",
}: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { openAuthModal } = useAuthModal();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleAuthActionReady(event: Event) {
      const customEvent = event as CustomEvent<PendingAuthAction>;

      if (isMatchingIntent(customEvent.detail, targetType, targetId)) {
        setIsOpen(true);
      }
    }

    window.addEventListener("auth-action-ready", handleAuthActionReady);

    return () => window.removeEventListener("auth-action-ready", handleAuthActionReady);
  }, [targetId, targetType]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleClick() {
    if (!isAuthenticated) {
      openAuthModal("login", {
        type: "report",
        targetType,
        targetId,
      });
      return;
    }

    setIsOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex min-h-10 items-center rounded-full border border-[#e7e5e4] bg-white px-4 py-2 text-sm font-semibold text-[#4b5563] transition hover:border-[#fdba74] hover:text-[#9a3412]"
      >
        {label}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111827]/55 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`report-modal-title-${targetId}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div className="max-h-[92vh] w-full max-w-[460px] overflow-y-auto rounded-[32px] bg-white p-6 shadow-[0_30px_90px_rgba(17,24,39,0.28)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c2410c]">
                  Sikayet
                </p>
                <h2 id={`report-modal-title-${targetId}`} className="mt-2 font-heading text-4xl text-[#111827]">
                  {targetType === "post" ? "Bu icerigi bildir" : "Bu yorumu bildir"}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#4b5563]">
                  Bildirimin admin ekibi tarafindan incelenecek. Sikayet eden kullanici bilgisi public alanda gorunmez.
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e7e5e4] text-xl leading-none text-[#4b5563] transition hover:border-[#fb923c] hover:text-[#9a3412]"
                aria-label="Pencereyi kapat"
              >
                x
              </button>
            </div>

            <div className="mt-6">
              <ReportForm targetType={targetType} targetId={targetId} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
