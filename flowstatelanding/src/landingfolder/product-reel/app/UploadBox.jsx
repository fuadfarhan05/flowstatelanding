import React from "react";
import { Icon } from "../core/Icon.jsx";

// Resume drop zone. Dashed hairline when empty, solid blue border when
// filled. Flat — no glow, no inner shadow.
//
// `pulse`: the box's border/ring pulses blue to flag that it's clickable —
// only pass this on an interactive prompt (never the passive demo scene).
export function UploadBox({ filename, hint = "Click to upload your resume", icon, error, onClick, pulse = false, style }) {
  const [hover, setHover] = React.useState(false);
  const filled = Boolean(filename);

  return (
    <div style={{ fontFamily: "var(--font-core)", ...style }}>
      {pulse && !filled && (
        <style>{
          "@keyframes fs-upload-pulse{" +
          "0%{box-shadow:0 0 0 0 rgba(77,130,255,.55)}" +
          "70%{box-shadow:0 0 0 10px rgba(77,130,255,0)}" +
          "100%{box-shadow:0 0 0 0 rgba(77,130,255,0)}" +
          "}"
        }</style>
      )}
      <div
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          padding: "var(--sp-28) var(--sp-20)",
          borderRadius: "var(--r-16)",
          textAlign: "center",
          cursor: "pointer",
          background: filled ? "rgba(77,130,255,.08)" : hover ? "rgba(255,255,255,.055)" : "rgba(255,255,255,.03)",
          border: filled
            ? "1px solid var(--fs-blue-450)"
            : pulse
            ? "1px solid var(--fs-blue-450)"
            : "1px dashed " + (hover ? "rgba(255,255,255,.28)" : "rgba(255,255,255,.18)"),
          animation: pulse && !filled ? "fs-upload-pulse 1.8s ease-in-out infinite" : "none",
          transition: "background var(--dur-fast) ease, border-color var(--dur-fast) ease",
        }}
      >
        <span style={{
          display: "inline-block", marginBottom: "var(--sp-10)",
          color: filled ? "var(--fs-blue-300)" : "var(--text-inactive)",
          transition: "color var(--dur-base) ease",
        }}>
          {icon || <Icon name={filled ? "file-check-2" : "file-up"} size={28} />}
        </span>

        {filled ? (
          <>
            <p style={{
              margin: "0 auto", fontSize: "var(--fs-14)", fontWeight: "var(--fw-semibold)",
              color: "var(--fs-ink-050)", whiteSpace: "nowrap", overflow: "hidden",
              textOverflow: "ellipsis", maxWidth: "min(320px,100%)",
            }}>{filename}</p>
            <p style={{ margin: "6px 0 0", fontSize: "var(--fs-13)", color: "var(--text-muted)" }}>Ready to go</p>
          </>
        ) : (
          <p style={{ margin: 0, fontSize: "var(--fs-14)", color: "var(--text-muted)" }}>{hint}</p>
        )}
      </div>

      {error && (
        <p style={{ margin: "10px 0 0", fontSize: "var(--fs-13)", lineHeight: "var(--lh-body)", color: "var(--fs-danger-soft)" }}>{error}</p>
      )}
    </div>
  );
}
