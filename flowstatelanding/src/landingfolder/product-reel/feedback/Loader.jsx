import React from "react";

// FlowState's only loading state: one line of status over a 2px hairline
// rule. Nothing spins, nothing pulses, nothing glows.
//
// Pass `value` (0–100) for real progress; omit it and the rule sweeps
// indeterminately. `steps`/`activeIndex` are accepted for older call
// sites — the active step becomes the status line.
export function Loader({ label, value, title = "Building your interview", steps, activeIndex = 0, style }) {
  const status = label || (Array.isArray(steps) ? steps[Math.min(activeIndex, steps.length - 1)] : undefined);
  const determinate = typeof value === "number";

  return (
    <div style={{ width: "100%", fontFamily: "var(--font-core)", ...style }}>
      <style>{"@keyframes fs-load-sweep{0%{left:-38%;width:38%}50%{width:54%}100%{left:100%;width:38%}}"}</style>

      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between",
        gap: "var(--sp-16)", marginBottom: "var(--sp-14)",
      }}>
        <span style={{ fontSize: "var(--fs-15)", fontWeight: "var(--fw-semibold)", color: "var(--text-body)" }}>
          {title}
        </span>
        {determinate && (
          <span style={{ flexShrink: 0, fontSize: "var(--fs-13)", fontWeight: "var(--fw-medium)", color: "var(--text-muted)" }}>
            {Math.round(value)}%
          </span>
        )}
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={determinate ? Math.round(value) : undefined}
        aria-label={status || title}
        style={{
          position: "relative", height: 2, borderRadius: 2,
          background: "rgba(255,255,255,.09)", overflow: "hidden",
        }}
      >
        <span style={{
          position: "absolute", top: 0, bottom: 0, borderRadius: 2,
          background: "var(--fs-blue-450)",
          ...(determinate
            ? { left: 0, width: Math.max(0, Math.min(100, value)) + "%", transition: "width .4s ease" }
            : { animation: "fs-load-sweep 1.6s cubic-bezier(.4,0,.2,1) infinite" }),
        }} />
      </div>

      {status && (
        <p style={{
          margin: "var(--sp-14) 0 0", fontSize: "var(--fs-13)",
          lineHeight: "var(--lh-body)", color: "var(--text-muted)",
        }}>{status}</p>
      )}
    </div>
  );
}
