import { site, type Package, type PackageId } from "@/content/site";

export const PACKAGE_IDS = ["analysis", "plan", "expert"] as const satisfies readonly PackageId[];

export function getPackage(id: PackageId): Package {
  const pkg = site.packages.find((p) => p.id === id);
  if (!pkg) throw new Error(`Unknown package: ${id}`);
  return pkg;
}

/**
 * رابط منتج سلة للباقة. متغيرات البيئة لها الأولوية على القيم في site.ts
 * (SALLA_PRODUCT_URL_ANALYSIS / _PLAN / _EXPERT). يعمل على الخادم فقط.
 */
export function getSallaUrl(id: PackageId): string {
  const envKey = `SALLA_PRODUCT_URL_${id.toUpperCase()}`;
  const fromEnv = process.env[envKey];
  return fromEnv && fromEnv.trim().length > 0 ? fromEnv.trim() : getPackage(id).sallaUrl;
}
