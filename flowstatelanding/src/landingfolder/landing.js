import { useEffect } from "react";
import "./landing.css";

import UploadImg from "../images/flowstateuploadimg.png";
import SessionImg from "../images/sessions.png";
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

  return (
    <div className="background">
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
          The Proper Training You Need Before The Interview
        </p>
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
      <div className="grade-card">
        <div className="grade-left">
          <p className="badge">CLEAR PROGRESSION</p>
          <h1>
            Real Time Feedback.
            <br />
            <span>Unlimited Practice.</span>
          </h1>
          <p className="subtitle">
            Practice behavioral interviews with instant AI feedback so you can
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
        <div className="feature-card">
          <img
            className="feature-img feature-img-upload"
            src={UploadImg}
            alt="Resume upload"
          />
          <p className="section-label">UNDERSTAND YOUR EXPERIENCE</p>
          <h2>Resume Based Context</h2>
          <p className="description">
            Gives you the script you need to practice confidently about your
            experiences.
          </p>
        </div>

        <div className="feature-card">
          <img
            className="feature-img feature-img-session"
            src={SessionImg}
            alt="Practice sessions"
          />
          <p className="section-label">PREPARATION WITH PRACTICE</p>
          <h2>Speaking Practice</h2>
          <p className="description">
            Improve speaking confidence with real-time grades and feedback.
          </p>
        </div>
      </div>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <p className="eyebrow">PRICING (COMING SOON...)</p>
        <p className="pricing-subtitle">
          Pay for services you want and need. The rest is on us!
        </p>

          <div className="pricing-card featured">
            <p className="plan-name">Pro</p>
            <h3 className="price">
              TBD<span>/mo</span>
            </h3>
            <ul style={{textAlign:"left"}}className="plan-features">
              <li>✓ Unlimited practice</li>
              <li>✓ Resume context based interviews</li>
              <li>✓ Detailed feedback, analysis, and grades</li>
              <li>✓ All future features included</li>
            </ul>
          
          </div>

      </section>


      {/* FAQ */}
<section className="faq-section" id="faq">
  <p className="eyebrow">FAQ</p>
  <h2 className="faq-title">Frequently Asked Questions</h2>

  <div className="faq-grid">
    <details className="faq-item">
      <summary>What is FlowState?</summary>
      <p>
        FlowState is a web application that helps people who struggle with their speech be able to speak confidently during their interviews.
      </p>
    </details>

    <details className="faq-item">
      <summary>Is FlowState free to use?</summary>
      <p>
        FlowState is not free to use, since with a small team and limited resources, FlowState is a paid service. Your support for FlowState contributes to FlowState's services improving overtime. 
      </p>
    </details>

    <details className="faq-item">
      <summary>What kind of interviews does FlowState help with?</summary>
      <p>
        FlowState focuses on behavioral and experience-based interviews, giving you enough practice and helping
        you speak confidently and clearly explain experiences on your resume.
      </p>
    </details>

    <details className="faq-item">
      <summary>Do I need an interviewer or partner?</summary>
      <p>
        Nope. FlowState acts as your interviewer, so you can practice
        anytime without needing another person.
      </p>
    </details>
  </div>
</section>


      {/* TESTIMONIALS */}
      <section className="testimonials">
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
              It's unbelievable to see FlowState, which started out as a small project idea turn into something that feels real. Every sprint and every interation gave us hope that we 
              have been able to find the solution for the problem we aimed to solve. 
              <br />
              <br />– Rayat <strong>(Co-Founder)</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;