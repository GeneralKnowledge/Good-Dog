"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  IN_APP_INSTALL_DELAY_MS,
  ensureAppEnteredAt,
  isIosDevice,
  isStandaloneDisplay,
  readInstallDismissed,
  writeInstallDismissed,
} from "@/lib/pwa/install-storage";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function subscribeNoop() {
  return () => {};
}

function subscribeInstallDelay(onStoreChange: () => void) {
  const enteredAt = ensureAppEnteredAt();
  const remaining = IN_APP_INSTALL_DELAY_MS - (Date.now() - enteredAt);
  if (remaining <= 0) {
    return () => {};
  }
  const timer = window.setTimeout(onStoreChange, remaining);
  return () => window.clearTimeout(timer);
}

function readInAppDelayReady(): boolean {
  return Date.now() - ensureAppEnteredAt() >= IN_APP_INSTALL_DELAY_MS;
}

type Mode = "landing" | "in-app";

export function InstallSplash({ mode }: { mode: Mode }) {
  const dismissed = useSyncExternalStore(subscribeNoop, readInstallDismissed, () => true);
  const standalone = useSyncExternalStore(subscribeNoop, isStandaloneDisplay, () => true);
  const ios = useSyncExternalStore(subscribeNoop, isIosDevice, () => false);
  const delayReady = useSyncExternalStore(
    mode === "in-app" ? subscribeInstallDelay : subscribeNoop,
    mode === "in-app" ? readInAppDelayReady : () => true,
    () => mode === "landing",
  );
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (dismissed || standalone || !delayReady || ios) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, [dismissed, standalone, delayReady, ios]);

  if (dismissed || standalone || hidden || !delayReady) return null;

  const canNativeInstall = Boolean(deferred) && !ios;
  const showIosSteps = ios;

  const dismiss = () => {
    writeInstallDismissed();
    setHidden(true);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    writeInstallDismissed();
    setHidden(true);
  };

  const shellClass =
    mode === "landing"
      ? "fixed inset-0 z-50 flex items-end justify-center bg-chrome/45 px-4 pb-10 pt-10 sm:items-center"
      : "install-anchor fixed inset-x-0 bottom-[4.5rem] z-40 px-4 lg:bottom-4";

  return (
    <div className={shellClass} role="dialog" aria-label="Install Good Dog">
      <div
        className={
          mode === "landing"
            ? "w-full max-w-md overflow-hidden rounded-[1.5rem] border border-line bg-elevated shadow-[var(--shadow)]"
            : "rounded-2xl border border-line bg-elevated p-4 shadow-[var(--shadow)]"
        }
      >
        {mode === "landing" ? (
          <div className="install-splash-hero px-5 pb-2 pt-8">
            <p className="heading-section tracking-tight">Good Dog</p>
            <p className="mt-3 max-w-[28ch] text-base leading-relaxed text-muted">
              Install the app for a one-tap shortcut to today’s plan.
            </p>
          </div>
        ) : (
          <>
            <p className="heading-subsection">Install Good Dog</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Keep today’s plan a tap away on your home screen.
            </p>
          </>
        )}

        <div className={mode === "landing" ? "space-y-3 px-5 pb-5 pt-4" : "mt-3"}>
          {showIosSteps ? (
            <p className="text-sm leading-relaxed text-muted">
              Tap Share, then{" "}
              <span className="font-semibold text-foreground">Add to Home Screen</span>.
            </p>
          ) : !canNativeInstall ? (
            <p className="text-sm leading-relaxed text-muted">
              Use your browser menu and choose <span className="font-semibold">Install app</span>{" "}
              when it appears.
            </p>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            {canNativeInstall ? (
              <button
                type="button"
                className="btn btn-primary flex-1"
                onClick={() => void install()}
              >
                Install
              </button>
            ) : null}
            <button
              type="button"
              className={`btn btn-secondary ${canNativeInstall ? "flex-1" : "w-full"}`}
              onClick={dismiss}
            >
              {showIosSteps && !canNativeInstall ? "Got it" : "Not now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
