import React from "react";

// Small attribute label. Not interactive — for clickable pills use a
// Button or the chips on HeroCard.
export function Tag({ children, selected = false, style }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 10px",
      borderRadius: "var(--r-8)",
      fontFamily: "var(--font-core)",
      fontSize: "var(--fs-12)",
      fontWeight: "var(--fw-semibold)",
      whiteSpace: "nowrap",
      border: "1px solid " + (selected ? "rgba(117,168,255,.45)" : "rgba(255,255,255,.12)"),
      background: selected ? "rgba(117,168,255,.14)" : "rgba(255,255,255,.05)",
      color: selected ? "var(--fs-blue-150)" : "var(--text-muted)",
      ...style,
    }}>{children}</span>
  );
}
