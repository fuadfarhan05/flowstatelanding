import React from "react";

// The one inner card. Flat navy fill, hairline border, 16px radius. Every
// grouped block inside a ContentCard is one of these — there is no second
// inner-card recipe in the product.
export function Surface({ children, padding = "var(--sp-20)", interactive = false, onClick, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const live = interactive || Boolean(onClick);
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...(onClick ? { all: "unset", cursor: "pointer", display: "block", textAlign: "left" } : null),
        boxSizing: "border-box",
        width: "100%",
        padding,
        borderRadius: "var(--r-16)",
        border: "1px solid " + (live && hover ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.09)"),
        background: live && hover ? "rgba(255,255,255,.055)" : "rgba(255,255,255,.03)",
        boxShadow: "var(--sh-feature-card)",
        fontFamily: "var(--font-core)",
        color: "var(--text-body)",
        transition: "background var(--dur-fast) ease, border-color var(--dur-fast) ease",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
