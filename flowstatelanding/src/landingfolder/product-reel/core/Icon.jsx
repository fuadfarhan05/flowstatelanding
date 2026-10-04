import React from "react";
import { MousePointer2, FileUp, FileCheck2 } from "lucide-react";

// FlowState's icon primitive, backed by lucide-react.
//
// Only the icons the ported ProductReel package actually uses are imported
// by name below — a wildcard `import * as LucideIcons` pulls the entire
// icon set into the bundle and defeats tree-shaking. Add new icons here by
// name as they're needed, rather than switching back to a namespace import.
//
// `filled` paints the enclosed shapes with currentColor — Lucide ships no
// filled variant, so this IS the filled variant, and it is the product's
// one selected-state signal.

const ICONS = {
  "mouse-pointer-2": MousePointer2,
  "file-up": FileUp,
  "file-check-2": FileCheck2,
};

export function Icon({ name, size = "1em", strokeWidth = 2, filled = false, label, style, ...rest }) {
  const LucideIcon = ICONS[name];
  if (!LucideIcon) return null;

  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      style={{
        display: "inline-flex",
        flexShrink: 0,
        width: typeof size === "number" ? size + "px" : size,
        height: typeof size === "number" ? size + "px" : size,
        lineHeight: 0,
        ...style,
      }}
      {...rest}
    >
      <LucideIcon
        width="100%"
        height="100%"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? Math.max(1.25, strokeWidth - 0.25) : strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </span>
  );
}
