import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ENGINE_DIR = path.join(process.cwd(), "src/lib/coaching");

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? sourceFiles(full) : full.endsWith(".ts") ? [full] : [];
  });
}

describe("coaching engine stays domain-neutral", () => {
  const files = sourceFiles(ENGINE_DIR);

  it("finds the engine files", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files.map((f) => [path.relative(process.cwd(), f), f] as const))(
    "%s mentions no dog-training vocabulary",
    (_name, file) => {
      const text = fs.readFileSync(file, "utf8");
      expect(text).not.toMatch(/\b(dogs?|pupp(y|ies)|breed|canine|leash)\b/i);
    },
  );
});
