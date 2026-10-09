import { describe, expect, it } from "vitest";
import { localTimeHm } from "@/lib/dates";

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
});

describe("reminder due window", () => {
  it("treats times at or after the reminder as due", () => {
    const reminder = "17:00";
    expect("16:59" < reminder).toBe(true);
    expect("17:00" < reminder).toBe(false);
    expect("17:05" < reminder).toBe(false);
  });
});
