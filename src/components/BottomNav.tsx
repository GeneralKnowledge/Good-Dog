"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/today", label: "Today" },
  { href: "/learn", label: "Learn" },
  { href: "/shop", label: "Shop" },
  { href: "/dog", label: "My dog" },
  { href: "/ask", label: "Ask" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="nav-bar" aria-label="Primary">
      <div className="nav-grid nav-grid--five">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="nav-item"
              data-active={active ? "true" : "false"}
              aria-current={active ? "page" : undefined}
            >
              <span aria-hidden="true">{iconFor(item.label)}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function iconFor(label: (typeof items)[number]["label"]) {
  switch (label) {
    case "Today":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l2.5 1.5" />
        </svg>
      );
    case "Learn":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      );
    case "Shop":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 8h12l-1 11H7L6 8z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      );
    case "My dog":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 14c0 2.2 1.8 4 4 4s4-1.8 4-4" />
          <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
          <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
          <path d="M7 9c-1.5-2-1-4 1-4 .8 0 1.3.4 2 1.2C10.5 5.4 11.2 5 12 5s1.5.4 2 1.2c.7-.8 1.2-1.2 2-1.2 2 0 2.5 2 1 4" />
        </svg>
      );
    case "Ask":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <path d="M9.5 9.5a2.5 2.5 0 0 1 4.6 1.2c0 1.5-1.5 2-2.1 2.8" />
          <circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
