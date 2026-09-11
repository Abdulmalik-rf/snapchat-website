import Image from "next/image";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image src="/logo.svg" alt="" width={34} height={34} className="h-8 w-8 md:h-9 md:w-9" priority />
      <span className="flex flex-col leading-none">
        <span className="text-base font-bold tracking-tight text-fog">{site.brand.name}</span>
        {!compact && <span className="mt-1 text-[11px] text-mist">{site.brand.nameAr}</span>}
      </span>
    </span>
  );
}
