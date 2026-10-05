interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

export default function SectionHeading({ eyebrow, title, subtitle, align = "center" }: Props) {
  const isCenter = align === "center";
  return (
    <div className={isCenter ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="eyebrow reveal">{eyebrow}</p>
      <h2 className="heading-section reveal reveal-delay-1 mt-5">{title}</h2>
      {subtitle && <p className="reveal reveal-delay-2 mt-4 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
