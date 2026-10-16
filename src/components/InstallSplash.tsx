"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  isIosDevice,
  isStandaloneDisplay,
  readFirstSessionComplete,
  readInstallDismissed,
  subscribeFirstSession,
  writeInstallDismissed,
} from "@/lib/pwa/install-storage";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function subscribeNoop() {
  return () => {};
}

/** Shown in the app shell after the owner completes at least one exercise with feedback. */
export function InstallSplash() {
  const dismissed = useSyncExternalStore(subscribeNoop, readInstallDismissed, () => true);
  const standalone = useSyncExternalStore(subscribeNoop, isStandaloneDisplay, () => true);
  const ios = useSyncExternalStore(subscribeNoop, isIosDevice, () => false);
  const firstSessionComplete = useSyncExternalStore(
    subscribeFirstSession,
    readFirstSessionComplete,
    () => false,
  );
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (dismissed || standalone || !firstSessionComplete || ios) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, [dismissed, standalone, firstSessionComplete, ios]);

  if (dismissed || standalone || hidden || !firstSessionComplete) return null;

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

  return (
    <div
      className="install-anchor fixed inset-x-0 bottom-[4.5rem] z-40 px-4 lg:bottom-4"
      role="dialog"
      aria-label="Install Good Dog"
    >
      <div className="rounded-2xl border border-line bg-elevated p-4 shadow-[var(--shadow)]">
        <p className="heading-subsection">Install Good Dog</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Keep today’s plan a tap away on your home screen.
        </p>

        <div className="mt-3">
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

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
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
