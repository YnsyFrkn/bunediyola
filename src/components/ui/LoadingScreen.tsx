type LoadingScreenProps = {
  variant?: "public" | "admin";
  title?: string;
  description?: string;
};

const variantStyles = {
  public: {
    overlay: "bg-[#fffbf7]/88",
    card: "border-[#f4d9c5] bg-white/94 shadow-[0_28px_80px_rgba(17,24,39,0.10)]",
    accent: "text-[#c2410c]",
    ring: "border-t-[#ea580c] border-r-[#fb923c]",
    dot: "bg-[#fff7ed]",
  },
  admin: {
    overlay: "bg-[#f7f4ef]/90",
    card: "border-[#e8ddd2] bg-white/95 shadow-[0_28px_80px_rgba(17,24,39,0.08)]",
    accent: "text-[#9a3412]",
    ring: "border-t-[#9a3412] border-r-[#d97706]",
    dot: "bg-[#fef3c7]",
  },
} as const;

export function LoadingScreen({
  variant = "public",
  title = "Sayfa yukleniyor",
  description = "Icerikler hazirlaniyor. Kisa bir beklemenin ardindan kaldigin yerden devam edeceksin.",
}: LoadingScreenProps) {
  const styles = variantStyles[variant];

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      role="status"
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm ${styles.overlay}`}
    >
      <div
        className={`w-full max-w-md rounded-[32px] border p-8 text-center ${styles.card} sm:p-10`}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-16 w-16">
            <span className="absolute inset-0 rounded-full border-4 border-[#fed7aa]/50" />
            <span
              className={`absolute inset-0 animate-spin rounded-full border-4 border-transparent ${styles.ring}`}
            />
            <span className={`absolute inset-[10px] rounded-full ${styles.dot}`} />
          </div>

          <div className="space-y-3">
            <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${styles.accent}`}>
              bunediyola
            </p>
            <h2 className="font-heading text-3xl text-[#111827] sm:text-[2.15rem]">{title}</h2>
            <p className="text-sm leading-7 text-[#4b5563] sm:text-base">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
