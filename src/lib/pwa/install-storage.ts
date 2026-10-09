export const INSTALL_DISMISS_KEY = "good-dog-install-dismissed";
export const APP_ENTERED_AT_KEY = "good-dog-app-entered-at";

/** Wait after first authenticated app entry before showing the in-app install splash. */
export const IN_APP_INSTALL_DELAY_MS = 5 * 60 * 1000;

export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  const media = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone =
    "standalone" in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return media || iosStandalone;
}

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function readInstallDismissed(): boolean {
  try {
    return window.localStorage.getItem(INSTALL_DISMISS_KEY) === "1";
  } catch {
    return true;
  }
}

export function writeInstallDismissed(): void {
  try {
    window.localStorage.setItem(INSTALL_DISMISS_KEY, "1");
  } catch {
    // ignore
  }
}

export function ensureAppEnteredAt(): number {
  try {
    const existing = window.localStorage.getItem(APP_ENTERED_AT_KEY);
    if (existing) {
      const parsed = Number(existing);
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
    const now = Date.now();
    window.localStorage.setItem(APP_ENTERED_AT_KEY, String(now));
    return now;
  } catch {
    return Date.now();
  }
}
