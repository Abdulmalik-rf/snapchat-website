import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-start", className)}>
      {eyebrow ? (
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-snap/30 bg-snap/10 px-3 py-1 text-xs font-semibold text-snap">
          {eyebrow}
        </span>
      ) : null}
      <h2 id={id} className="text-balance text-3xl font-bold leading-tight md:text-4xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-3 text-base leading-relaxed text-mist md:text-lg">{subtitle}</p> : null}
    </Reveal>
  );
}
