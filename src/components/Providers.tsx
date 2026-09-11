"use client";

import { MotionConfig } from "motion/react";
import { OrderProvider } from "@/components/order/OrderProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <OrderProvider>{children}</OrderProvider>
    </MotionConfig>
  );
}
