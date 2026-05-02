import { useState } from "react";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("professional");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const tones = ["professional", "friendly", "apologetic", "confident"];

  const handleLogin = (e) => {
    e.preventDefault();
    if (email.includes("@" && "gmail.com")) setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setMessage("");
    setResult("");
    setError("");
  };

  const handleRewrite = async () => {
    setError("");
    setResult("");

    const words = message.split(" ");
    for (let i = 0; i < words.length; i++) {
      if (words[i].toLowerCase() === "spam") {
        setError("Your message contains blocked content.");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.rewritten);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="auth-box">
        <form onSubmit={handleLogin} className="card">
          <h2>EmailMagic.ai</h2>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <nav className="navbar">
        <span>✨ Tone Transformer</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
      <div className="container">
        <div className="card">
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your draft..." />
          {error && <div className="error-box">⚠️ {error}</div>}
          <div className="footer">
            <select value={tone} onChange={(e) => setTone(e.target.value)}>
              {tones.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
            <button onClick={handleRewrite} disabled={loading}>{loading ? "Magic..." : "Rewrite"}</button>
          </div>
        </div>
        {result && (
          <div className="result-area">
            <div className="box"><h4>Original</h4><p>{message}</p></div>
            <div className="box highlight"><h4>Rewritten</h4><p>{result}</p></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;