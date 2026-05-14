import { useState } from 'react';

const VisibilityIcon = ({ isVisible }) => {
  return isVisible ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
      <line x1="2" x2="22" y1="2" y2="22"/>
    </svg>
  );
};

export default function AuthForms({ view, setView, setCurrentUser }) {
  const [authForm, setAuthForm] = useState({ username: "", password: "" });
  const [authMsg, setAuthMsg] = useState(null);
  const [authError, setAuthError] = useState(null);

  const [forgotForm, setForgotForm] = useState({ username: "", password: "", confirmPassword: "" });
  const [forgotMsg, setForgotMsg] = useState(null);
  const [forgotError, setForgotError] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAuthChange = (e) => setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  const handleForgotChange = (e) => setForgotForm({ ...forgotForm, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthMsg(null); setAuthError(null);
    try {
      const baseUrl = `http://${window.location.hostname}:5000`;
      const response = await fetch(`${baseUrl}/api/signup`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(authForm),
      });
      const data = await response.json();
      if (!response.ok) setAuthError(data.error || "Signup failed");
      else {
        setAuthMsg("Signup successful! Please log in.");
        setAuthForm({ username: "", password: "" });
        setTimeout(() => setView("login"), 1500);
      }
    } catch { setAuthError("Failed to reach server."); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthMsg(null); setAuthError(null);
    try {
      const baseUrl = `http://${window.location.hostname}:5000`;
      const response = await fetch(`${baseUrl}/api/login`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(authForm),
      });
      const data = await response.json();
      if (!response.ok) setAuthError(data.error || "Login failed");
      else {
        setCurrentUser({ username: data.username, role: data.role });
        setAuthForm({ username: "", password: "" });
        setView(data.role === 'artist' ? "dashboard" : "home");
      }
    } catch { setAuthError("Failed to reach server."); }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotMsg(null); setForgotError(null);
    if (forgotForm.password !== forgotForm.confirmPassword) return setForgotError("Passwords do not match");
    try {
      const baseUrl = `http://${window.location.hostname}:5000`;
      const response = await fetch(`${baseUrl}/api/reset-password`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(forgotForm),
      });
      const data = await response.json();
      if (!response.ok) setForgotError(data.error || "Reset failed");
      else {
        setForgotMsg("Password updated successfully!");
        setForgotForm({ username: "", password: "", confirmPassword: "" });
        setTimeout(() => setView("login"), 1500);
      }
    } catch { setForgotError("Failed to reach server."); }
  };

  if (view === "forgot") {
    return (
      <section className="section auth-form-container">
        <h2>Reset Password</h2>
        {forgotMsg && <p className="success-msg" style={{ marginTop: 0 }}>{forgotMsg}</p>}
        {forgotError && <p style={{ color: "red", fontWeight: "bold" }}>{forgotError}</p>}
        <form onSubmit={handleForgotSubmit}>
          <input type="email" name="username" placeholder="Email address" value={forgotForm.username} onChange={handleForgotChange} required />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={forgotForm.password}
              onChange={handleForgotChange}
              required
            />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              <VisibilityIcon isVisible={showPassword} />
            </span>
          </div>

          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={forgotForm.confirmPassword}
              onChange={handleForgotChange}
              required
            />
            <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              <VisibilityIcon isVisible={showConfirmPassword} />
            </span>
          </div>

          <button type="submit" style={{ marginTop: "15px" }}>Reset Password</button>
        </form>
        <div style={{ marginTop: "15px" }}>
          <a href="#" onClick={(e) => { e.preventDefault(); setView('login') }}>Back to Log In</a>
        </div>
      </section>
    );
  }

  return (
    <section className="section auth-form-container">
      <h2>{view === "login" ? "Log In" : "Sign Up"}</h2>
      {authMsg && <p className="success-msg" style={{ marginTop: 0 }}>{authMsg}</p>}
      {authError && <p style={{ color: "red", fontWeight: "bold" }}>{authError}</p>}
      <form onSubmit={view === "login" ? handleLogin : handleSignup}>
        <input type="email" name="username" placeholder="Email address" value={authForm.username} onChange={handleAuthChange} required />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={authForm.password}
            onChange={handleAuthChange}
            required
          />
          <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            <VisibilityIcon isVisible={showPassword} />
          </span>
        </div>

        {view === "login" && (
          <div style={{ textAlign: "left", marginTop: "5px" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setView('forgot'); }}>Forgot Password?</a>
          </div>
        )}
        <button type="submit" style={{ marginTop: "15px" }}>{view === "login" ? "Log In" : "Sign Up"}</button>
      </form>
    </section>
  );
}
