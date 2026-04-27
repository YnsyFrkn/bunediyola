import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
};

export function Button({ children, href, variant = "primary" }: ButtonProps) {
  const variants = {
    primary:
      "bg-[#111827] text-white hover:bg-[#ea580c] hover:text-white shadow-[0_14px_30px_rgba(17,24,39,0.14)]",
    secondary:
      "border border-[#d6d3d1] bg-white text-[#1f2937] hover:border-[#fb923c] hover:text-[#9a3412]",
  };

  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 ${variants[variant]}`}
    >
      {children}
    </Link>
  );
}
