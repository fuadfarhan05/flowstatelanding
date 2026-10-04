import React from "react";

// Position through a fixed sequence. Done steps are dim blue, the current
// step widens into a bar, upcoming steps are hairline grey. Flat — the
// shipped version glowed.
export function StepDots({ total = 0, current = 0, label, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sp-8)", fontFamily: "var(--font-core)", ...style }}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={label || "Progress"}
        style={{ display: "flex", alignItems: "center", gap: 6 }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const done = i < current;
          const now = i === current;
          return (
            <span key={i} style={{
              width: now ? 22 : 6, height: 6,
              borderRadius: now ? 3 : "var(--r-circle)",
              background: now ? "var(--fs-blue-450)" : done ? "rgba(77,130,255,.55)" : "rgba(255,255,255,.12)",
              transition: "width var(--dur-slow) var(--ease-rise), background var(--dur-slow) ease",
            }} />
          );
        })}
      </div>
      {label && (
        <span style={{ fontSize: "var(--fs-12)", fontWeight: "var(--fw-medium)", color: "var(--text-inactive)" }}>{label}</span>
      )}
    </div>
  );
}
