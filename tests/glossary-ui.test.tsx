/** @vitest-environment jsdom */
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TermRichText } from "@/components/glossary/TermRichText";
import { getGlossaryTerm } from "@/lib/content/glossary";

vi.mock("@/lib/actions/glossary", () => ({
  markTermExploredAction: vi.fn(async () => ({ ok: true })),
  markTermsIntroducedAction: vi.fn(async () => ({ ok: true })),
}));

describe("TermRichText + GlossaryPanel", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("opens and closes a definition without losing exercise copy", () => {
    const onPresented = vi.fn();
    act(() => {
      root.render(
        <div>
          <div data-testid="step">
            <TermRichText
              text='Say “Yes!” — your [[marker-word]] — then give a reward.'
              onTermsPresented={onPresented}
            />
          </div>
          <button type="button" data-testid="next-step">
            Continue
          </button>
        </div>,
      );
    });

    expect(container.textContent).toMatch(/Say/);
    expect(container.textContent).toMatch(/reward/);
    expect(onPresented).toHaveBeenCalledWith(
      expect.arrayContaining(["marker-word"]),
    );

    const termButton = container.querySelector(
      'button.term-link[aria-label="Explain: Marker word"]',
    ) as HTMLButtonElement | null;
    expect(termButton).toBeTruthy();

    act(() => {
      termButton!.click();
    });

    const dialog = document.body.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    const term = getGlossaryTerm("marker-word")!;
    expect(dialog!.textContent).toContain(term.shortDefinition);
    expect(dialog!.textContent).toMatch(/Example:/);
    const learnMore = dialog!.querySelector(
      'a[href="/learn/glossary/marker-word"]',
    );
    expect(learnMore).toBeTruthy();
    expect(container.querySelector('[data-testid="next-step"]')).toBeTruthy();

    const close = dialog!.querySelector(
      'button[aria-label="Close definition"]',
    ) as HTMLButtonElement;
    act(() => {
      close.click();
    });

    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
    expect(container.textContent).toMatch(/reward/);
  });

  it("closes the panel with Escape for keyboard users", () => {
    act(() => {
      root.render(<TermRichText text="Use a [[marker-word]] with clear timing." />);
    });

    const termButton = container.querySelector(
      "button.term-link",
    ) as HTMLButtonElement;
    act(() => {
      termButton.click();
    });
    expect(document.body.querySelector('[role="dialog"]')).toBeTruthy();

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  });

  it("renders unknown term markup as plain text", () => {
    act(() => {
      root.render(
        <TermRichText text="Hello [[not-a-real-term|mystery]] world" />,
      );
    });
    expect(container.textContent).toContain("mystery");
    expect(container.querySelector("button.term-link")).toBeNull();
  });
});
