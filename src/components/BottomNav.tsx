"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/today", label: "Today", prominent: true },
  { href: "/learn", label: "Learn", prominent: false },
  { href: "/dog", label: "My dog", prominent: false },
  { href: "/ask", label: "Ask", prominent: false },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="nav-bar" aria-label="Primary">
      <div className="nav-grid">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="nav-item"
              data-active={active && !item.prominent ? "true" : "false"}
              data-prominent={item.prominent ? "true" : "false"}
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

function iconFor(label: string) {
  switch (label) {
    case "Today":
      return "◎";
    case "Learn":
      return "☰";
    case "My dog":
      return "◌";
    case "Ask":
      return "?";
    default:
      return "•";
  }
}
