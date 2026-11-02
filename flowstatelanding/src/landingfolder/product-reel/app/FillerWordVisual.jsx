import React from "react";

// Animated thumbnail for the Filler Word Focus drill. A short spoken
// line builds word by word; when the filler arrives it lands neutral,
// then gets caught — turning red with a highlight. Then the line fades
// and plays again with a different sentence.
const LINES = [
  { words: ["I", "led", "the", "um", "launch"], filler: 3 },
  { words: ["So", "like", "we", "shipped", "it"], filler: 1 },
  { words: ["It", "was", "uh", "my", "idea"], filler: 2 },
];

const WORD_MS = 300;      // gap between words
const CATCH_MS = 600;     // filler sits neutral this long before turning red
const HOLD_MS = 1700;     // whole line held after the last word
const FADE_MS = 600;
const EASE = "cubic-bezier(.22,1,.36,1)";

export function FillerWordVisual({ width = "100%", height = "100%", fontSize = 22, paused = false, style }) {
  const [line, setLine] = React.useState(0);
  const [shown, setShown] = React.useState(0);
  const [caught, setCaught] = React.useState(false);
  const [fading, setFading] = React.useState(false);

  const reduce = typeof window !== "undefined" && window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    if (reduce || paused) {
      setShown(LINES[line].words.length); setCaught(true); setFading(false);
      return;
    }
    const { words, filler } = LINES[line];
    const timers = [];
    setShown(0); setCaught(false); setFading(false);
    words.forEach((_, i) => timers.push(setTimeout(() => setShown(i + 1), 250 + i * WORD_MS)));
    const fillerAt = 250 + filler * WORD_MS;
    timers.push(setTimeout(() => setCaught(true), fillerAt + CATCH_MS));
    const end = 250 + (words.length - 1) * WORD_MS + Math.max(HOLD_MS, CATCH_MS + 900);
    timers.push(setTimeout(() => setFading(true), end));
    // Reset with the line change in one batched update, so the next line
    // never renders a frame with the old line's "fully shown, red" state.
    timers.push(setTimeout(() => {
      setShown(0); setCaught(false);
      setLine((l) => (l + 1) % LINES.length);
    }, end + FADE_MS));
    return () => timers.forEach(clearTimeout);
  }, [line, paused, reduce]);

  const { words, filler } = LINES[line];

  return (
    <span
      role="img"
      aria-label="A spoken sentence with the filler word highlighted in red"
      style={{
        position: "relative", flexShrink: 0, boxSizing: "border-box",
        width, height, padding: "18px 20px",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", fontFamily: "var(--font-core)",
        ...style,
      }}
    >
      <style>{
        "@keyframes fs-fwv-catch{0%{transform:scale(1)}45%{transform:scale(1.07)}100%{transform:scale(1)}}"
      }</style>

      {/* the line */}
      <span style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center", alignContent: "center", gap: "8px 7px", maxWidth: "100%",
        opacity: fading ? 0 : 1,
        transform: fading ? "translateY(-6px)" : "none",
        filter: fading ? "blur(3px)" : "none",
        transition: "opacity " + FADE_MS + "ms ease, transform " + FADE_MS + "ms " + EASE + ", filter " + FADE_MS + "ms ease",
      }}>
        {words.map((w, i) => {
          const isFiller = i === filler;
          const red = isFiller && caught;
          const on = i < shown;
          return (
            <span key={line + "-" + i} style={{
              display: "inline-block",
              opacity: on ? 1 : 0,
              transform: on ? "none" : "translateY(10px)",
              filter: on ? "blur(0)" : "blur(2px)",
              transition: "opacity .55s ease, transform .7s " + EASE + ", filter .55s ease",
            }}>
              <span style={{
                display: "inline-block",
                padding: isFiller ? "2px 8px" : 0,
                borderRadius: 8,
                fontSize, fontWeight: 700, lineHeight: 1.25, letterSpacing: "-.01em",
                color: red ? "#ff6b78" : isFiller ? "var(--text-muted)" : "var(--fs-ink-050)",
                background: red ? "rgba(255,77,94,.18)" : "transparent",
                boxShadow: red ? "inset 0 0 0 1.5px rgba(255,77,94,.65)" : "none",
                animation: red && !reduce && !paused ? "fs-fwv-catch .6s " + EASE : "none",
                transition: "color .4s ease, background-color .4s ease, box-shadow .4s ease",
              }}>{w}</span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
