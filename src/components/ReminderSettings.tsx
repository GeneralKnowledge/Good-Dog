"use client";

import { useActionState, useState, useTransition } from "react";
import {
  removePushSubscriptionAction,
  savePushSubscriptionAction,
  updateReminderSettingsAction,
  type ReminderActionResult,
} from "@/lib/actions/reminders";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

async function registerAndSubscribe(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push notifications are not supported in this browser");
  }

  const keyRes = await fetch("/api/push/vapid-public-key");
  const keyJson = (await keyRes.json()) as { configured: boolean; publicKey: string | null };
  if (!keyJson.configured || !keyJson.publicKey) {
    throw new Error("Reminders are not configured on this server yet");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted");
  }

  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(keyJson.publicKey) as BufferSource,
    }));

  const json = subscription.toJSON();
  const endpoint = json.endpoint;
  const p256dh = json.keys?.p256dh;
  const auth = json.keys?.auth;
  if (!endpoint || !p256dh || !auth) {
    throw new Error("Could not read push subscription keys");
  }

  const saved = await savePushSubscriptionAction({
    endpoint,
    p256dh,
    auth,
    userAgent: navigator.userAgent,
  });
  if (!saved.ok) {
    throw new Error(saved.error);
  }

  return subscription;
}

export function ReminderSettings({
  configured,
  initialEnabled,
  initialTime,
  dogName,
}: {
  configured: boolean;
  initialEnabled: boolean;
  initialTime: string;
  dogName: string;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [time, setTime] = useState(initialTime);
  const [clientError, setClientError] = useState<string | null>(null);
  const [clientOk, setClientOk] = useState<string | null>(null);
  const [pendingSubscribe, startSubscribe] = useTransition();
  const [state, formAction, pendingSave] = useActionState(
    updateReminderSettingsAction,
    null as ReminderActionResult | null,
  );

  const statusMessage =
    clientOk ?? (state?.ok ? "Reminder settings saved." : null);

  const onToggle = (next: boolean) => {
    setEnabled(next);
    setClientError(null);
    setClientOk(null);
    if (!next) {
      startSubscribe(() => {
        void (async () => {
          try {
            const registration = await navigator.serviceWorker.getRegistration();
            const sub = await registration?.pushManager.getSubscription();
            if (sub) {
              await removePushSubscriptionAction(sub.endpoint);
              await sub.unsubscribe();
            }
            const formData = new FormData();
            formData.set("reminderLocalTime", time);
            // omit reminderEnabled so the action stores false
            await updateReminderSettingsAction(null, formData);
            setClientOk("Reminders turned off.");
          } catch {
            // ignore unsubscribe failures
          }
        })();
      });
      return;
    }

    startSubscribe(() => {
      void (async () => {
        try {
          await registerAndSubscribe();
          const formData = new FormData();
          formData.set("reminderEnabled", "on");
          formData.set("reminderLocalTime", time);
          const saved = await updateReminderSettingsAction(null, formData);
          if (!saved.ok) {
            throw new Error(saved.error);
          }
          setClientOk("Notifications enabled on this device.");
        } catch (error) {
          setEnabled(false);
          setClientError(error instanceof Error ? error.message : "Could not enable notifications");
        }
      })();
    });
  };

  if (!configured) {
    return (
      <section className="mx-5 mb-4 card p-5">
        <h2 className="font-display text-xl">Training reminders</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Daily reminders are not configured on this server yet. Ask your host to set VAPID keys and
          a reminder cron job.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-5 mb-4 card p-5">
      <h2 className="font-display text-xl">Training reminders</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Get a gentle daily nudge when {dogName} still has practice left. Works best after you Install
        Good Dog on your home screen (required on iPhone).
      </p>

      <form action={formAction} className="mt-4 flex flex-col gap-4">
        <label className="flex items-center justify-between gap-3 text-sm font-semibold">
          <span>Daily reminder</span>
          <input
            type="checkbox"
            name="reminderEnabled"
            checked={enabled}
            onChange={(event) => onToggle(event.target.checked)}
            className="h-5 w-5 accent-[var(--brand)]"
          />
        </label>

        <div className="field">
          <label htmlFor="reminderLocalTime">Reminder time</label>
          <input
            id="reminderLocalTime"
            name="reminderLocalTime"
            type="time"
            required
            value={time}
            onChange={(event) => setTime(event.target.value)}
            disabled={!enabled}
          />
          <p className="text-xs text-muted">Uses your account timezone (default Europe/London).</p>
        </div>

        {clientError ? (
          <p className="rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger" role="alert">
            {clientError}
          </p>
        ) : null}
        {state && !state.ok ? (
          <p className="rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger" role="alert">
            {state.error}
          </p>
        ) : null}
        {statusMessage ? (
          <p className="rounded-xl bg-brand-soft px-3 py-2 text-sm text-brand-deep" role="status">
            {statusMessage}
          </p>
        ) : null}

        <button
          className="btn btn-primary"
          type="submit"
          disabled={pendingSave || pendingSubscribe || !enabled}
        >
          {pendingSave || pendingSubscribe ? "Saving…" : "Save reminder"}
        </button>
      </form>
    </section>
  );
}
