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

/** How many of the last 7 local calendar days appear in `practisedDates` (YYYY-MM-DD). */
export function countPractisedDaysInLastWeek(
  practisedDates: Set<string>,
  timeZone: string = DEFAULT_TZ,
  now: Date = new Date(),
): number {
  const cursor = new Date(now);
  // Noon UTC avoids skipping a calendar day around DST shifts.
  cursor.setUTCHours(12, 0, 0, 0);
  let count = 0;
  for (let i = 0; i < 7; i += 1) {
    if (practisedDates.has(localDateString(cursor, timeZone))) count += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return count;
}

export { DEFAULT_TZ };
