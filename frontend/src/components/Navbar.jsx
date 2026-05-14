import React from 'react';

const Icon = ({ name }) => {
  const icons = {
    logout: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    book: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  };
  return <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '6px' }}>{icons[name]}</span>;
};

export default function Navbar({ onToggleSidebar, setView, scrollToBooking, currentUser, setCurrentUser }) {
  const handleLogout = async () => {
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/_/backend';
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
          <button className="btn-nav-book" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="logout" /> Log Out</button>
        ) : (
          <button className="btn-nav-book" onClick={scrollToBooking} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="book" /> Book Now</button>
        )}
      </div>
    </nav>
  );
}
