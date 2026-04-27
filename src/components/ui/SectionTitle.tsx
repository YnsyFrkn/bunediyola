type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="max-w-2xl space-y-3">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c2410c]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading text-3xl leading-tight text-[#111827] sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="text-lg leading-8 text-[#4b5563]">{description}</p> : null}
    </div>
  );
}
