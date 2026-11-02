import { useEffect, useMemo, useRef, useState } from "react";
import "./landing.css";
import "./product-reel/styles.css";
import { Icon } from "./product-reel/core/Icon.jsx";
import { FeatureCard } from "./product-reel/app/FeatureCard.jsx";
import { FillerWordVisual } from "./product-reel/app/FillerWordVisual.jsx";
import { StarToFlowVisual } from "./product-reel/app/StarToFlowVisual.jsx";

import UploadImg from "../images/resumetointerview.webp";
import grade from "../images/grade.png";
import logo from "../images/flowstatelogo.png";

const SIGNUP_URL = "https://www.withflowstate.app/signuppage";
const LOGIN_URL = "https://www.withflowstate.app/loginpage";
const DEAL_ENDS = "2026-12-01T00:00:00";
const SHOW_RIBBON = true;
const SHOW_STICKY_BAR = true;

const SEGMENTS = [
  { text: "“Uh", type: "filler" },
  { text: ", a challenge that I faced at my current job is ", type: "structure" },
  { text: "um", type: "filler" },
  { text: ". ", type: "normal" },
  { text: "Pretty much", type: "filler" },
  { text: ", so in ", type: "normal" },
  { text: "the beginning of college there was this teacher which was the reason for getting this job", type: "drift" },
  { text: " but ", type: "normal" },
  { text: "uh", type: "filler" },
  { text: " yeah so fast forward to now the challenge is ", type: "normal" },
  { text: "like", type: "filler" },
  { text: " I ", type: "normal" },
  { text: "like", type: "filler" },
  { text: " struggle with ", type: "normal" },
  { text: "um", type: "filler" },
  { text: " communication within the team”", type: "structure" },
];

const REVIEWS = [
  {
    name: "Fahad",
    position: "Offered a Sales Professional role",
    quote:
      "Flowstate helped build my confidence when speaking. Usually I stutter in interviews because I overthink and get nervous, but practising with FlowState gave me a safe space for my communication skills. I became less afraid of making mistakes and more confident in my ability to communicate clearly, especially in interviews. If you haven't tried this, I absolutely recommend it. It's affordable too, and simple — never complicated to use.",
  },
  {
    name: "Wadood",
    position: "Offered a Lead Software Engineer role",
    quote:
      "Flowstate really helped me understand how I come across in interviews. What I liked most was how it analysed my answers and showed me what I was communicating well and what wasn't getting across. Looking back at the transcript of my exact words and seeing which parts were strong made the feedback feel really specific and useful.",
  },
  {
    name: "Zidane",
    position: "Offered an Emergency Medical Technician role",
    quote:
      "I didn't want to give Flowstate a chance — I'm in the medical field and thought this was more for CS. But I had an EMT interview coming up. I have my certifications and referrals, but I'm really bad at interviewing and speaking. I used FlowState to improve my speaking and interviewing skills, which helped me land the job.",
  },
  {
    name: "Ayman Ahsan",
    position: "Offered a Lead Software Engineer role",
    quote:
      "FlowState is an amazing product. The practice is rigorous and it will definitely help you. Check it out if you have an interview coming up.",
  },
];

const FAQS = [
  ["Who is FlowState for?", "Anyone new to interviewing, nervous about it, or who struggles with public speaking under pressure."],
  ["What is a resume grill?", "A style of interview where you're asked to explain the experience on your resume, bullet by bullet."],
  ["What is a curveball question?", "A far-fetched question asked to pressure you on the spot. FlowState's curveball interview lets you practise them before the real thing."],
  ["What kinds of interviews does it cover?", "Three styles: modern interviews, resume grill interviews and curveball interviews."],
  ["Do I need a partner?", "No. FlowState is your interviewer, so you can practise any time, alone."],
  ["Is there a free trial?", "Yes — every plan starts with a 3-day free trial and you can cancel anytime."],
  ["How long does the Black Friday price last?", "The 75% off yearly price is available until the countdown ends. Your $27/year rate applies to your first year."],
];

const FEATURES = [
  "Unlimited interview practice sessions",
  "In-depth feedback on every answer",
  "Unlimited STAR method practice",
  "Unlimited filler word practice",
  "Every future feature included",
];

const GRILL_QUESTIONS = [
  "You led a team of 4 here — what went wrong first?",
  "Walk me through how you cut load time by 40%.",
  "Why that stack and not something simpler?",
];

const pad = (n) => String(n).padStart(2, "0");

function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const targetMs = useMemo(() => new Date(target).getTime(), [target]);

  return useMemo(() => {
    const diff = Math.max(0, (Number.isNaN(targetMs) ? 0 : targetMs) - now);
    const sec = Math.floor(diff / 1000);
    return {
      d: pad(Math.floor(sec / 86400)),
      h: pad(Math.floor(sec / 3600) % 24),
      m: pad(Math.floor(sec / 60) % 60),
      s: pad(sec % 60),
    };
  }, [now, targetMs]);
}

function Landing() {
  const cd = useCountdown(DEAL_ENDS);

  const dealEndLabel = useMemo(() => {
    const end = new Date(DEAL_ENDS);
    return Number.isNaN(end.getTime())
      ? "soon"
      : end.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  }, []);

  // Floating deal bar appears once the hero has scrolled out of view
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 720);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Teleprompter: scroll the duplicated transcript at 20px/s, loop seamlessly
  const trackRef = useRef(null);
  useEffect(() => {
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;

    let y = 0;
    let last = performance.now();
    let raf;
    const tick = (now) => {
      const el = trackRef.current;
      const dt = Math.min(64, now - last);
      last = now;
      if (el && el.firstElementChild) {
        const h = el.firstElementChild.offsetHeight;
        y += (20 * dt) / 1000;
        if (h && y >= h) y -= h;
        el.style.transform = `translateY(${-y}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Yearly price drops from $108 to $27 once pricing scrolls into view
  const pricingRef = useRef(null);
  const [yearlyPrice, setYearlyPrice] = useState(27);
  useEffect(() => {
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = pricingRef.current;
    if (reduce || !el || !("IntersectionObserver" in window)) {
      setYearlyPrice(27);
      return undefined;
    }

    let raf;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - start) / 900);
          const eased = 1 - Math.pow(1 - p, 3);
          setYearlyPrice(Math.round(108 - 81 * eased));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const [openFaq, setOpenFaq] = useState(0);
  const [expanded, setExpanded] = useState({});

  const marqueeItems = [...REVIEWS, ...REVIEWS, ...REVIEWS, ...REVIEWS];
  const cdBlocks = [
    { v: cd.d, l: "days" },
    { v: cd.h, l: "hours" },
    { v: cd.m, l: "mins" },
    { v: cd.s, l: "secs" },
  ];

  return (
    <div className="bf-page">
      {SHOW_RIBBON && (
        <a href="#pricing" className="bf-ribbon">
          <span className="bf-ribbon-tag">BLACK FRIDAY</span>
          <span>Yearly plan 75% off — $27 instead of $108</span>
          <span className="bf-ribbon-countdown">
            {cd.d}d {cd.h}h {cd.m}m {cd.s}s
          </span>
          <span className="bf-ribbon-cta">Claim deal →</span>
        </a>
      )}

      <header className="bf-header">
        <div className="bf-header-inner">
          <a href="#top" className="bf-brand">
            <span>FlowState</span>
            <img src={logo} alt="" className="bf-brand-logo" />
          </a>
          <nav className="bf-nav">
            <a href="#how">How it works</a>
            <a href="#drills">Drills</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="bf-header-actions">
            <a href={LOGIN_URL} className="bf-btn bf-btn-ghost">
              Log in
            </a>
            <a href={SIGNUP_URL} className="bf-btn bf-btn-light">
              Get started
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="bf-hero">
          <div className="bf-hero-left">
            <a href="#pricing" className="bf-hero-badge">
              <span className="bf-hero-badge-pill">75% off</span>
              Black Friday pricing is live
            </a>
            <h1 className="bf-hero-title">
              Sound as qualified as your resume <span className="bf-gold">looks.</span>
            </h1>
            <p className="bf-hero-lead">
              FlowState grills you on your own resume bullets, then scores how you said it —
              every filler word, every ramble, every missing result. Practise until talking
              about your work feels easy.
            </p>
            <div className="bf-hero-ctas">
              <a href={SIGNUP_URL} className="bf-btn bf-btn-gold bf-btn-lg">
                Start your free trial <span>→</span>
              </a>
              <a href="#how" className="bf-btn bf-btn-outline bf-btn-lg">
                See how it works
              </a>
            </div>
            <div className="bf-trust-row">
              <span>
                <span className="bf-gold">✓</span> 3-day free trial
              </span>
              <span>
                <span className="bf-gold">✓</span> Cancel anytime
              </span>
              <span>
                <span className="bf-gold">✓</span> Secure checkout with Stripe
              </span>
            </div>
          </div>

          <div className="bf-hero-right">
            <div className="bf-transcript-glow" aria-hidden="true" />
            <div className="bf-transcript-card">
              <p className="bf-transcript-question">
                "What's a challenge you faced at your current job, and how did you handle it?"
              </p>
              <div className="bf-transcript-window">
                <div ref={trackRef} className="bf-transcript-track">
                  {[0, 1].map((copy) => (
                    <p className="bf-transcript-p" key={copy}>
                      {SEGMENTS.map((seg, i) => (
                        <span key={i} className={`bf-seg bf-seg--${seg.type}`}>
                          {seg.text}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
              </div>
              <div className="bf-transcript-stats">
                <div className="bf-transcript-stat">
                  <span className="bf-transcript-stat-label">Fillers</span>
                  <span className="bf-transcript-stat-value bf-amber">9</span>
                </div>
                <div className="bf-transcript-stat">
                  <span className="bf-transcript-stat-label">Pace</span>
                  <span className="bf-transcript-stat-value">143 wpm</span>
                </div>
                <div className="bf-transcript-stat">
                  <span className="bf-transcript-stat-label">Result stated</span>
                  <span className="bf-transcript-stat-value bf-red-soft">No</span>
                </div>
              </div>
            </div>
            <div className="bf-score-chip">
              <span className="bf-score-chip-value">82</span>
              <span className="bf-score-chip-text">
                <strong>Speech score</strong>
                <span>Next: lead with the result</span>
              </span>
            </div>
          </div>
        </section>

        <section className="bf-marquee">
          <div className="bf-marquee-track">
            {marqueeItems.map((m, i) => (
              <span className="bf-marquee-item" key={i}>
                <span className="bf-gold">★★★★★</span>
                <span>{m.name} —</span>
                <span className="bf-marquee-position">{m.position}</span>
              </span>
            ))}
          </div>
        </section>

        <section id="how" className="bf-section">
          <div className="bf-section-head bf-section-head--center">
            <span className="bf-eyebrow">HOW IT WORKS</span>
            <h2 className="bf-h2">
              You optimised your resume for a recruiter. Now you have to talk about it.
            </h2>
          </div>
          <div className="bf-how-grid">
            <article className="bf-how-card">
              <div className="bf-how-visual bf-how-visual--blue">
                <img src={UploadImg} alt="Resume turned into an interview" />
              </div>
              <div className="bf-how-body">
                <span className="bf-how-num">01</span>
                <h3>Upload your resume</h3>
                <p>Drop in the PDF. Every question comes from a bullet you actually wrote.</p>
              </div>
            </article>
            <article className="bf-how-card">
              <div className="bf-how-visual bf-how-visual--chips">
                {GRILL_QUESTIONS.map((q) => (
                  <div className="bf-grill-chip" key={q}>
                    {q}
                  </div>
                ))}
              </div>
              <div className="bf-how-body">
                <span className="bf-how-num">02</span>
                <h3>Get grilled, out loud</h3>
                <p>
                  Resume grill, modern and curveball interviews. No partner needed — FlowState
                  is the interviewer.
                </p>
              </div>
            </article>
            <article className="bf-how-card">
              <div className="bf-how-visual bf-how-visual--gold">
                <img src={grade} alt="Grade history" />
              </div>
              <div className="bf-how-body">
                <span className="bf-how-num">03</span>
                <h3>Get a score and one next step</h3>
                <p>Actionable feedback after every answer, so you practise improving — not guessing.</p>
              </div>
            </article>
          </div>
        </section>

        <section id="drills" className="bf-section">
          <div className="bf-section-head bf-section-head--center">
            <span className="bf-eyebrow">FOCUS DRILLS</span>
            <h2 className="bf-h2">Fix the habits interviewers notice.</h2>
            <a href={SIGNUP_URL} className="bf-btn bf-btn-outline">
              Try a speech drill today!
            </a>
          </div>
          <div className="bf-drills-grid">
            <FeatureCard
              layout="tile"
              title="Filler Word Focus"
              description={'Catches every "um", "uh" and "like" in real time, then drills you until they\'re gone.'}
              icon={<Icon name="message-square-dashed" size={20} />}
              visual={<FillerWordVisual />}
              cta="Start drill"
              onClick={() => {
                window.location.href = SIGNUP_URL;
              }}
            />
            <FeatureCard
              layout="tile"
              artTone="purple"
              title="S.T.A.R. Stories"
              description="Turn bullet points into stories. Practise Situation, Task, Action, Result until your answers hold up under pressure."
              icon={<Icon name="star" size={20} />}
              visual={<StarToFlowVisual />}
              cta="Start drill"
              onClick={() => {
                window.location.href = SIGNUP_URL;
              }}
            />
          </div>
        </section>

        <section className="bf-section">
          <div className="bf-section-head bf-section-head--center">
            <span className="bf-eyebrow">THEY GOT THE OFFER</span>
            <h2 className="bf-h2">From sales floors to ambulances.</h2>
          </div>
          <div className="bf-testimonials-grid">
            {REVIEWS.map((t, i) => {
              const isExpanded = !!expanded[i];
              const isLong = t.quote.length > 220;
              return (
                <figure className="bf-testimonial-card" key={t.name}>
                  <span className="bf-gold bf-testimonial-stars">★★★★★</span>
                  <blockquote className={isExpanded ? "" : "bf-clamp-5"}>
                    "{t.quote}"
                  </blockquote>
                  {isLong && (
                    <button
                      type="button"
                      className="bf-testimonial-toggle"
                      onClick={() =>
                        setExpanded((prev) => ({ ...prev, [i]: !prev[i] }))
                      }
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                  <figcaption className="bf-testimonial-foot">
                    <span className="bf-testimonial-name">{t.name}</span>
                    <span className="bf-testimonial-position">{t.position}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
          <figure className="bf-founders-panel">
            <blockquote>
              "We'd quiz each other, run mock interviews, and review resumes, but it never
              matched the pressure of the real thing. That's why we built FlowState."
            </blockquote>
            <figcaption>
              <strong>Fuad Farhan &amp; Rayat Chowdhury</strong>
              <span>Founders, FlowState</span>
            </figcaption>
          </figure>
        </section>

        <section id="pricing" className="bf-section bf-section--center" ref={pricingRef}>
          <div className="bf-section-head bf-section-head--center">
            <span className="bf-eyebrow">BLACK FRIDAY PRICING</span>
            <div className="bf-cd-tiles">
              {cdBlocks.map((b) => (
                <span className="bf-cd-tile" key={b.l}>
                  <span className="bf-cd-tile-value">{b.v}</span>
                  <span className="bf-cd-tile-label">{b.l}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="bf-pricing-grid">
            <div className="bf-price-card">
              <div className="bf-price-head">
                <span className="bf-price-plan">Monthly</span>
                <span className="bf-price-row">
                  <span className="bf-price-was">$9</span>
                  <span className="bf-price-now">$4</span>
                  <span className="bf-price-period">/month</span>
                </span>
                <span className="bf-price-note">Black Friday price · 3-day free trial · cancel anytime</span>
              </div>
              <ul className="bf-price-features">
                {FEATURES.map((f) => (
                  <li key={f}>
                    <span>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={SIGNUP_URL} className="bf-btn bf-btn-outline bf-btn-full">
                Start monthly
              </a>
            </div>

            <div className="bf-price-card bf-price-card--yearly">
              <span className="bf-price-badge">BLACK FRIDAY · 75% OFF</span>
              <div className="bf-price-head">
                <span className="bf-price-plan bf-price-plan--gold">Yearly</span>
                <span className="bf-price-row">
                  <span className="bf-price-was">$108</span>
                  <span className="bf-price-now">${yearlyPrice}</span>
                  <span className="bf-price-period">/year</span>
                </span>
                <span className="bf-price-note bf-price-note--light">
                  That's <strong>$2.25 a month</strong> · 3-day free trial
                </span>
              </div>
              <ul className="bf-price-features bf-price-features--gold">
                {FEATURES.map((f) => (
                  <li key={f}>
                    <span className="bf-gold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={SIGNUP_URL} className="bf-btn bf-btn-gold bf-btn-full">
                Claim 75% off →
              </a>
            </div>
          </div>
          <p className="bf-pricing-footnote">
            Secure checkout with Stripe · Cancel anytime · Deal ends {dealEndLabel}
          </p>
        </section>

        <section id="faq" className="bf-section bf-section--narrow">
          <h2 className="bf-h2 bf-h2--center">Questions, answered.</h2>
          <div className="bf-faq-list">
            {FAQS.map(([question, answer], i) => {
              const isOpen = openFaq === i;
              return (
                <div className="bf-faq-item" key={question}>
                  <button
                    type="button"
                    className="bf-faq-question"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                  >
                    {question}
                    <span className="bf-faq-toggle">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && <p className="bf-faq-answer">{answer}</p>}
                </div>
              );
            })}
          </div>
        </section>

        <section className="bf-section">
          <div className="bf-final-cta">
            <h2>Your next interview is coming. Walk in ready.</h2>
            <p>
              $27 for the whole year. Black Friday ends in{" "}
              <strong>
                {cd.d}d {cd.h}h {cd.m}m
              </strong>
              .
            </p>
            <a href={SIGNUP_URL} className="bf-btn bf-btn-dark bf-btn-lg">
              Start your free trial →
            </a>
            <a href={LOGIN_URL} className="bf-final-cta-login">
              Already have an account? Log in
            </a>
          </div>
        </section>
      </main>

      <footer className="bf-footer">
        <span className="bf-brand bf-brand--footer">
          <span>FlowState</span>
          <img src={logo} alt="" className="bf-brand-logo" />
        </span>
        <nav className="bf-footer-nav">
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href="https://tally.so/r/7R0EE0">Support us</a>
          <a href={LOGIN_URL}>Log in</a>
        </nav>
        <span className="bf-footer-copy">© 2026 FlowState</span>
      </footer>

      {SHOW_STICKY_BAR && scrolled && (
        <div className="bf-sticky-bar">
          <span>
            <strong className="bf-gold">75% off</strong> yearly · {cd.d}d {cd.h}h {cd.m}m
          </span>
          <a href={SIGNUP_URL} className="bf-btn bf-btn-gold">
            Claim deal
          </a>
        </div>
      )}
    </div>
  );
}

export default Landing;
