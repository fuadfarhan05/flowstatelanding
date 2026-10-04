import React from "react";

// Placeholder for content that is still loading. A slow shimmer across a
// flat 5% fill — the one exception to "nothing loops", and only while
// real data is in flight.
export function Skeleton({ width = "100%", height = 12, radius, circle = false, style }) {
  const r = circle ? "var(--r-circle)" : radius || "var(--r-8)";
  return (
    <span
      aria-hidden="true"
      style={{
        display: "block",
        flexShrink: 0,
        width: typeof width === "number" ? width + "px" : width,
        height: typeof height === "number" ? height + "px" : height,
        borderRadius: r,
        background: "linear-gradient(90deg, rgba(255,255,255,.05) 25%, rgba(255,255,255,.11) 37%, rgba(255,255,255,.05) 63%)",
        backgroundSize: "400% 100%",
        animation: "fs-shimmer 1.6s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

// Text-block convenience: n lines, last one short.
export function SkeletonText({ lines = 3, height = 12, gap = "var(--sp-10)", style }) {
  return (
    <span style={{ display: "flex", flexDirection: "column", gap, width: "100%", ...style }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={height} width={i === lines - 1 ? "68%" : i % 2 ? "88%" : "100%"} />
      ))}
    </span>
  );
}

// Mount once per page — Skeleton's shimmer needs these keyframes.
export function SkeletonStyles() {
  return <style>{"@keyframes fs-shimmer{0%{background-position:100% 0}100%{background-position:0 0}}@keyframes fs-reveal{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}"}</style>;
}

// Wraps real content so it fades in when it replaces a skeleton.
export function Reveal({ children, style }) {
  return (
    <div style={{ animation: "fs-reveal .35s cubic-bezier(.16,1,.3,1) both", ...style }}>
      {children}
    </div>
  );
}
