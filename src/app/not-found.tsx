import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";

export default function NotFoundPage() {
  return (
    <Container className="py-14 sm:py-20">
      <section className="rounded-[40px] border border-[#f1e6dd] bg-white px-6 py-10 text-center shadow-[0_20px_60px_rgba(17,24,39,0.06)] sm:px-10 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c2410c]">404</p>
        <h1 className="mt-4 font-heading text-4xl text-[#111827] sm:text-6xl">
          Aradigin sayfayi bulamadik
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#4b5563]">
          Link eski olabilir ya da sayfa tasinmis olabilir. Ana sayfaya donup kategoriler
          arasindan yeniden gezebilirsin.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/">Ana Sayfaya Don</Button>
          <Button href="/arama" variant="secondary">
            Arama Sayfasina Git
          </Button>
        </div>
      </section>
    </Container>
  );
}
