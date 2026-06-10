import { useEffect, useState } from "react";
import "./landing.css";

import UploadImg from "../images/interviewfromresume.webp";
import FillerWordsImg from "../images/fillerwords.webp";
import StarMethodImg from "../images/starmethod.webp";
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
      ".testimonial-grid, .speech-grid, .pricing-grid"
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
      ".grade-card, .feature-card, .speech-card, .testimonial-card, .pricing-card"
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

  // Subtle hero mouse parallax
  useEffect(() => {
    const hero = document.querySelector(".title");
    const eyebrow = document.querySelector(".hero-eyebrow");
    if (!hero) return;

    const onMove = (e) => {
      const ox = (e.clientX / window.innerWidth - 0.5) * 18;
      const oy = (e.clientY / window.innerHeight - 0.5) * 10;
      hero.style.transform = `translate(${ox * 0.35}px, ${oy * 0.25}px)`;
      if (eyebrow) {
        eyebrow.style.transform = `translate(${ox * 0.2}px, ${oy * 0.15}px)`;
      }
    };

    const onLeave = () => {
      hero.style.transition = "transform 1s ease";
      hero.style.transform = "";
      if (eyebrow) {
        eyebrow.style.transition = "transform 1s ease";
        eyebrow.style.transform = "";
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const quotes = [
    '"I put React on my resume but I don\'t know anything about it!"',
    '"I didn\'t even remember that I did this project!!"',
    '"I optimized for ATS screening but how am I gonna talk about this during an interview???"',
    '"I made up these metrics to have numbers. I didn\'t think they would ask me how I got them!"',
    '"I said I led a team but couldn\'t explain what I actually did."',
    '"Why am I struggling to speak about my own experiences?????"',
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteFading, setQuoteFading] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteFading(true);
      setTimeout(() => {
        setQuoteIndex((i) => (i + 1) % quotes.length);
        setQuoteFading(false);
      }, 500);
    }, 3500);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="background">
      {/* AMBIENT GLOW ORBS */}
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="glow-orb glow-orb-3" />

      {/* NAVBAR */}
      <div className="navbar">
        <nav className="glass-navbar">
          <div className="nav-left" style={{ display: "flex" }}>
            <img
              style={{ width: "50px", height: "50px" }}
              src={logo}
              alt="flowstate-logo"
            />
          </div>

          <ul className="nav-links">


            <li>
              <a
                href="#tally-open=2EN49e&tally-layout=modal&tally-width=400&tally-overlay=1"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                Support Us
              </a>
            </li>



            <li>
              <a
                href="#pricing"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                Pricing
              </a>
            </li>

            <li>
              <a
                href="#faq"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                FAQ
              </a>
            </li>

         



          </ul>

          <button className="nav-btn" 
           data-tally-open="2EN49e"
          data-tally-layout="modal"
          data-tally-width="400"
          data-tally-overlay="1"
         >
            Join Waitlist
          </button>
        </nav>
      </div>

      {/* HERO */}
      <p className="hero-eyebrow">
        Enter Your
      </p>

      <div className="title">
        <div className="hero-brand">
          <h1 className="hero-title">
            FlowState
          </h1>
          <img
            className="hero-logo"
            style={{marginBottom: '20px'}}
            src={logo}
            alt="flowstate-logo"
          />
        </div>

        <p className="hero-tagline">
            Defeat the Resume Grill
        </p>
        <div className="hero-quote">
          <p className={`quote-text${quoteFading ? " quote-text--out" : ""}`}>
            {quotes[quoteIndex]}
          </p>
        </div>
      </div>

      {/* CTA BUTTONS */}
      <div className="buttons-place">
        <button
          className="get-started"
          data-tally-open="2EN49e"
          data-tally-layout="modal"
          data-tally-width="400"
          data-tally-overlay="1"
        >
          Join Our Waitlist
        </button>

        <button
          className="learn-more-btn"
          onClick={() =>
            document
              .getElementById("pricing")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          View Pricing
        </button>
      </div>

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
          <p className="section-label">UNDERSTAND YOUR EXPERIENCE</p>
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
        <p className="eyebrow">PRICING</p>
        <p className="pricing-subtitle">Choose the plan that works for you</p>

        <div className="billing-toggle">
          <button
            className={`billing-toggle-btn${!isYearly ? " active" : ""}`}
            onClick={() => setIsYearly(false)}
          >
            Monthly
          </button>
          <button
            className={`billing-toggle-btn${isYearly ? " active" : ""}`}
            onClick={() => setIsYearly(true)}
          >
            Yearly
            <span className="billing-save-badge">Save 25%</span>
          </button>
        </div>

        <div className="pricing-grid">

          {/* Pro */}
          <div className="pricing-card featured">
            <div className="pricing-card-body">
              <div className="plan-name-row">
                <p className="plan-name">FlowState Pro</p>
              </div>
              {isYearly ? (
                <h3 className="price price--yearly" key="yearly">
                  <span className="price-main-row">
                    <span className="price-dollar">$</span>
                    <span className="price-reel-wrap">
                      <span className="price-reel">
                        {Array.from({ length: 82 }, (_, i) => (
                          <span className="price-reel-digit" key={i}>{108 - i}</span>
                        ))}
                      </span>
                    </span>
                    <span className="price-yr">/year</span>
                  </span>
                  <span className="price-was">instead of<s>$108</s>/year</span>
                </h3>
              ) : (
                <h3 className="price" key="monthly">$9<span>/month</span></h3>
              )}
              <ul className="plan-features">
                <li><span className="check">✓</span>Unlimited resume grill practice sessions</li>
                <li><span className="check">✓</span>Unlimited job mapping credits</li>
                <li><span className="check">✓</span>Job mapping analysis</li>
                <li><span className="check">✓</span>In depth feedback</li>
                <li><span className="check">✓</span>Unlimited STAR method practice</li>
                <li><span className="check">✓</span>Unlimited Filler Words practice</li>
              </ul>
            </div>
            <p className="plan-tagline">Great for increasing your chances of getting hired, guaranteed speech confidence, and resume awareness</p>
          </div>

        </div>
      </section>


      {/* FAQ */}
<section className="faq-section fade-in" id="faq">
  <p className="eyebrow">FAQ</p>
  <h2 className="faq-title">Frequently Asked Questions</h2>

  <div className="faq-grid">
    <details className="faq-item" onMouseEnter={e => e.currentTarget.setAttribute('open', '')} onMouseLeave={e => e.currentTarget.removeAttribute('open')}>
      <summary>Who is FlowState for?</summary>
      <p>
        FlowState is for those who are heavily screened on their resume during their interview. If you optimized and tailored your resume for ATS and now confused on how to talk about this experience, this is for you!
      </p>
    </details>
    <details className="faq-item" onMouseEnter={e => e.currentTarget.setAttribute('open', '')} onMouseLeave={e => e.currentTarget.removeAttribute('open')}>
      <summary>What is a Resume grill?</summary>
      <p>
        Resume grill is a form on questioning during interviews where you are asked about your experience on your resume 
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
        FlowState focuses explicitly on resume grill questions and experience-based questions, giving you enough practice and helping
        you speak confidently and clearly explain experiences on your resume during your real interviews.
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
              href="#tally-open=2EN49e&tally-layout=modal&tally-width=400&tally-overlay=1"
            >
              Join Waitlist
            </a>
          </li>
        </ul>
        <p className="footer-copy">© {new Date().getFullYear()} FlowState. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;