import { useState, type FormEvent } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { db, isFirebaseConfigured } from "../../lib/firebase";

type SubscribeState = "idle" | "submitting" | "success" | "error";

const STORAGE_KEY = "lorapok_signal_subscriber";

function hasSavedSubscription() {
  try {
    return Boolean(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}

export default function SignalNewsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubscribeState>(() => hasSavedSubscription() ? "success" : "idle");
  const [message, setMessage] = useState(() => hasSavedSubscription() ? "You are already on the Lorapok Labs signal list." : "");

  const subscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(normalizedEmail)) {
      setState("error");
      setMessage("Enter a valid email address.");
      return;
    }
    if (!isFirebaseConfigured) {
      setState("error");
      setMessage("Subscriptions are temporarily unavailable. Please try again shortly.");
      return;
    }

    setState("submitting");
    setMessage("");
    try {
      await setDoc(doc(db, "newsletter_subscribers", normalizedEmail), {
        email: normalizedEmail,
        source: "home_newsletter",
        consentVersion: "2026-11",
        createdAt: serverTimestamp(),
      });
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ subscribedAt: new Date().toISOString() }));
      } catch {
        // The subscription is already stored remotely.
      }
      setEmail("");
      setState("success");
      setMessage("You are in. The next Lorapok Labs signal will arrive by email.");
    } catch {
      setState("error");
      setMessage("We could not save your subscription. Nothing was submitted—please try again.");
    }
  };

  return (
    <section className="newsletter-section" id="newsletter" aria-labelledby="newsletter-title">
      <div className="wrap4">
        <div className="newsletter-panel reveal">
          <div className="newsletter-copy">
            <span className="newsletter-kicker"><span aria-hidden="true">●</span> LORAPOK LABS SIGNAL</span>
            <h2 id="newsletter-title">Get our newsletter</h2>
            <p>Monthly releases, engineering notes, Creator Works and useful studio signals. No noise.</p>
          </div>

          {state === "success" ? (
            <div className="newsletter-success" role="status">
              <CheckCircle2 aria-hidden="true" />
              <div><strong>Signal connected</strong><span>{message}</span></div>
              <Link to="/blog/">Read the journal <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={subscribe} noValidate>
              <label htmlFor="newsletter-email">Email address</label>
              <div className="newsletter-field">
                <Mail size={18} aria-hidden="true" />
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  disabled={state === "submitting"}
                  required
                />
              </div>
              <button type="submit" disabled={state === "submitting"}>
                {state === "submitting" ? "Connecting…" : "Sign up"}<ArrowRight size={17} aria-hidden="true" />
              </button>
              <p className={`newsletter-status${state === "error" ? " error" : ""}`} aria-live="polite">{message}</p>
              <p className="newsletter-privacy">By subscribing, you agree to our <Link to="/privacy/">privacy policy</Link>. Unsubscribe any time.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
