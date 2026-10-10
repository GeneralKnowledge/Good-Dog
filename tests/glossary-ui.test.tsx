/** @vitest-environment jsdom */
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GlossaryBrowser } from "@/components/glossary/GlossaryBrowser";
import { TermRichText } from "@/components/glossary/TermRichText";
import { getGlossaryTerm } from "@/lib/content/glossary";

vi.mock("@/lib/actions/glossary", () => ({
  markTermExploredAction: vi.fn(async () => ({ ok: true })),
  markTermsIntroducedAction: vi.fn(async () => ({ ok: true })),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("TermRichText + GlossaryPanel", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    document.body.style.overflow = "";
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    document.body.style.overflow = "";
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
    expect(document.body.style.overflow).toBe("hidden");

    const learnMore = Array.from(dialog!.querySelectorAll("button")).find((b) =>
      /Learn more/i.test(b.textContent ?? ""),
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
    expect(document.body.style.overflow).not.toBe("hidden");
    expect(container.textContent).toMatch(/reward/);
  });

  it("shows a quiet new-term cue only for the highlighted new term", () => {
    act(() => {
      root.render(
        <TermRichText
          text="Use your [[marker-word]] with clear [[timing]]."
          termExposure={{ timing: "introduced" }}
          highlightNewTermId="marker-word"
        />,
      );
    });

    expect(container.textContent).toMatch(/new training word/i);
    expect(
      container.querySelector(
        'button.term-link[aria-label="New training word: Marker word"]',
      ),
    ).toBeTruthy();
    expect(
      container.querySelector('button.term-link[aria-label="Explain: Timing"]'),
    ).toBeTruthy();
  });

  it("does not show a new cue for previously introduced terms", () => {
    act(() => {
      root.render(
        <TermRichText
          text="Use your [[marker-word]] again."
          termExposure={{ "marker-word": "explored" }}
          highlightNewTermId="marker-word"
        />,
      );
    });
    expect(container.textContent).not.toMatch(/new training word/i);
  });

  it("closes the panel with Escape and restores focus for keyboard users", () => {
    act(() => {
      root.render(<TermRichText text="Use a [[marker-word]] with clear timing." />);
    });

    const termButton = container.querySelector(
      "button.term-link",
    ) as HTMLButtonElement;
    act(() => {
      termButton.focus();
      termButton.click();
    });
    expect(document.body.querySelector('[role="dialog"]')).toBeTruthy();
    expect(document.body.style.overflow).toBe("hidden");

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(termButton);
  });

  it("traps Tab focus inside the open dialog", () => {
    act(() => {
      root.render(<TermRichText text="Open [[marker-word]] please." />);
    });
    const termButton = container.querySelector(
      "button.term-link",
    ) as HTMLButtonElement;
    act(() => {
      termButton.click();
    });

    const dialog = document.body.querySelector('[role="dialog"]') as HTMLElement;
    const focusable = [
      ...dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      ),
    ];
    expect(focusable.length).toBeGreaterThanOrEqual(2);
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;

    act(() => {
      last.focus();
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
      );
    });
    expect(document.activeElement).toBe(first);

    act(() => {
      first.focus();
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Tab",
          shiftKey: true,
          bubbles: true,
        }),
      );
    });
    expect(document.activeElement).toBe(last);
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

describe("GlossaryBrowser", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    sessionStorage.clear();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    sessionStorage.clear();
  });

  it("filters to new-to-you terms and hides explored", () => {
    act(() => {
      root.render(
        <GlossaryBrowser
          exposure={{
            "marker-word": "explored",
            reward: "introduced",
          }}
        />,
      );
    });

    const exploredLink = container.querySelector('a[href="/learn/glossary/marker-word"]');
    expect(exploredLink).toBeTruthy();

    const newFilter = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent === "New to you",
    );
    act(() => {
      newFilter!.click();
    });

    expect(container.querySelector('a[href="/learn/glossary/marker-word"]')).toBeNull();
    expect(container.textContent).toMatch(/new to you/i);
  });
});
