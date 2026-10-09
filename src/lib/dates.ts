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

export { DEFAULT_TZ };
