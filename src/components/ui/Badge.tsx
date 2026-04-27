import Link from "next/link";

type BadgeProps = {
  children: React.ReactNode;
  href?: string;
};

export function Badge({ children, href }: BadgeProps) {
  const className =
    "inline-flex items-center rounded-full border border-[#f0b48f] bg-[#fff2e8] px-3 py-1 text-sm font-semibold text-[#9a3412] transition hover:border-[#f97316] hover:text-[#7c2d12]";

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return <span className={className}>{children}</span>;
}
