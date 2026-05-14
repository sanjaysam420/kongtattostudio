import React from 'react';

export default function Navbar({ onToggleSidebar, setView, scrollToBooking, currentUser, setCurrentUser }) {
  const handleLogout = async () => {
    try {
      const baseUrl = `http://${window.location.hostname}:5000`;
      await fetch(`${baseUrl}/api/logout`, { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setView('home');
  };

  return (
    <nav className="top-navbar">
      <div className="hamburger" onClick={onToggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="logo-container">
        <h1 
          className="logo-center" 
          onClick={currentUser ? handleLogout : () => setView('home')}
        >
          Kong Tattoo Studio
        </h1>
      </div>
      <div className="nav-actions">
        {currentUser ? (
          <button className="btn-nav-book" onClick={handleLogout}>Log Out</button>
        ) : (
          <button className="btn-nav-book" onClick={scrollToBooking}>Book Now</button>
        )}
      </div>
    </nav>
  );
}
