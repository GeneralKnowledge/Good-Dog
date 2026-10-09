const DEFAULT_TZ = process.env.DEFAULT_TIMEZONE ?? "Europe/London";

/** Returns YYYY-MM-DD in the given IANA timezone. */
export function localDateString(
  date: Date = new Date(),
  timeZone: string = DEFAULT_TZ,
): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

export function greetingForHour(date: Date = new Date(), timeZone = DEFAULT_TZ): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "numeric",
      hour12: false,
    }).format(date),
  );

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/** Returns HH:mm in the given IANA timezone (24h). */
export function localTimeHm(date: Date = new Date(), timeZone: string = DEFAULT_TZ): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  // Some engines return "24" for midnight — normalise.
  const normalisedHour = hour === "24" ? "00" : hour.padStart(2, "0");
  return `${normalisedHour}:${minute.padStart(2, "0")}`;
}

/** Parse HH:mm into minutes since midnight, or null if invalid. */
export function timeHmToMinutes(value: string): number | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

/**
 * True when local time is at/after the reminder time and still inside the
 * delivery window (so a 5–15 minute cron can hit it without firing all day).
 */
export function isReminderDueAt(options: {
  nowHm: string;
  reminderHm: string;
  windowMinutes?: number;
}): boolean {
  const now = timeHmToMinutes(options.nowHm);
  const reminder = timeHmToMinutes(options.reminderHm);
  if (now === null || reminder === null) return false;
  const windowMinutes = options.windowMinutes ?? 20;
  return now >= reminder && now < reminder + windowMinutes;
}

export { DEFAULT_TZ };
