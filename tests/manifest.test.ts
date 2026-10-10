import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";
import { THEME_COLOR } from "@/lib/app-meta";

const m = manifest();
const icons = m.icons ?? [];

describe("web app manifest", () => {
  it("launches as a standalone app", () => {
    expect(m.display).toBe("standalone");
  });

  it("starts inside its own scope", () => {
    expect(m.scope).toBeDefined();
    expect(m.start_url?.startsWith(m.scope ?? "/")).toBe(true);
  });

  it("has a name, short name and theme colour matching the viewport", () => {
    expect(m.name).toBeTruthy();
    expect(m.short_name).toBeTruthy();
    expect(m.theme_color).toBe(THEME_COLOR);
  });

  it("declares 192 and 512 icons plus a maskable icon", () => {
    const sizes = icons.map((i) => i.sizes);
    expect(sizes).toContain("192x192");
    expect(sizes).toContain("512x512");
    expect(icons.some((i) => i.purpose === "maskable")).toBe(true);
  });

  it("only references icon files that exist", () => {
    for (const icon of icons) {
      const file = path.join(process.cwd(), "public", icon.src);
      expect(fs.existsSync(file), icon.src).toBe(true);
    }
  });
});
