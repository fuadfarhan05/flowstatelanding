import React from "react";
import { Icon } from "../core/Icon.jsx";
import { Surface } from "../core/Surface.jsx";
import { Tag } from "../core/Tag.jsx";
import { Skeleton, SkeletonStyles } from "../core/Skeleton.jsx";
import { UploadBox } from "../app/UploadBox.jsx";
import { ArchiveCard } from "../app/ArchiveCard.jsx";
import { Loader } from "../feedback/Loader.jsx";
import { GradeBadge } from "../feedback/GradeBadge.jsx";
import { StepDots } from "../feedback/StepDots.jsx";

// ── Product reel ──────────────────────────────────────────────────
// One continuous motion through the real product, built from the real
// components: upload a resume → answer a question → get a grade → see it
// land in your history. Replaces the four static screenshots.
const REEL = [
  { at: 0, title: "Upload once", caption: "Drop in your resume. Your interview is built from it." },
  { at: 3400, title: "Answer out loud", caption: "Questions are read to you, and you answer like it's the real thing." },
  { at: 8800, title: "Get a real grade", caption: "Every session scores your speech — not how you feel it went." },
  { at: 11800, title: "Watch it climb", caption: "Every grade is saved, so you can see yourself getting better." },
];
const REEL_END = 15400;

const REEL_Q = "Tell me about the payments migration on your resume.".split(" ");
// Same two-words-then-one cadence as InterviewScreen (PATTERN 2/1 with
// 1100/700ms pauses), played at 2x so it fits the reel's interview beat.
const REEL_Q_START = 3700;
const REEL_Q_AT = (() => {
  const pattern = [{ count: 2, pause: 550 }, { count: 1, pause: 350 }];
  const at = [];
  let t = REEL_Q_START, p = 0;
  while (at.length < REEL_Q.length) {
    const { count, pause } = pattern[p % 2];
    for (let k = 0; k < count && at.length < REEL_Q.length; k += 1) at.push(t);
    t += pause; p += 1;
  }
  return at;
})();
const REEL_Q_DONE = REEL_Q_AT[REEL_Q_AT.length - 1] + 520;
const REEL_A = "So last quarter our payments service kept failing audits, and I owned the fix".split(" ");
const REEL_HISTORY = [
  { score: 78, date: "Today", summary: "Clear on the situation and action. Lead with the result next time." },
  { score: 71, date: "Mar 1", summary: "You knew the content but buried the result at the end." },
  { score: 58, date: "Feb 22", summary: "The follow-ups on the internship bullet caught you out." },
];

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const easeOut = (x) => 1 - Math.pow(1 - clamp01(x), 3);
const easeInOut = (x) => { const k = clamp01(x); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };

// Single clock for the whole reel, so every phase is timed off one value.
function useClock(end, onDone) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf;
    let done = false;
    const t0 = performance.now();
    const loop = (now) => {
      const e = now - t0;
      setT(Math.min(e, end));
      if (e >= end) { if (!done) { done = true; onDone && onDone(); } return; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // Intentional: one clock per mount. Replay by remounting (change `key`),
    // not by reacting to `end`/`onDone` changing within the same mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return t;
}

// Crossfading layer for one phase.
function Scene({ show, interactive = false, children }) {
  return (
    <div style={{
      position: "absolute", inset: 0, padding: "var(--sp-28)",
      display: "flex", flexDirection: "column", justifyContent: "center",
      opacity: show ? 1 : 0,
      transform: show ? "none" : "translateY(10px) scale(.985)",
      transition: "opacity .5s ease, transform .6s var(--ease-rise)",
      // Demo scenes never take input; only the closing upload prompt does.
      pointerEvents: show && interactive ? "auto" : "none",
    }}>{children}</div>
  );
}

// `uploadPrompt`: after the last phase, cross-fade to an empty upload
// box inviting the user to start — styled exactly like the reel's
// opening scene. `onUpload` fires when it's clicked (optional).
export function ProductReel({ onDone, uploadPrompt = false, onUpload }) {
  const t = useClock(REEL_END, onDone);
  const final = uploadPrompt && t >= REEL_END;
  const phase = REEL.reduce((p, r, i) => (t >= r.at ? i : p), 0);

  // A cursor glides in, presses the upload box, and the file lands — so
  // the empty box reads as something being done FOR you, not a button
  // you're meant to click.
  const CUR_IN = 150, CUR_ARRIVE = 950, CUR_PRESS = 1050, CUR_UP = 1220, CUR_OUT = 1900;
  const travel = easeInOut((t - CUR_IN) / (CUR_ARRIVE - CUR_IN));
  const cursorX = 92 + (50 - 92) * travel;           // % of the box width
  const cursorY = 190 + (74 - 190) * travel;         // px from the box top
  const pressing = t >= CUR_PRESS && t < CUR_UP;
  const cursorOpacity = t < CUR_IN ? 0 : t < CUR_IN + 200 ? (t - CUR_IN) / 200 : t > CUR_OUT ? Math.max(0, 1 - (t - CUR_OUT) / 300) : 1;
  const ripple = clamp01((t - CUR_PRESS) / 520);
  const filled = t > CUR_UP;
  const parse = clamp01((t - 1800) / 1450) * 100;

  const qShown = REEL_Q_AT.filter((at) => t >= at).length;
  const listening = t > REEL_Q_DONE + 100;
  const aStart = REEL_Q_DONE + 250;
  const aShown = Math.max(0, Math.min(REEL_A.length, Math.floor((t - aStart) / 150)));

  const gradeIn = t > 9500;
  const score = Math.round(52 + (78 - 52) * easeOut((t - 9500) / 1300));

  const rowIn = (i) => t > 12200 + i * 220;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-18)" }}>
      <SkeletonStyles />
      <style>{
        "@keyframes fs-word-in{from{opacity:0;transform:translateY(7px);filter:blur(4px)}to{opacity:1;transform:none;filter:blur(0)}}" +
        "@keyframes fs-bar{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}"
      }</style>

      <Surface padding="0" style={{ position: "relative", height: 340, overflow: "hidden", background: "var(--fs-black-raised)" }}>
        <Scene show={phase === 0}>
          <div style={{ maxWidth: 420, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--sp-16)" }}>
            <div style={{ position: "relative" }}>
              <div style={{
                transform: pressing ? "scale(.985)" : "none",
                transition: "transform .16s var(--ease-rise)",
              }}>
                <UploadBox filename={filled ? "fuad-farhan-resume.pdf" : undefined} />
              </div>

              {/* press ripple */}
              {t >= CUR_PRESS && ripple < 1 && (
                <span aria-hidden="true" style={{
                  position: "absolute", left: "50%", top: 74,
                  width: 120, height: 120, marginLeft: -60, marginTop: -60,
                  borderRadius: "var(--r-circle)",
                  border: "2px solid rgba(117,168,255,.55)",
                  transform: "scale(" + (0.2 + ripple * 0.9) + ")",
                  opacity: 1 - ripple,
                  pointerEvents: "none",
                }} />
              )}

              {/* cursor */}
              <span aria-hidden="true" style={{
                position: "absolute", left: cursorX + "%", top: cursorY,
                zIndex: 3, pointerEvents: "none",
                opacity: cursorOpacity,
                transform: "translate(-4px, -3px) scale(" + (pressing ? 0.86 : 1) + ")",
                transformOrigin: "4px 3px",
                transition: "transform .14s var(--ease-rise)",
                color: "var(--fs-white)",
                filter: "drop-shadow(0 3px 6px rgba(0,0,0,.55))",
              }}>
                <Icon name="mouse-pointer-2" size={26} filled strokeWidth={1.5} />
              </span>
            </div>
            <div style={{ opacity: t > 1650 ? 1 : 0, transition: "opacity .4s ease" }}>
              <Loader title="Reading your resume" label={parse >= 100 ? "Found 3 experiences" : "Pulling out your experiences"} value={parse} />
            </div>
          </div>
        </Scene>

        <Scene show={phase === 1}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sp-16)", textAlign: "center" }}>
            <span style={{ fontSize: "var(--fs-12)", fontWeight: "var(--fw-bold)", letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", color: "var(--fs-blue-450)" }}>
              Experience 1 of 3
            </span>
            <p style={{ margin: 0, maxWidth: 440, minHeight: "2.7em", fontSize: "var(--fs-22)", fontWeight: "var(--fw-bold)", lineHeight: 1.35, letterSpacing: "var(--ls-tight)", color: "var(--fs-ink-050)" }}>
              {REEL_Q.slice(0, qShown).map((w, i) => (
                <span key={i} style={{
                  display: "inline-block", marginRight: ".28em",
                  animation: "fs-word-in .52s var(--ease-rise) both",
                  // Stagger inside a chunk so a pair settles in sequence.
                  animationDelay: (i % 2) * 0.07 + "s",
                }}>{w}</span>
              ))}
            </p>
            <StepDots total={11} current={1} />
            <div style={{
              width: "100%", maxWidth: 460, marginTop: "var(--sp-4)", padding: "var(--sp-14) var(--sp-16)",
              borderRadius: "var(--r-12)", border: "1px solid rgba(255,255,255,.09)", background: "rgba(255,255,255,.03)",
              display: "flex", alignItems: "center", gap: "var(--sp-14)", textAlign: "left",
            }}>
              <span aria-hidden="true" style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 18, flexShrink: 0 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} style={{
                    width: 3, height: 18, borderRadius: 2, transformOrigin: "bottom",
                    background: listening ? "var(--fs-blue-450)" : "rgba(255,255,255,.14)",
                    animation: listening ? "fs-bar " + (0.8 + (i % 3) * 0.22) + "s ease-in-out infinite" : "none",
                    animationDelay: i * 0.07 + "s",
                    transform: listening ? undefined : "scaleY(.3)",
                  }} />
                ))}
              </span>
              <span style={{ flex: 1, minHeight: "2.9em", fontSize: "var(--fs-14)", lineHeight: 1.45, color: aShown ? "var(--text-body)" : "var(--text-inactive)" }}>
                {aShown ? REEL_A.slice(0, aShown).join(" ") : "Listening…"}
              </span>
            </div>
          </div>
        </Scene>

        <Scene show={phase === 2}>
          <div style={{ maxWidth: 440, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--sp-14)" }}>
            <Surface padding="var(--sp-20)" style={{ display: "flex", alignItems: "center", gap: "var(--sp-18)" }}>
              {gradeIn ? (
                <>
                  <GradeBadge score={score} size={72} />
                  <div style={{ animation: "fs-word-in .5s var(--ease-rise) both" }}>
                    <div style={{ fontSize: "var(--fs-18)", fontWeight: "var(--fw-semibold)", color: "var(--text-body)" }}>Your speech score</div>
                    <div style={{ marginTop: 4, fontSize: "var(--fs-13)", color: "var(--text-muted)" }}>Up 7 points from last time</div>
                  </div>
                </>
              ) : (
                <>
                  <Skeleton circle width={72} height={72} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    <Skeleton height={16} width={160} />
                    <Skeleton height={12} width={200} />
                  </div>
                </>
              )}
            </Surface>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", opacity: t > 10500 ? 1 : 0, transition: "opacity .45s ease" }}>
              <Tag>Clear situation</Tag><Tag>Strong action</Tag><Tag>Result missing</Tag>
            </div>
          </div>
        </Scene>

        <Scene show={phase === 3 && !final}>
          <div style={{ maxWidth: 520, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--sp-10)" }}>
            {REEL_HISTORY.map((h, i) => (
              <div key={h.date} style={{
                opacity: rowIn(i) ? 1 : 0,
                transform: rowIn(i) ? "none" : "translateY(12px)",
                transition: "opacity .45s ease, transform .55s var(--ease-rise)",
              }}>
                <ArchiveCard
                  {...h}
                  style={i === 0 ? { borderColor: "var(--fs-blue-450)", background: "rgba(77,130,255,.07)" } : undefined}
                />
              </div>
            ))}
          </div>
        </Scene>
        {uploadPrompt && (
          <Scene show={final} interactive>
            <div style={{ maxWidth: 420, width: "100%", margin: "0 auto" }}>
              <UploadBox hint="Upload your resume" pulse onClick={() => onUpload && onUpload()} />
            </div>
          </Scene>
        )}
      </Surface>
    </div>
  );
}
