export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** يعرض السعر بأرقام لاتينية مع فاصل الآلاف: 1,299 */
export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

export function formatDateAr(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ar-SA-u-nu-latn-ca-gregory", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function waLink(number: string, text?: string) {
  const base = `https://wa.me/${number.replace(/[^0-9]/g, "")}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
