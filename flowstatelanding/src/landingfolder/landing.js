import { useEffect, useState } from "react";
import "./landing.css";

import UploadImg from "../images/resumetointerview.webp";
import FillerWordsImg from "../images/fillerwordnew.webp";
import StarMethodImg from "../images/starmethodnew.webp";
import grade from "../images/grade.png";
import logo from "../images/flowstatelogo.png";


function Landing() {

  // Load Tally script once
  useEffect(() => {
    if (
      document.querySelector(
        'script[src="https://tally.so/widgets/embed.js"]'
      )
    ) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // Scroll-triggered fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Staggered child reveals for grid sections
  useEffect(() => {
    const grids = document.querySelectorAll(
      ".testimonial-grid, .speech-grid, .pp-grid"
    );

    grids.forEach((grid) => {
      Array.from(grid.children).forEach((child) => {
        child.classList.add("stagger-child");
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = Array.from(entry.target.children);
            children.forEach((child, i) => {
              setTimeout(() => child.classList.add("visible"), i * 130);
            });
          }
        });
      },
      { threshold: 0.12 }
    );

    grids.forEach((grid) => observer.observe(grid));
    return () => observer.disconnect();
  }, []);

  // Speech card visible class for mockup animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll(".speech-card, .grade-card").forEach((el) =>
      observer.observe(el)
    );
    return () => observer.disconnect();
  }, []);

  // 3D card tilt on mouse move
  useEffect(() => {
    const TILT_MAX = 7;
    const cards = document.querySelectorAll(
      ".grade-card, .feature-card, .speech-card, .testimonial-card"
    );

    const onMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -TILT_MAX * 2;
      const ry = ((x / rect.width) - 0.5) * TILT_MAX * 2;
      card.style.transition = "transform 0.08s ease";
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.01)`;
    };

    const onLeave = (e) => {
      const card = e.currentTarget;
      card.style.transition = "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)";
      card.style.transform = "";
    };

    cards.forEach((card) => {
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  // Auto-cycle which pricing card shows its "revealed" state, one at a time
  const [activePricingCard, setActivePricingCard] = useState("monthly");
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePricingCard((prev) => (prev === "monthly" ? "yearly" : "monthly"));
    }, 2800);
    return () => clearInterval(interval);
  }, []);


  const INTERVIEW_SEGMENTS = [
    { text: "“Uh", type: "filler" },
    { text: ", a challenge that I faced at my current job is ", type: "structure" },
    { text: "um", type: "filler" },
    { text: ". ", type: "normal" },
    { text: "Pretty much", type: "filler" },
    { text: ", so in ", type: "normal" },
    { text: "the beginning of college there was this teacher which was the reason for getting this job", type: "drift" },
    { text: " but ", type: "normal" },
    { text: "uh", type: "filler" },
    { text: " yeah so fast forward to ", type: "normal" },
    { text: "uh", type: "filler" },
    { text: " now the challenge is ", type: "normal" },
    { text: "like", type: "filler" },
    { text: " I ", type: "normal" },
    { text: "like", type: "filler" },
    { text: " struggle ", type: "normal" },
    { text: "pretty much", type: "filler" },
    { text: " with ", type: "normal" },
    { text: "um", type: "filler" },
    { text: " communication within the team”", type: "structure" },
  ];

  return (
    <div className="background">
      {/* AMBIENT GLOW ORBS */}
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="glow-orb glow-orb-3" />

      {/* NAVBAR */}
      <div className="navbar">
        <nav className="glass-navbar">
          <div className="nav-left">
            <div className="nav-right-brand">
              <span className="nav-brand-text">FlowState</span>
              <img src={logo} className="nav-brand-logo" alt="flowstate-logo" />
            </div>
          </div>

          <ul className="nav-links">
            <li>
              <a
                href="#tally-open=7R0EE0&tally-layout=modal&tally-width=400&tally-overlay=1"
                style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
              >
                Support Us
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#faq"
                style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
              >
                FAQ
              </a>
            </li>
          </ul>

          <div className="nav-actions">
            <a
              className="nav-login"
              href="https://www.withflowstate.app/loginpage"
            >
              Log in
            </a>
            <a
              className="nav-btn"
              href="https://www.withflowstate.app/signuppage"
            >
              Get Started
            </a>
          </div>
        </nav>
      </div>

      {/* INTERVIEW HERO */}
      <section className="interview-hero">
        <h1 className="interview-hero-title">
          AI can't do your interviews for you,<br />
          <span className="interview-hero-subtitle">but we can help you do them by YOURSELF</span>
        </h1>

        <div className="interview-demo-container">
          {/* Left: Teleprompter */}
          <div className="teleprompter-wrapper">
            <div className="teleprompter-inner">
              {/* Render text twice for seamless loop */}
              {[0, 1].map((copy) => (
                <p key={copy} className="teleprompter-text">
                  {INTERVIEW_SEGMENTS.map((seg, i) => (
                    <span key={i} className={`seg seg--${seg.type}`}>
                      {seg.text}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>

          {/* SVG Arrows */}
          <svg
            className="arrows-svg"
            viewBox="0 0 160 400"
            xmlns="http://www.w3.org/2000/svg"
            overflow="visible"
          >
            {/* Arrow: filler words → top pill */}
            <path
              className="arrow arrow--filler"
              d="M 0,120 C 70,120 100,128 180,128"
              stroke="#facc15"
              strokeWidth="2"
              fill="none"
            />
            {/* Arrow: structure → middle pill */}
            <path
              className="arrow arrow--structure"
              d="M 0,200 C 70,200 100,200 180,200"
              stroke="#c084fc"
              strokeWidth="2"
              fill="none"
            />
            {/* Arrow: drift → bottom pill */}
            <path
              className="arrow arrow--drift"
              d="M 0,290 C 70,290 100,272 180,272"
              stroke="#fb923c"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          {/* Right: Pills */}
          <div className="pills-column">
            <div className="pill pill--filler">Filler words</div>
            <div className="pill pill--structure">Structure</div>
            <div className="pill pill--drift">Drifts</div>
          </div>
        </div>

        {/* CTA BUTTONS */}
        <p className="cta-note">
          (FlowState is out, but only a few of you will read this. Get Started today)
        </p>
        <div className="buttons-place">
          <a
            className="get-started"
            href="https://www.withflowstate.app/loginpage"
          >
            Get Started
          </a>
          <button
            className="learn-more-btn"
            onClick={() =>
              document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View Pricing
          </button>
        </div>
      </section>

      {/* GRADE SECTION */}
      <div className="grade-card fade-in">
        <div className="grade-left">
          <p className="badge">CLEAR PROGRESSION</p>
          <h1>
            Actionable Feedback
            <br />
            <span style={{fontStyle: 'italic', fontWeight: 300}}>Unlimited Practice</span>
          </h1>
          <p className="subtitle">
            Practice Resume Grill questions and get actionable feedback so you can
            focus on improving, not guessing.
          </p>
        </div>

        <div className="grade-right">
          <img
            className="grade-img"
            src={grade}
            alt="FlowState grading"
          />
        </div>
      </div>

      {/* FEATURES */}
      <div className="feature-grid" id="features">
        <div className="feature-card fade-in">
          <div className="upload-showcase">
            <div className="upload-showcase-glow" />
            <div className="upload-showcase-ring" />
            <div className="upload-showcase-frame">
              <img
                className="feature-img feature-img-upload"
                src={UploadImg}
                alt="Resume upload"
              />
            </div>
         
          </div>
          <h2>Resume Based Context</h2>
          <p className="description">
            You optimized your resume to pass ATS screenings but now you actually have to talk about these experiences. We make this easy for you!
          </p>
        </div>
      </div>

      {/* SPEECH SECTION */}
      <div className="speech-section fade-in">
        <h2 className="speech-title">Improve your SPEECH with Focus Drills</h2>
        <div className="speech-grid">
          <div className="speech-card speech-card--blue fade-in">
            <p className="speech-label">ELIMINATE VERBAL HABITS</p>
            <h3>Filler Word Focus</h3>
            <p className="description">
              Stop saying "um," "uh," "like," etc mid-answer. FlowState detects your filler words in real time and gives you targeted drills to speak with clarity and confidence.
            </p>

            {/* Filler Words image + UI Mockup */}
            <div className="filler-media-wrap">
              <img src={FillerWordsImg} alt="Filler words" className="filler-bg-img" />
              <div className="filler-preview filler-preview--overlay">
                <p className="filler-preview-title">LIVE SESSION STATS</p>
                <div className="filler-stats-row">
                  <div className="filler-stat-box">
                    <span className="filler-stat-value">143<span className="filler-stat-decimal">.52</span></span>
                    <span className="filler-stat-label">WPM</span>
                  </div>
                  <div className="filler-stat-divider" />
                  <div className="filler-stat-box">
                    <span className="filler-stat-value">2.68<span className="filler-stat-decimal">%</span></span>
                    <span className="filler-stat-label">FILLER RATE</span>
                  </div>
                  <div className="filler-stat-divider" />
                  <div className="filler-stat-box">
                    <span className="filler-stat-value">24</span>
                    <span className="filler-stat-label">TOTAL FILLERS</span>
                  </div>
                </div>
                <div className="filler-chips">
                  <span className="filler-chip filler-chip--hot">like <em>×10</em></span>
                  <span className="filler-chip filler-chip--mid">well <em>×7</em></span>
                  <span className="filler-chip filler-chip--mid">kind of <em>×4</em></span>
                  <span className="filler-chip">actually <em>×1</em></span>
                  <span className="filler-chip">i mean <em>×1</em></span>
                  <span className="filler-chip">you know <em>×1</em></span>
                </div>
              </div>
            </div>
          </div>
          <div className="speech-card speech-card--purple fade-in">
            <p className="speech-label">STRUCTURE YOUR ANSWERS</p>
            <h3>S.T.A.R. Stories</h3>
            <p className="description">
              Turn your resume bullet points into compelling stories. Practice the Situation, Task, Action, Result framework until your answers flow naturally under pressure.
            </p>

            {/* STAR image + UI Mockup */}
            <div className="star-media-wrap">
              <img src={StarMethodImg} alt="STAR method" className="star-bg-img" />
              <div className="star-preview star-preview--overlay">
                <p className="star-preview-title">STRUCTURE</p>
                <div className="star-preview-card">
                  <div className="star-preview-header">
                    <button className="star-nav-btn">‹</button>
                    <span className="star-experience-label">EXPERIENCE 1 OF 3</span>
                    <button className="star-nav-btn star-nav-btn--active">›</button>
                  </div>
                  <p className="star-question">"Can you describe the technical challenges you faced while designing the state-driven interview engine?"</p>
                  <div className="star-row">
                    <span className="star-row-label">SITUATION</span>
                    <span className="star-filled">✓ Filled</span>
                  </div>
                  <div className="star-row">
                    <span className="star-row-label">TASK</span>
                    <span className="star-filled">✓ Filled</span>
                  </div>
                  <div className="star-row">
                    <span className="star-row-label">ACTION</span>
                    <span className="star-filled">✓ Filled</span>
                  </div>
                  <div className="star-row">
                    <span className="star-row-label">RESULT</span>
                    <span className="star-filled">✓ Filled</span>
                  </div>
                  <div className="star-dots">
                    <span className="star-dot star-dot--active" />
                    <span className="star-dot" />
                    <span className="star-dot" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <section className="pricing-section fade-in" id="pricing">
        <p className="pricing-subtitle">Choose the plan that works for you</p>

        <div className="pp-grid">
          <div className={`pp-card pp-card-monthly${activePricingCard === "monthly" ? " pp-card-active" : ""}`}>
            <div className="pp-card-art" aria-hidden="true" />
            <div className="pp-card-dim" aria-hidden="true" />
            <h3 className="pp-price">
              <span className="pp-price-amount">$9</span>
              <span className="pp-price-period">/month</span>
              <span className="pp-price-trial">(3 day free trial)</span>
            </h3>
            <ul className="pp-features">
              <li>Unlimited interview practice sessions</li>
              <li>In depth feedback</li>
              <li>Unlimited STAR method practice</li>
              <li>Unlimited Filler Words practice</li>
              <li>Access to ALL future features</li>
            </ul>
          </div>

          <div className={`pp-card pp-card-yearly${activePricingCard === "yearly" ? " pp-card-active" : ""}`}>
            <span className="pp-badge">75% off</span>
            <div className="pp-card-art" aria-hidden="true" />
            <div className="pp-card-dim" aria-hidden="true" />
            <h3 className="pp-price">
              <span className="pp-price-was">$108</span>
              <span className="pp-price-amount">$27</span>
              <span className="pp-price-period">/year</span>
              <span className="pp-price-trial">(3 day free trial)</span>
            </h3>
            <ul className="pp-features">
              <li>Unlimited interview practice sessions</li>
              <li>In depth feedback</li>
              <li>Unlimited STAR method practice</li>
              <li>Unlimited Filler Words practice</li>
              <li>Access to ALL future features</li>
            </ul>
          </div>
        </div>

        <a
          className="get-started pricing-cta"
          href="https://www.withflowstate.app/loginpage"
        >
          Get Started
        </a>
      </section>


      {/* FAQ */}
<section className="faq-section fade-in" id="faq">
  <h2 className="faq-title">Frequently Asked Questions</h2>

  <div className="faq-grid">
    <details className="faq-item" onMouseEnter={e => e.currentTarget.setAttribute('open', '')} onMouseLeave={e => e.currentTarget.removeAttribute('open')}>
      <summary>Who is FlowState for?</summary>
      <p>
        Either you are new to interviewing, you feel nervous, you struggle with your public speaking, overwhelmed by the pressure. This is the EXACT thing you need. 
      </p>
    </details>
    <details className="faq-item" onMouseEnter={e => e.currentTarget.setAttribute('open', '')} onMouseLeave={e => e.currentTarget.removeAttribute('open')}>
      <summary>What is a Resume grill?</summary>
      <p>
        Resume grill is a form on questioning during interviews where you are asked about your experience on your resume 
      </p>
    </details>
    <details className="faq-item" onMouseEnter={e => e.currentTarget.setAttribute('open', '')} onMouseLeave={e => e.currentTarget.removeAttribute('open')}>
      <summary>What is a Curveball?</summary>
      <p>
        Every now and then you might have an interview where the interviewer asks you a question that is a bit far fetched and out of touch to trick you and pressure you on the spot. FlowState's curveball interview is made to help you practice these unexpected questions before your real interview!
      </p>
    </details>
    <details className="faq-item" onMouseEnter={e => e.currentTarget.setAttribute('open', '')} onMouseLeave={e => e.currentTarget.removeAttribute('open')}>
      <summary>What is FlowState?</summary>
      <p>
        FlowState is a web application that helps improve your speech for resume grill interviews.
      </p>
    </details>

    <details className="faq-item" onMouseEnter={e => e.currentTarget.setAttribute('open', '')} onMouseLeave={e => e.currentTarget.removeAttribute('open')}>
      <summary>Is FlowState free to use?</summary>
      <p>
        FlowState is a paid service. With a small team and limited resources, your support directly contributes to improving FlowState for everyone. We appreciate your support!
      </p>
    </details>

    <details className="faq-item" onMouseEnter={e => e.currentTarget.setAttribute('open', '')} onMouseLeave={e => e.currentTarget.removeAttribute('open')}>
      <summary>What does joining the waitlist do?</summary>
      <p>
        Joining the waitlist shows your support for FlowState and allows us to be able to contact you to inform you about new updates. Joining the waitlist also allows us to see who's interested and gives us a chance to reach out and learn what will make FlowState the best fit for you and all of our users!
      </p>
    </details>

    <details className="faq-item" onMouseEnter={e => e.currentTarget.setAttribute('open', '')} onMouseLeave={e => e.currentTarget.removeAttribute('open')}>
      <summary>What kind of interviews does FlowState help with?</summary>
      <p>
        FlowState focuses on how to improve you speech during 3 different kinds of interview styles. Modern Interviews, Resume grill interviews, and Curveball Interviews. 
      </p>
    </details>

    <details className="faq-item" onMouseEnter={e => e.currentTarget.setAttribute('open', '')} onMouseLeave={e => e.currentTarget.removeAttribute('open')}>
      <summary>Do I need an interviewer or partner?</summary>
      <p>
        Nope. FlowState acts as your interviewer, so you can practice
        anytime without needing another person.
      </p>
    </details>
  </div>
</section>


      {/* TESTIMONIALS */}
      <section className="testimonials fade-in">
        <p className="eyebrow">TESTIMONIALS</p>

        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>
              I would always struggle with my interviews until I realized that I wasn't preparing the right way. 
              No matter how "prepared" I felt there were moments in real interviews where I would get startled by a question I wasn't expecting.
              The best performance comes from consistent and challenging practice but it's not easy to challenge yourself when preparing alone. With 
              FlowState, we solved this EXACT issue.
              <br />
              <br />– Fuad <strong>(Founder)</strong>
            </p>
          </div>

          <div className="testimonial-card">
            <p>
              FlowState was never just a project for Fuad and I, it was
              personal. We both experienced how unpredictable the job market can
              be, where even landing an internship feels uncertain. We’d quiz
              each other, run mock interviews, and review resumes, but it never
              matched the pressure of the real thing. We knew there had to be a
              better way. That’s why we built FlowState.
              <br />
              <br />– Rayat <strong>(Co-Founder)</strong>
            </p>
          </div>
        </div>

        <button
          className="get-started testimonial-cta"
          data-tally-open="7R0EE0"
          data-tally-layout="modal"
          data-tally-width="400"
          data-tally-overlay="1"
        >
          Add a Testimonial to be Featured
        </button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">
          <img src={logo} alt="flowstate-logo" />
          <span>FlowState</span>
        </div>
        <ul className="footer-links">
          <li>
            <a href="#pricing">Pricing</a>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
          <li>
            <a
              href="https://www.withflowstate.app/loginpage"
            >
              Get Started
            </a>
          </li>
        </ul>
        <p className="footer-copy">© {new Date().getFullYear()} FlowState. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;