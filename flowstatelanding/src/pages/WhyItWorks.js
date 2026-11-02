import { Link } from "react-router-dom";
import "./WhyItWorks.css";

function WhyItWorks() {
  return (
    <div className="why-it-works-page">
      <Link to="/" className="why-it-works-back">
        ← Back home
      </Link>

      <h1 className="why-it-works-title">Why It Works</h1>

      <section className="why-it-works-row why-it-works-row--left">
        <div className="why-it-works-block">
          <h2>Daily Practice</h2>
          <ul className="why-it-works-list">
            <li>Short, consistent interview practice sessions</li>
            <li>Get practice in at any point in time</li>
            <li>No more waiting on a friend for a last-minute mock interview</li>
          </ul>
        </div>
      </section>

      <section className="why-it-works-row why-it-works-row--right">
        <div className="why-it-works-block">
          <h2>Takes Care of Each Step</h2>
          <ul className="why-it-works-list">
            <li>Various interview types to practice with</li>
            <li>Feedback on things that are invisible to track on your own</li>
            <li>Speech Focus Drills to tackle each skill one at a time</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default WhyItWorks;
