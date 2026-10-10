"use client";

import { InstallSplash } from "@/components/InstallSplash";

/** @deprecated Prefer InstallSplash — kept as a thin alias for existing imports. */
export function AddToHomeScreen() {
  return <InstallSplash mode="in-app" />;
}
