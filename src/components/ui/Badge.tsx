import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "snap",
  className,
}: {
  children: React.ReactNode;
  tone?: "snap" | "neutral" | "warn";
  className?: string;
}) {
  const tones = {
    snap: "border-snap/30 bg-snap/10 text-snap",
    neutral: "border-white/10 bg-white/5 text-mist",
    warn: "border-warn/30 bg-warn/10 text-warn",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
