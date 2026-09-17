import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageBanner({
  title,
  description,
  breadcrumb,
}: {
  title: string;
  description?: string;
  breadcrumb: string;
}) {
  return (
    <div className="relative overflow-hidden bg-ink pt-28 pb-16 text-ink-foreground sm:pt-32 sm:pb-20">
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/95 to-ink/80" />
      <div className="section-shell relative">
        <nav className="flex items-center gap-2 text-xs font-semibold text-ink-foreground/70 sm:text-sm">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-primary" />
          <span className="text-primary font-bold">{breadcrumb}</span>
        </nav>
        <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl text-ink-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-base text-ink-foreground/80 sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
