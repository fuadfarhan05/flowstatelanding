import { useEffect, useRef, useState } from "react";
import "./Stickers.css";
import logo from "../images/flowstatelogo.png";
import convictionWithin from "../images/stickers/conviction-within.png";
import waveLogo from "../images/stickers/wave-logo.png";
import wordmarkBars from "../images/stickers/wordmark-bars.png";
import vslVideo from "../images/FlowStateVSLweb.mp4";

// Apps Script web app URL. Set in Vercel and in .env.local for local testing.
// See google-apps-script/sticker-claims.gs for setup.
const SHEET_ENDPOINT = process.env.REACT_APP_STICKER_SHEET_URL;

// A fixed URL, so testing on localhost still copies the real link.
const SHARE_HOST = "https://enteryourflowstate.app/";
const SHARE_PATH = "stickers";
const SHARE_URL = `${SHARE_HOST}${SHARE_PATH}`;
const SHARE_MESSAGE =
  "I just claimed free FlowState stickers for Black Friday! There are only 20 of each design, so grab yours before they're gone:";
const SHARE_TEXT = `${SHARE_MESSAGE} ${SHARE_URL}`;

const SIGNUP_URL = "https://www.withflowstate.app/signuppage";
const HOME_URL = "https://www.withflowstate.app";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SPIN_SPEED = 16; // degrees per second
const STOCK_REFRESH_MS = 30000;

// `lid` is the sticker's position on the 320×210 laptop lid.
const STICKERS = [
  {
    id: "conviction",
    name: "Conviction Within",
    desc: "Take the self-belief within you into every interview.",
    src: convictionWithin,
    lid: { x: 46, y: 46, size: 44, r: -9 },
  },
  {
    id: "wave",
    name: "Original Wave Logo",
    desc: "The original FlowState wave mark.",
    src: waveLogo,
    lid: { x: 213, y: 57, size: 37, r: 8 },
  },
  {
    id: "wordmark",
    name: "Text & Speech Bars",
    desc: "FlowState wordmark with speech bars, in blue.",
    src: wordmarkBars,
    lid: { x: 137, y: 131, size: 40, r: -3 },
  },
];

function validate({ first, email, friend, picked, shared }, step) {
  const errors = {};
  const ownEmail = email.trim();
  const friendEmail = friend.trim();

  if (!first.trim()) errors.first = "Add your first name.";
  if (!ownEmail) errors.email = "Add your email.";
  else if (!EMAIL_RE.test(ownEmail)) {
    errors.email = "That email doesn't look right — check for typos.";
  }
  if (!Object.values(picked).some(Boolean)) {
    errors.stickers = "Pick at least one sticker.";
  }
  if (step !== 2) return errors;

  if (!friendEmail) {
    if (!shared) errors.friend = "Add a friend's email, or copy your link to share.";
  } else if (!EMAIL_RE.test(friendEmail)) {
    errors.friend = "That email doesn't look right — check for typos.";
  } else if (friendEmail.toLowerCase() === ownEmail.toLowerCase()) {
    errors.friend = "Use a friend's email, not your own.";
  }
  return errors;
}

async function submitClaim(claim) {
  if (!SHEET_ENDPOINT) throw new Error("REACT_APP_STICKER_SHEET_URL is not set");

  // text/plain avoids a CORS preflight, which Apps Script can't answer.
  const response = await fetch(SHEET_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(claim),
  });
  const result = await response.json();
  if (!result.ok) {
    const error = new Error(result.error || result.code || "Claim was not saved");
    error.code = result.code;
    error.remaining = result.remaining;
    throw error;
  }
}

async function fetchRemaining() {
  if (!SHEET_ENDPOINT) return null;
  const response = await fetch(SHEET_ENDPOINT);
  const result = await response.json();
  return result.remaining || null;
}

const isSoldOut = (remaining, sticker) => remaining?.[sticker.name] === 0;

// Until the first count arrives, or if it can't be loaded, no number is shown.
// The script still enforces the limit when the claim is submitted.
function stockLabel(remaining, sticker) {
  const count = remaining?.[sticker.name];
  if (count == null) return "LIMITED";
  return count === 0 ? "SOLD OUT" : `${count} AVAILABLE`;
}

function Laptop({ motion, picked }) {
  const rigRef = useRef(null);
  const noneOnLid = !STICKERS.some((sticker) => picked[sticker.id]);

  useEffect(() => {
    const m = motion.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let last = performance.now();
    let raf;

    const tick = (now) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;

      if (!m.dragging) {
        if (m.seek != null) {
          const distance = m.seek - m.angle;
          m.angle += distance * Math.min(1, dt * 5);
          if (Math.abs(distance) < 0.3) {
            m.angle = m.seek;
            m.seek = null;
            m.holdUntil = now + 2200;
          }
        } else if (!reduceMotion && now > m.holdUntil) {
          m.angle += SPIN_SPEED * dt;
        }
      }

      const rig = rigRef.current;
      if (rig) {
        const scale = Math.min(1, (rig.parentElement?.offsetWidth || 500) / 520);
        rig.style.transform = `scale(${scale}) rotateX(-16deg) rotateY(${m.angle}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e) => {
      if (!m.dragging) return;
      m.angle += (e.clientX - m.lastX) * 0.6;
      m.lastX = e.clientX;
    };
    const onUp = () => {
      if (!m.dragging) return;
      m.dragging = false;
      m.holdUntil = performance.now() + 1800;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [motion]);

  const startDrag = (e) => {
    const m = motion.current;
    m.dragging = true;
    m.seek = null;
    m.lastX = e.clientX;
  };

  return (
    <div className="stk-stage" onPointerDown={startDrag}>
      <div className="stk-floor-glow" />
      <div ref={rigRef} className="stk-rig">
        <div className="stk-base-top">
          <div className="stk-keyboard" />
          <div className="stk-trackpad" />
        </div>
        <div className="stk-base-bottom" />
        <div className="stk-wall stk-wall--front" />
        <div className="stk-wall stk-wall--back" />
        <div className="stk-wall stk-wall--left" />
        <div className="stk-wall stk-wall--right" />

        <div className="stk-lid">
          <div className="stk-lid-front">
            <div className="stk-screen">
              <span className="stk-screen-brand">
                FlowState
                <img src={logo} alt="" />
              </span>
              <span className="stk-screen-tag">ENTER YOUR FLOW</span>
            </div>
          </div>
          <div className="stk-lid-back">
            {noneOnLid && (
              <span className="stk-lid-empty">Your stickers go here</span>
            )}
            {STICKERS.map((sticker) => {
              const on = !!picked[sticker.id];
              const { x, y, size, r } = sticker.lid;
              return (
                <div
                  key={sticker.id}
                  className="stk-lid-sticker"
                  style={{
                    left: x,
                    top: y,
                    width: size,
                    height: size,
                    opacity: on ? 1 : 0,
                    transform: `rotate(${r}deg) scale(${on ? 1 : 0.4})`,
                  }}
                >
                  <img src={sticker.src} alt="" />
                </div>
              );
            })}
          </div>
          <div className="stk-lid-edge stk-lid-edge--top" />
          <div className="stk-lid-edge stk-lid-edge--left" />
          <div className="stk-lid-edge stk-lid-edge--right" />
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ index, picked, remaining, onToggle, onMove, onClose }) {
  const closeRef = useRef(null);
  const sticker = STICKERS[index];
  const on = !!picked[sticker.id];
  const soldOut = isSoldOut(remaining, sticker);

  useEffect(() => {
    const previousFocus = document.activeElement;
    closeRef.current?.focus();
    return () => previousFocus?.focus?.();
  }, []);

  return (
    <div className="stk-scrim" onClick={onClose}>
      <div
        className="stk-modal"
        role="dialog"
        aria-modal="true"
        aria-label={sticker.name}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="stk-modal-top">
          <span className="stk-modal-position">
            STICKER {index + 1} OF {STICKERS.length}
          </span>
          <button
            ref={closeRef}
            type="button"
            className="stk-icon-btn stk-icon-btn--close"
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <span className="stk-modal-image">
          <img src={sticker.src} alt={`${sticker.name} sticker`} />
        </span>
        <div className="stk-modal-copy">
          <span className="stk-modal-name">{sticker.name}</span>
          <span className="stk-modal-desc">{sticker.desc}</span>
        </div>
        <div className="stk-modal-actions">
          <button
            type="button"
            className="stk-icon-btn"
            aria-label="Previous sticker"
            onClick={() => onMove(-1)}
          >
            ←
          </button>
          <button
            type="button"
            className={`stk-modal-toggle${on ? " is-on" : ""}`}
            disabled={soldOut}
            onClick={() => onToggle(sticker)}
          >
            {soldOut
              ? "Sold out"
              : on
                ? "✓ Selected — tap to remove"
                : "Add this sticker"}
          </button>
          <button
            type="button"
            className="stk-icon-btn"
            aria-label="Next sticker"
            onClick={() => onMove(1)}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

const EMPTY_FORM = { first: "", email: "", friend: "", picked: {}, shared: false };

function Stickers() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [tried, setTried] = useState(false);
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [remaining, setRemaining] = useState(null);
  const [copyStatus, setCopyStatus] = useState("");

  const cardRef = useRef(null);
  const shareTextRef = useRef(null);
  const revealErrorRef = useRef(false);
  const motion = useRef({
    angle: 200,
    seek: null,
    holdUntil: 0,
    dragging: false,
    lastX: 0,
  });

  const pickedCount = STICKERS.filter((s) => form.picked[s.id]).length;
  const allSoldOut = STICKERS.every((s) => isSoldOut(remaining, s));
  const claimed = step === 3;

  // Keeps the counts current while someone is deciding. This is for display:
  // the script makes the final call when the claim is submitted.
  useEffect(() => {
    if (claimed) return undefined;

    let active = true;
    const refresh = async () => {
      if (document.hidden) return;
      try {
        const counts = await fetchRemaining();
        if (active && counts) setRemaining(counts);
      } catch (error) {
        console.warn("Could not refresh sticker counts:", error);
      }
    };

    refresh();
    const timer = setInterval(refresh, STOCK_REFRESH_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      active = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [claimed]);

  // Removes a picked sticker that has since sold out. Step 2 waits, because the
  // sticker picker and its error message are only on step 1.
  useEffect(() => {
    if (step !== 1) return;
    const gone = STICKERS.filter(
      (s) => form.picked[s.id] && isSoldOut(remaining, s)
    );
    if (!gone.length) return;

    setForm((current) => {
      const picked = { ...current.picked };
      gone.forEach((s) => {
        picked[s.id] = false;
      });
      return { ...current, picked };
    });
    const names = gone.map((s) => s.name).join(" and ");
    setErrors((current) => ({
      ...current,
      stickers: `${names} just sold out. Pick another design to continue.`,
    }));
  }, [remaining, step, form.picked]);

  // On a phone the field with the problem can be a full screen above the button.
  useEffect(() => {
    if (!revealErrorRef.current || !Object.keys(errors).length) return;
    revealErrorRef.current = false;
    requestAnimationFrame(() => {
      cardRef.current
        ?.querySelector(".stk-error")
        ?.scrollIntoView({ block: "center" });
    });
  }, [errors]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Free FlowState Stickers";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const previewOpen = preview != null;
  useEffect(() => {
    if (!previewOpen) return undefined;
    const n = STICKERS.length;
    const onKey = (e) => {
      if (e.key === "Escape") setPreview(null);
      if (e.key === "ArrowRight") setPreview((i) => (i + 1) % n);
      if (e.key === "ArrowLeft") setPreview((i) => (i + n - 1) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewOpen]);

  const showLidBack = () => {
    const m = motion.current;
    m.seek = Math.round((m.angle - 180) / 360) * 360 + 180;
  };

  // On phones the card sits below the laptop, so a shorter next step can leave
  // the reader scrolled past its top.
  const goToStep = (nextStep) => {
    setStep(nextStep);
    setErrors({});
    setTried(false);
    setSubmitError("");
    requestAnimationFrame(() => {
      const card = cardRef.current;
      if (card && card.getBoundingClientRect().top < 0) card.scrollIntoView();
    });
  };

  const update = (patch) => {
    const next = { ...form, ...patch };
    setForm(next);
    setSubmitError("");
    setErrors(tried ? validate(next, step) : {});
  };

  const togglePick = (sticker) => {
    const on = !!form.picked[sticker.id];
    if (!on && isSoldOut(remaining, sticker)) return;
    update({ picked: { ...form.picked, [sticker.id]: !on } });
    if (!on) showLidBack();
  };

  const markShared = () => {
    setForm((current) => ({ ...current, shared: true }));
    setErrors(({ friend, ...rest }) => rest);
  };

  const onCopyLink = async () => {
    markShared();
    try {
      await navigator.clipboard.writeText(SHARE_TEXT);
      setCopyStatus("copied");
    } catch (error) {
      // Clipboard access can be blocked, so leave the text ready to copy by hand.
      const range = document.createRange();
      range.selectNodeContents(shareTextRef.current);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      setCopyStatus("manual");
    }
  };

  const onNativeShare = async () => {
    try {
      await navigator.share({ text: SHARE_MESSAGE, url: SHARE_URL });
      markShared();
    } catch (error) {
      if (error.name !== "AbortError") onCopyLink();
    }
  };

  const onContinue = (e) => {
    e.preventDefault();
    const nextErrors = validate(form, 1);
    if (Object.keys(nextErrors).length) {
      revealErrorRef.current = true;
      setErrors(nextErrors);
      setTried(true);
      return;
    }
    goToStep(2);
    showLidBack();
  };

  const onClaim = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const nextErrors = validate(form, 2);
    if (Object.keys(nextErrors).length) {
      revealErrorRef.current = true;
      setErrors(nextErrors);
      setTried(true);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      await submitClaim({
        first: form.first.trim(),
        email: form.email.trim(),
        friend: form.friend.trim(),
        stickers: STICKERS.filter((s) => form.picked[s.id]).map((s) => s.name),
      });
      goToStep(3);
      showLidBack();
    } catch (error) {
      if (error.code === "already_claimed") {
        revealErrorRef.current = true;
        goToStep(1);
        setErrors({ email: "This email has already claimed stickers." });
      } else if (error.code === "sold_out") {
        // Back on step 1, the sold-out effect removes the sticker and explains.
        revealErrorRef.current = true;
        setRemaining(error.remaining);
        goToStep(1);
      } else if (error.code === "self_referral") {
        setErrors({ friend: "Use a friend's email, not your own." });
      } else {
        console.error("Sticker claim failed:", error);
        setSubmitError(
          "We couldn't save your claim. Check your connection and try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onClear = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setTried(false);
  };

  const firstName = form.first.trim();

  return (
    <div className="stk-page">
      <header className="stk-header">
        <a href={HOME_URL} className="stk-brand">
          <span>FlowState</span>
          <img src={logo} alt="" />
        </a>
        <span className="stk-drop-pill">
          <span className="stk-free-tag">FREE</span>
          Black Friday sticker drop
        </span>
      </header>

      <main className="stk-main">
        <section className="stk-showcase">
          <div className="stk-intro">
            <span className="stk-eyebrow">
              FLOWSTATE'S BIGGEST DEAL OF THE YEAR
            </span>
            <h1>
              Pick your stickers. <span>They're on us.</span>
            </h1>
            <p>
              Choose any FlowState designs you like and we'll send them your
              way. Spin the laptop to see how they look.
            </p>
          </div>
          <Laptop motion={motion} picked={form.picked} />
          <span className="stk-drag-hint">← Drag to spin 360° →</span>
        </section>

        <section className="stk-card" ref={cardRef}>
          {step === 1 && allSoldOut && (
            <div className="stk-done">
              <div className="stk-done-copy">
                <h2>All stickers have been claimed</h2>
                <p>This drop is gone, but the Black Friday deal is still on.</p>
              </div>
              <a href={SIGNUP_URL} className="stk-gold-btn">
                Claim 75% off yearly →
              </a>
            </div>
          )}

          {step === 1 && !allSoldOut && (
            <form className="stk-form" noValidate onSubmit={onContinue}>
              <div className="stk-form-heading">
                <h2>We want to hear from you!</h2>
                <span className="stk-required">
                  <span className="stk-star">*</span> Required
                </span>
              </div>

              <label className="stk-field">
                <span className="stk-label">
                  Your first name <span className="stk-star">*</span>
                </span>
                <input
                  type="text"
                  autoComplete="given-name"
                  autoCapitalize="words"
                  placeholder="Alex"
                  className={errors.first ? "has-error" : ""}
                  aria-invalid={!!errors.first}
                  value={form.first}
                  onChange={(e) => update({ first: e.target.value })}
                />
                {errors.first && <span className="stk-error">{errors.first}</span>}
              </label>

              <label className="stk-field">
                <span className="stk-label">
                  Your email <span className="stk-star">*</span>
                </span>
                <span className="stk-help">The one you check most often.</span>
                <input
                  type="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="you@example.com"
                  className={errors.email ? "has-error" : ""}
                  aria-invalid={!!errors.email}
                  value={form.email}
                  onChange={(e) => update({ email: e.target.value })}
                />
                {errors.email && <span className="stk-error">{errors.email}</span>}
              </label>

              <div className="stk-picker">
                <div className="stk-picker-heading">
                  <span className="stk-label">
                    Pick your sticker designs <span className="stk-star">*</span>
                  </span>
                  <span className="stk-picker-help">
                    Choose as many as you like.
                    <span className="stk-limit-pill">
                      Limited: only 20 of each
                    </span>
                  </span>
                </div>
                <div className="stk-sticker-grid">
                  {STICKERS.map((sticker, index) => {
                    const on = !!form.picked[sticker.id];
                    const soldOut = isSoldOut(remaining, sticker);
                    return (
                      <div className="stk-sticker-cell" key={sticker.id}>
                        <button
                          type="button"
                          className="stk-view-btn"
                          aria-label={`View ${sticker.name} larger`}
                          onClick={() => setPreview(index)}
                        >
                          ⤢ View
                        </button>
                        <button
                          type="button"
                          className={`stk-sticker-card${on ? " is-on" : ""}`}
                          aria-pressed={on}
                          disabled={soldOut}
                          onClick={() => togglePick(sticker)}
                        >
                          <span className="stk-check">{on ? "✓" : ""}</span>
                          <span
                            className="stk-sticker-image"
                            style={{
                              transform: on
                                ? `scale(1.06) rotate(${sticker.lid.r}deg)`
                                : "none",
                            }}
                          >
                            <img
                              src={sticker.src}
                              alt={`${sticker.name} sticker`}
                            />
                          </span>
                          <span className="stk-sticker-copy">
                            <span className="stk-sticker-name">
                              {sticker.name}
                            </span>
                            <span className="stk-sticker-desc">
                              {sticker.desc}
                            </span>
                          </span>
                          <span className="stk-sticker-count">
                            {stockLabel(remaining, sticker)}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                {errors.stickers && (
                  <span className="stk-error">{errors.stickers}</span>
                )}
              </div>

              <div className="stk-actions">
                <button type="submit" className="stk-white-btn">
                  Continue →
                </button>
                <div className="stk-clear-row">
                  <button
                    type="button"
                    className="stk-text-btn"
                    onClick={onClear}
                  >
                    Clear form
                  </button>
                </div>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="stk-form stk-form--tight" noValidate onSubmit={onClaim}>
              <div className="stk-form-heading">
                <span className="stk-step-eyebrow">ONE LAST STEP</span>
                <h2>Watch this, {firstName}</h2>
              </div>

              <div className="stk-video">
                {/* #t=0.1 shows a frame instead of a blank player on iOS. */}
                <video
                  src={`${vslVideo}#t=0.1`}
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>

              <div className="stk-friend-panel">
                <div className="stk-friend-heading">
                  <span className="stk-label">
                    Invite a friend <span className="stk-star">*</span>
                  </span>
                  <span className="stk-help">
                    Stickers are for everyone! Add a friend's email or share your
                    link so they can pick one too.
                  </span>
                </div>

                <label className="stk-field">
                  <span className="stk-sublabel">Your friend's email</span>
                  <input
                    type="email"
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="friend@example.com"
                    className={errors.friend ? "has-error" : ""}
                    aria-invalid={!!errors.friend}
                    value={form.friend}
                    onChange={(e) => update({ friend: e.target.value })}
                  />
                </label>

                <div className="stk-or" aria-hidden="true">
                  or
                </div>

                <div className="stk-field">
                  <span className="stk-sublabel">Share this message</span>
                  <p ref={shareTextRef} className="stk-share-text">
                    {SHARE_MESSAGE} {SHARE_HOST}
                    <wbr />
                    {SHARE_PATH}
                  </p>
                  <div className="stk-share-actions">
                    <button
                      type="button"
                      className="stk-outline-btn"
                      onClick={onCopyLink}
                    >
                      {copyStatus === "copied" ? "✓ Copied" : "Copy message & link"}
                    </button>
                    {typeof navigator.share === "function" && (
                      <button
                        type="button"
                        className="stk-outline-btn"
                        onClick={onNativeShare}
                      >
                        Share…
                      </button>
                    )}
                  </div>
                  <span role="status" className="stk-share-status">
                    {copyStatus === "copied" &&
                      "Now paste it in a text or group chat."}
                    {copyStatus === "manual" &&
                      "Your browser blocked copying. Copy the selected message above."}
                  </span>
                </div>

                {errors.friend && (
                  <span className="stk-error">{errors.friend}</span>
                )}
              </div>

              <div className="stk-actions">
                <button
                  type="submit"
                  className="stk-white-btn"
                  disabled={submitting}
                >
                  {submitting
                    ? "Claiming…"
                    : `Claim my free sticker${pickedCount > 1 ? "s" : ""}`}
                </button>
                {submitError && (
                  <span className="stk-error" role="alert">
                    {submitError}
                  </span>
                )}
                <button
                  type="button"
                  className="stk-text-btn stk-back-btn"
                  disabled={submitting}
                  onClick={() => goToStep(1)}
                >
                  ← Back
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="stk-done">
              <span className="stk-done-tile">✓</span>
              <div className="stk-done-copy">
                <h2>You're in, {firstName}!</h2>
                <p>
                  We'll email <strong>{form.email.trim()}</strong> about your{" "}
                  {pickedCount === 1 ? "sticker" : `${pickedCount} stickers`}
                  {form.friend.trim() ? (
                    <>
                      {" "}
                      — and invite <strong>{form.friend.trim()}</strong> to pick
                      one too.
                    </>
                  ) : (
                    ". Thanks for sharing the link with a friend!"
                  )}
                </p>
              </div>
              <a href={SIGNUP_URL} className="stk-gold-btn">
                Claim 75% off yearly →
              </a>
            </div>
          )}
        </section>
      </main>

      {previewOpen && (
        <PreviewModal
          index={preview}
          picked={form.picked}
          remaining={remaining}
          onToggle={togglePick}
          onMove={(delta) =>
            setPreview(
              (i) => (i + delta + STICKERS.length) % STICKERS.length
            )
          }
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}

export default Stickers;
