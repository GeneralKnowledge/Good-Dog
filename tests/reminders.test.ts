import { describe, expect, it } from "vitest";
import { isReminderDueAt, localTimeHm, timeHmToMinutes } from "@/lib/dates";

describe("localTimeHm", () => {
  it("formats a known UTC instant in Europe/London", () => {
    // 2024-01-15 17:05 UTC = 17:05 London (GMT)
    const date = new Date("2024-01-15T17:05:00.000Z");
    expect(localTimeHm(date, "Europe/London")).toBe("17:05");
  });

  it("formats BST correctly", () => {
    // 2024-07-15 16:05 UTC = 17:05 London (BST)
    const date = new Date("2024-07-15T16:05:00.000Z");
    expect(localTimeHm(date, "Europe/London")).toBe("17:05");
  });

  it("keeps midnight zero-padded", () => {
    const date = new Date("2026-10-09T23:44:00.000Z"); // 00:44 Europe/London (BST)
    expect(localTimeHm(date, "Europe/London")).toBe("00:44");
  });
});

describe("isReminderDueAt", () => {
  it("is not due one minute before the reminder", () => {
    expect(
      isReminderDueAt({ nowHm: "00:44", reminderHm: "00:45", windowMinutes: 30 }),
    ).toBe(false);
  });

  it("is due at the reminder minute", () => {
    expect(
      isReminderDueAt({ nowHm: "00:45", reminderHm: "00:45", windowMinutes: 30 }),
    ).toBe(true);
  });

  it("is due a few minutes after, within the window", () => {
    expect(
      isReminderDueAt({ nowHm: "01:00", reminderHm: "00:45", windowMinutes: 30 }),
    ).toBe(true);
  });

  it("is not due after the delivery window", () => {
    expect(
      isReminderDueAt({ nowHm: "01:20", reminderHm: "00:45", windowMinutes: 30 }),
    ).toBe(false);
  });

  it("parses HH:mm into minutes", () => {
    expect(timeHmToMinutes("00:45")).toBe(45);
    expect(timeHmToMinutes("17:00")).toBe(17 * 60);
    expect(timeHmToMinutes("nope")).toBeNull();
  });
});
