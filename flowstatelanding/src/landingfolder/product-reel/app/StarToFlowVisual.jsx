import React from "react";

// Animated thumbnail for the S.T.A.R. Stories drill. The word STAR (white)
// rolls letter by letter into FLOW (blue), holds, rolls back, and loops.
// Each letter sits in its own clipped slot so the roll reads like a
// split-flap board: the old letter lifts away, the new one rises in.
const FROM = ["S", "T", "A", "R"];
const TO = ["F", "L", "O", "W"];

const HOLD_STAR = 1500;
const HOLD_FLOW = 2000;
const STAGGER = 90;
const ROLL = 700;
const EASE = "cubic-bezier(.22,1,.36,1)";

export function StarToFlowVisual({ width = "100%", height = "100%", fontSize = 22, paused = false, style }) {
  const [flow, setFlow] = React.useState(false);

  const reduce = typeof window !== "undefined" && window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    if (reduce || paused) { setFlow(true); return; }
    const rollTime = ROLL + STAGGER * (FROM.length - 1);
    const id = setTimeout(() => setFlow((f) => !f), (flow ? HOLD_FLOW : HOLD_STAR) + rollTime);
    return () => clearTimeout(id);
  }, [flow, paused, reduce]);

  const letter = (ch, visible, color, from) => ({
    gridArea: "1 / 1",
    justifySelf: "center",
    color,
    opacity: visible ? 1 : 0,
    filter: visible ? "blur(0)" : "blur(4px)",
    transform: visible ? "translateY(0)" : "translateY(" + from + ")",
  });

  return (
    <span
      role="img"
      aria-label="The word STAR turning into FLOW"
      style={{
        position: "relative", flexShrink: 0, boxSizing: "border-box",
        width, height, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-core)", overflow: "hidden",
        ...style,
      }}
    >
      {/* Glow lives on the unclipped row so the letter slots can't box it in. */}
      <span style={{
        display: "flex", gap: 1,
        filter: flow ? "drop-shadow(0 0 16px rgba(77,130,255,.45))" : "drop-shadow(0 0 0 rgba(77,130,255,0))",
        transition: "filter " + (ROLL + STAGGER * 3) + "ms ease",
      }}>
        {FROM.map((s, i) => {
          const f = TO[i];
          const delay = i * STAGGER + "ms";
          const t = (p) => p + " " + ROLL + "ms " + EASE + " " + delay;
          return (
            <span key={i} style={{
              display: "grid", overflow: "hidden",
              padding: "0.08em 0.02em",
              fontSize, fontWeight: 800, lineHeight: 1, letterSpacing: "-.02em",
            }}>
              <span style={{
                ...letter(s, !flow, "var(--fs-ink-050)", "-110%"),
                transition: [t("transform"), t("opacity"), t("filter")].join(", "),
              }}>{s}</span>
              <span style={{
                ...letter(f, flow, "var(--fs-blue-450)", "110%"),
                transition: [t("transform"), t("opacity"), t("filter")].join(", "),
              }}>{f}</span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
