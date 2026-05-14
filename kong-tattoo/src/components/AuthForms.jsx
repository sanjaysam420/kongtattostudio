import { useState } from 'react';

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
              {showPassword ? "👁️" : "🙈"}
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
              {showConfirmPassword ? "👁️" : "🙈"}
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
            {showPassword ? "👁️" : "🙈"}
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
