import React from "react";
import { GradeBadge } from "../feedback/GradeBadge.jsx";
import { Surface } from "../core/Surface.jsx";

// One past session. Built on Surface so history rows match every other
// block in the product.
export function ArchiveCard({ score, summary, date, onClick, style }) {
  return (
    <Surface
      onClick={onClick}
      interactive={!onClick}
      padding="var(--sp-20)"
      style={{ display: "flex", alignItems: "center", gap: "var(--sp-20)", ...style }}
    >
      <GradeBadge score={score} size={56} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {summary && (
          <p style={{
            margin: 0, fontSize: "var(--fs-14)", color: "var(--text-muted)",
            lineHeight: "var(--lh-loose)", overflow: "hidden",
            display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
          }}>{summary}</p>
        )}
      </div>
      {date && (
        <span style={{
          flexShrink: 0, alignSelf: "flex-start",
          fontSize: "var(--fs-13)", fontWeight: "var(--fw-medium)",
          color: "var(--text-inactive)", whiteSpace: "nowrap",
        }}>{date}</span>
      )}
    </Surface>
  );
}
