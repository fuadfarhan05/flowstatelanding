import React from "react";
import { Icon } from "../core/Icon.jsx";

// Horizontal feature tile: glyph, title and one line of copy on the left,
// artwork on the right. Hairline border, flat fill — the pattern used for
// the "Speech Focused Drills" row. `placeholder` renders the product's
// dashed "more drills coming soon" slot instead.
export function FeatureCard({
  icon,
  title,
  description,
  image,
  imageAlt = "",
  visual,
  cta,
  layout = "row",
  artTone = "blue",
  placeholder = false,
  placeholderText = "More interview practices are being built",
  onClick,
  style,
}) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const interactive = Boolean(onClick) && !placeholder;
  const lit = interactive && (hover || focus);

  if (placeholder && layout === "tile") {
    return (
      <div style={{
        boxSizing: "border-box", width: "100%", height: "100%", minHeight: 340,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--sp-12)",
        padding: "var(--sp-24)", borderRadius: 20,
        border: "1px dashed rgba(255,255,255,.16)",
        fontFamily: "var(--font-core)", textAlign: "center",
        ...style,
      }}>
        <span style={{
          width: 48, height: 48, borderRadius: "var(--r-circle)", display: "grid", placeItems: "center",
          background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.4)",
        }}><Icon name="plus" size={22} /></span>
        <span style={{ fontSize: "var(--fs-14)", fontWeight: "var(--fw-semibold)", color: "var(--text-muted)" }}>More drills coming</span>
        <span style={{ fontSize: "var(--fs-13)", lineHeight: "var(--lh-body)", color: "var(--text-inactive)", maxWidth: 200 }}>{placeholderText}</span>
      </div>
    );
  }

  if (layout === "tile") {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          all: "unset", boxSizing: "border-box", width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          padding: 8, borderRadius: 20,
          cursor: interactive ? "pointer" : "default",
          fontFamily: "var(--font-core)", textAlign: "left",
          background: "linear-gradient(180deg, rgba(255,255,255,.06) 0%, rgba(255,255,255,.025) 100%)",
          border: "1px solid " + (lit ? "rgba(117,168,255,.55)" : "rgba(255,255,255,.10)"),
          boxShadow: lit
            ? "inset 0 1px 0 rgba(255,255,255,.10), 0 18px 40px rgba(0,0,0,.45), 0 0 0 4px rgba(77,130,255,.14)"
            : "inset 0 1px 0 rgba(255,255,255,.08), 0 12px 28px rgba(0,0,0,.35)",
          transition: "border-color var(--dur-fast) ease, box-shadow .25s ease",
          ...style,
        }}
      >
        {/* art */}
        <span style={{
          position: "relative", display: "block", height: 184, borderRadius: 14, overflow: "hidden",
          background: !visual ? "#0a0f26"
            : artTone === "purple"
              ? "radial-gradient(ellipse 80% 90% at 50% 100%, rgba(150,90,255,.34), transparent 70%), linear-gradient(180deg, #1c1340 0%, #110b2a 100%)"
              : "radial-gradient(ellipse 80% 90% at 50% 100%, rgba(77,130,255,.30), transparent 70%), linear-gradient(180deg, #0f1636 0%, #0a0f26 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.07), inset 0 -20px 40px rgba(0,0,0,.25)",
        }}>
          <span style={{
            position: "absolute", inset: 0, display: "flex",
            transform: lit ? "scale(1.035)" : "none",
            transition: "transform .5s var(--ease-rise)",
            ...(visual ? null : { background: "url(" + image + ") center / cover no-repeat" }),
          }} role={visual ? undefined : "img"} aria-label={visual ? undefined : imageAlt}>
            {visual}
          </span>
        </span>

        {/* body */}
        <span style={{ display: "flex", flexDirection: "column", gap: "var(--sp-6)", padding: "var(--sp-16) var(--sp-12) var(--sp-12)", flex: 1 }}>
          <span style={{ display: "flex", alignItems: "center", gap: "var(--sp-8)" }}>
            {icon && <span style={{ color: "var(--fs-blue-300)", display: "inline-flex" }}>{icon}</span>}
            <span style={{ fontSize: "var(--fs-18)", fontWeight: "var(--fw-bold)", color: "var(--text-body)", letterSpacing: "-.01em" }}>{title}</span>
          </span>
          {description && (
            <span style={{ fontSize: "var(--fs-14)", lineHeight: "var(--lh-body)", color: "var(--text-muted)", textWrap: "pretty" }}>{description}</span>
          )}
          {cta && interactive && (
            <span style={{
              marginTop: "auto", paddingTop: "var(--sp-14)", display: "flex",
            }}>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--sp-8)",
                width: "100%", padding: "12px 16px", borderRadius: "var(--r-12)",
                background: lit ? "var(--fs-blue-300)" : "var(--fs-blue-450)", color: "var(--fs-white)",
                fontSize: "var(--fs-15)", fontWeight: "var(--fw-bold)",
                transition: "background var(--dur-fast) ease",
              }}>
                {cta}
                <span style={{ display: "inline-flex", transform: lit ? "translateX(3px)" : "none", transition: "transform .25s var(--ease-rise)" }}>
                  <Icon name="arrow-right" size={16} strokeWidth={2.5} />
                </span>
              </span>
            </span>
          )}
        </span>
      </button>
    );
  }

  if (placeholder) {
    return (
      <div style={{
        boxSizing: "border-box",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "var(--sp-10)",
        width: "100%", minHeight: 168, padding: "var(--sp-20)",
        borderRadius: "var(--r-16)",
        border: "1px dashed rgba(255,255,255,.18)",
        background: "transparent",
        fontFamily: "var(--font-core)",
        ...style,
      }}>
        <Icon name="plus" size={24} style={{ color: "rgba(255,255,255,.35)" }} />
        <span style={{
          fontSize: "var(--fs-13)", lineHeight: "var(--lh-body)",
          color: "var(--text-inactive)", textAlign: "center", maxWidth: 200,
        }}>{placeholderText}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        all: "unset",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "stretch",
        gap: "var(--sp-16)",
        width: "100%",
        minHeight: 168,
        padding: "var(--sp-20)",
        borderRadius: "var(--r-16)",
        border: "1px solid " + (lit ? "var(--fs-blue-450)" : "rgba(255,255,255,.11)"),
        background: lit ? "rgba(77,130,255,.07)" : "rgba(255,255,255,.035)",
        boxShadow: lit
          ? "var(--sh-feature-card), 0 0 0 3px rgba(77,130,255,.18)"
          : "var(--sh-feature-card)",
        fontFamily: "var(--font-core)",
        cursor: interactive ? "pointer" : "default",
        overflow: "hidden",
        transition: "background var(--dur-fast) ease, border-color var(--dur-fast) ease, box-shadow var(--dur-fast) ease",
        textAlign: "left",
        ...style,
      }}
    >
      <div style={{ flex: "1 1 auto", minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--sp-10)" }}>
        {icon && (
          <span style={{ fontSize: "var(--fs-18)", color: "var(--fs-blue-300)", lineHeight: 1 }}>{icon}</span>
        )}
        <span style={{ fontSize: "var(--fs-16)", fontWeight: "var(--fw-bold)", color: "var(--text-body)" }}>{title}</span>
        {description && (
          <span style={{
            fontSize: "var(--fs-13)", fontWeight: "var(--fw-regular)",
            lineHeight: "var(--lh-body)", color: "var(--text-muted)", textWrap: "pretty",
          }}>{description}</span>
        )}
        {cta && interactive && (
          <span style={{
            marginTop: "auto", paddingTop: "var(--sp-6)",
            display: "inline-flex", alignItems: "center", gap: "var(--sp-8)",
            fontSize: "var(--fs-14)", fontWeight: "var(--fw-bold)",
            color: lit ? "var(--fs-white)" : "var(--fs-blue-300)",
            transition: "color var(--dur-fast) ease",
          }}>
            {cta}
            <span style={{
              display: "inline-grid", placeItems: "center", width: 24, height: 24, borderRadius: "var(--r-circle)",
              background: lit ? "var(--fs-blue-450)" : "rgba(77,130,255,.16)",
              color: "var(--fs-white)",
              transform: lit ? "translateX(3px)" : "none",
              transition: "background var(--dur-fast) ease, transform .25s var(--ease-rise)",
            }}>
              <Icon name="arrow-right" size={14} strokeWidth={2.5} />
            </span>
          </span>
        )}
      </div>

      {visual && <span style={{ alignSelf: "center", display: "flex" }}>{visual}</span>}

      {image && !visual && (
        <span
          role="img"
          aria-label={imageAlt}
          style={{
            flex: "0 0 120px", alignSelf: "center", height: 120,
            borderRadius: "var(--r-12)",
            background: "url(" + image + ") center / cover no-repeat",
          }}
        />
      )}
    </button>
  );
}
