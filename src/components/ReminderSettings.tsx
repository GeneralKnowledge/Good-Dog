"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import {
  getReminderDebugAction,
  removePushSubscriptionAction,
  savePushSubscriptionAction,
  sendTestReminderAction,
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

function isStandaloneDisplay(): boolean {
  const media = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone =
    "standalone" in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return media || iosStandalone;
}

function isIosDevice(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

async function registerAndSubscribe(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push notifications are not supported in this browser");
  }

  if (isIosDevice() && !isStandaloneDisplay()) {
    throw new Error(
      "On iPhone, open Good Dog from the Home Screen icon first (Share → Add to Home Screen), then enable reminders there.",
    );
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

  const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
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

type DeviceStatus = {
  ios: boolean;
  standalone: boolean;
  permission: NotificationPermission | "unsupported";
  serviceWorker: boolean;
  pushManager: boolean;
};

type ServerStatus = {
  reminderEnabled: boolean;
  reminderLocalTime: string;
  reminderLastSentDate: string | null;
  timezone: string;
  subscriptionCount: number;
  pushConfigured: boolean;
};

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
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>(null);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [pendingSubscribe, startSubscribe] = useTransition();
  const [pendingTest, startTest] = useTransition();
  const [pendingDebug, startDebug] = useTransition();
  const [state, formAction, pendingSave] = useActionState(
    updateReminderSettingsAction,
    null as ReminderActionResult | null,
  );

  const refreshDiagnostics = () => {
    startDebug(() => {
      void (async () => {
        const permission =
          typeof Notification === "undefined" ? "unsupported" : Notification.permission;
        setDeviceStatus({
          ios: isIosDevice(),
          standalone: isStandaloneDisplay(),
          permission,
          serviceWorker: "serviceWorker" in navigator,
          pushManager: "PushManager" in window,
        });
        const debug = await getReminderDebugAction();
        if (debug.ok) {
          setServerStatus({
            reminderEnabled: debug.reminderEnabled,
            reminderLocalTime: debug.reminderLocalTime,
            reminderLastSentDate: debug.reminderLastSentDate,
            timezone: debug.timezone,
            subscriptionCount: debug.subscriptionCount,
            pushConfigured: debug.pushConfigured,
          });
        }
      })();
    });
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      refreshDiagnostics();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const statusMessage =
    clientOk ?? (state?.ok ? (state.message ?? "Reminder settings saved.") : null);

  const sendTest = () => {
    setClientError(null);
    setClientOk(null);
    startTest(() => {
      void (async () => {
        try {
          if (enabled) {
            await registerAndSubscribe();
          }
          const result = await sendTestReminderAction();
          if (!result.ok) {
            setClientError(result.error);
            refreshDiagnostics();
            return;
          }
          setClientOk(result.message ?? "Test notification sent.");
          refreshDiagnostics();
        } catch (error) {
          setClientError(
            error instanceof Error ? error.message : "Could not send test notification",
          );
          refreshDiagnostics();
        }
      })();
    });
  };

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
            await updateReminderSettingsAction(null, formData);
            setClientOk("Reminders turned off.");
            refreshDiagnostics();
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
          refreshDiagnostics();
        } catch (error) {
          setEnabled(false);
          setClientError(error instanceof Error ? error.message : "Could not enable notifications");
          refreshDiagnostics();
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

  const iosNeedsInstall = deviceStatus?.ios && !deviceStatus.standalone;

  return (
    <section className="mx-5 mb-4 card p-5">
      <h2 className="font-display text-xl">Training reminders</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Get a gentle daily nudge when {dogName} still has practice left. On iPhone this only works
        from the Home Screen app (iOS 16.4+).
      </p>

      {iosNeedsInstall ? (
        <p className="mt-3 rounded-xl bg-accent-soft px-3 py-2 text-sm text-[var(--caution)]" role="status">
          You’re in Safari. Tap Share → <span className="font-semibold">Add to Home Screen</span>,
          open Good Dog from that icon, then turn reminders on here.
        </p>
      ) : null}

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
          disabled={pendingSave || pendingSubscribe || pendingTest || !enabled}
        >
          {pendingSave || pendingSubscribe ? "Saving…" : "Save reminder"}
        </button>
      </form>

      <button
        type="button"
        className="btn btn-secondary mt-3 w-full"
        disabled={pendingTest || pendingSubscribe || !enabled || Boolean(iosNeedsInstall)}
        onClick={sendTest}
      >
        {pendingTest ? "Sending test…" : "Send test notification"}
      </button>

      <div className="mt-4 rounded-xl bg-brand-soft/50 px-3 py-3 text-xs leading-relaxed text-muted">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-foreground">Notification check</p>
          <button
            type="button"
            className="underline"
            disabled={pendingDebug}
            onClick={refreshDiagnostics}
          >
            Refresh
          </button>
        </div>
        {deviceStatus ? (
          <ul className="mt-2 space-y-1">
            <li>Opened as app (Home Screen): {deviceStatus.standalone ? "yes" : "no"}</li>
            <li>iPhone/iPad: {deviceStatus.ios ? "yes" : "no"}</li>
            <li>Permission: {deviceStatus.permission}</li>
            <li>Service worker API: {deviceStatus.serviceWorker ? "yes" : "no"}</li>
            <li>Push API: {deviceStatus.pushManager ? "yes" : "no"}</li>
          </ul>
        ) : null}
        {serverStatus ? (
          <ul className="mt-2 space-y-1">
            <li>Reminders enabled: {serverStatus.reminderEnabled ? "yes" : "no"}</li>
            <li>
              Saved time: {serverStatus.reminderLocalTime} ({serverStatus.timezone})
            </li>
            <li>Devices registered: {serverStatus.subscriptionCount}</li>
            <li>Last daily send: {serverStatus.reminderLastSentDate ?? "never"}</li>
          </ul>
        ) : null}
        <p className="mt-2">
          If <span className="font-semibold">Send test</span> works but the set time does not, the
          server cron job is usually missing or not running every 5–15 minutes.
        </p>
      </div>
    </section>
  );
}
