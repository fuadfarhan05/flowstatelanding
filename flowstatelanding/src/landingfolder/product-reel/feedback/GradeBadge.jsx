import React from "react";

// The product's thresholds: <65 red, <75 yellow, <90 green, 90+ blue.
// Private by design — see Gauge.jsx for why the mapping cannot be
// published as a helper.
function gradeTone(score) {
  if (score == null) return "blue";
  if (score < 65) return "red";
  if (score < 75) return "yellow";
  if (score < 90) return "green";
  return "blue";
}

const INK = {
  red: "rgb(255,210,210)",
  yellow: "rgb(255,245,190)",
  green: "rgb(210,255,235)",
  blue: "rgb(210,230,255)",
};
const RIM = {
  red: "rgba(255,160,160,.4)",
  yellow: "rgba(255,230,120,.4)",
  green: "rgba(180,240,210,.4)",
  blue: "rgba(200,220,255,.4)",
};
const BEVEL = {
  red: "rgba(255,200,200,.3)",
  yellow: "rgba(255,240,160,.3)",
  green: "rgba(210,255,230,.3)",
  blue: "rgba(220,235,255,.3)",
};

export function GradeBadge({ score, size = 64, tone, style }) {
  const t = tone || gradeTone(score);
  const rgb = "var(--fs-grade-" + t + ")";
  return (
    <div
      style={{
        flexShrink: 0,
        width: size,
        height: size,
        borderRadius: "var(--r-circle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-core)",
        fontSize: Math.round(size * 0.34),
        fontWeight: "var(--fw-extrabold)",
        color: INK[t],
        background: "linear-gradient(135deg, rgba(" + rgb + ",.45), rgba(" + rgb + ",.2))",
        border: "1px solid " + RIM[t],
        boxShadow: "0 0 18px rgba(" + rgb + ",.35), inset 0 1px 0 " + BEVEL[t],
        ...style,
      }}
    >
      {score ?? "—"}
    </div>
  );
}
