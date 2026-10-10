"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const DISMISS_KEY = "good-dog-a2hs-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function subscribeNoop() {
  return () => {};
}

function readDismissed(): boolean {
  try {
    return window.localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return true;
  }
}

function readIosInstallHint(): boolean {
  if (typeof navigator === "undefined") return false;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (!ios) return false;
  const media = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone =
    "standalone" in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return !(media || iosStandalone);
}

export function AddToHomeScreen() {
  const dismissed = useSyncExternalStore(subscribeNoop, readDismissed, () => true);
  const iosHint = useSyncExternalStore(subscribeNoop, readIosInstallHint, () => false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (dismissed || iosHint) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, [dismissed, iosHint]);

  if (dismissed || hidden) return null;
  if (!iosHint && !deferred) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore storage failures
    }
    setHidden(true);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setHidden(true);
  };

  return (
    <div
      className="fixed inset-x-0 bottom-[4.5rem] z-40 mx-auto w-[min(100%,28rem)] px-4"
      role="dialog"
      aria-label="Add Good Dog to your home screen"
    >
      <div className="rounded-2xl border border-line bg-[var(--bg-elevated)] p-4 shadow-[var(--shadow)]">
        <p className="font-display text-lg text-brand-deep">Add to Home Screen</p>
        {iosHint ? (
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Tap Share, then <span className="font-semibold text-foreground">Add to Home Screen</span>{" "}
            for a one-tap shortcut like an app.
          </p>
        ) : (
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Install Good Dog on your phone for quicker access to today’s plan.
          </p>
        )}
        <div className="mt-3 flex gap-2">
          {!iosHint && deferred ? (
            <button type="button" className="btn btn-primary flex-1" onClick={() => void install()}>
              Add
            </button>
          ) : null}
          <button
            type="button"
            className={`btn btn-secondary ${iosHint || !deferred ? "w-full" : "flex-1"}`}
            onClick={dismiss}
          >
            {iosHint ? "Got it" : "Not now"}
          </button>
        </div>
      </div>
    </div>
  );
}
