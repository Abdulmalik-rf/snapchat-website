"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { PackageId } from "@/content/site";
import { OrderDialog } from "./OrderDialog";

type OrderCtx = {
  open: (packageId?: PackageId) => void;
  close: () => void;
  isOpen: boolean;
  packageId: PackageId;
};

const Ctx = createContext<OrderCtx | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [packageId, setPackageId] = useState<PackageId>("plan");

  const open = useCallback((id?: PackageId) => {
    if (id) setPackageId(id);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close, isOpen, packageId }), [open, close, isOpen, packageId]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <OrderDialog open={isOpen} onClose={close} packageId={packageId} onPackageChange={setPackageId} />
    </Ctx.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
}
