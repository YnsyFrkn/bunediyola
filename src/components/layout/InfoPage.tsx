import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";

type InfoPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function InfoPage({ eyebrow, title, description, children }: InfoPageProps) {
  return (
    <main className="py-12">
      <Container className="space-y-8">
        <section className="rounded-[32px] border border-[#f1e6dd] bg-white p-8 shadow-[0_18px_50px_rgba(17,24,39,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c2410c]">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-4xl text-[#111827] sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#4b5563]">{description}</p>
        </section>

        <section className="prose prose-stone max-w-none rounded-[32px] border border-[#f1e6dd] bg-white p-8 text-[#374151] shadow-sm">
          {children}
        </section>
      </Container>
    </main>
  );
}
