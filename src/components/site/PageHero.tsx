import Breadcrumbs, { type Crumb } from "./Breadcrumbs";

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
}

export default function PageHero({ eyebrow, title, subtitle, breadcrumbs }: Props) {
  return (
    <section className="relative overflow-hidden bg-surface pb-16 pt-32 md:pb-20 md:pt-36">
      <div className="container-luxe relative text-center">
        {breadcrumbs && (
          <div className="mb-6 flex justify-center">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <p className="eyebrow reveal">{eyebrow}</p>
        <h1 className="heading-display reveal reveal-delay-1 mx-auto mt-6 max-w-4xl">{title}</h1>
        {subtitle && (
          <p className="reveal reveal-delay-2 mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
