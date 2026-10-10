"use client";

import { useState } from "react";

/** Compact list-row action matching the mockup “Add” control. */
export function ShopAddButton() {
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className="btn btn-primary shrink-0 px-4 min-h-10 rounded-xl text-sm"
      aria-pressed={added}
      onClick={() => setAdded(true)}
    >
      {added ? "Saved" : "Add"}
    </button>
  );
}
