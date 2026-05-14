import React from 'react';

export default function Sidebar({ isOpen, onClose, currentUser, setCurrentUser, setView, scrollToBooking }) {
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setView('home');
    onClose();
  };

  const handleNavClick = (viewName, scrollId) => {
    setView(viewName);
    onClose();
    if (scrollId) {
      setTimeout(() => {
        document.getElementById(scrollId)?.scrollIntoView({behavior: 'smooth'});
      }, 100);
    }
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
           <button className="close-sidebar" onClick={onClose}>&times;</button>
        </div>
        
        <nav className="sidebar-nav">
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>Home</a>
          <a href="#about" onClick={(e) => { e.preventDefault(); handleNavClick('home', 'about'); }}>About</a>
          <a href="#gallery" onClick={(e) => { e.preventDefault(); handleNavClick('home', 'gallery'); }}>Gallery</a>
          <a href="#artists" onClick={(e) => { e.preventDefault(); handleNavClick('home', 'artists'); }}>Artists</a>
          <a href="#contact" onClick={(e) => { onClose(); scrollToBooking(e); }}>Contact</a>
        </nav>

        <div className="sidebar-footer">
          {currentUser ? (
            <div className="user-profile">
              <span className="welcome-text">Welcome, {currentUser.username}</span>
              <div className="auth-buttons">
                <button className="btn-sidebar-outline" onClick={handleLogout}>Log Out</button>
                {currentUser.role === 'artist' && (
                  <button className="btn-sidebar-solid" onClick={() => { setView('dashboard'); onClose(); }}>Dashboard</button>
                )}
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-sidebar-outline" onClick={() => { setView('signup'); onClose(); }}>Sign Up</button>
              <button className="btn-sidebar-solid" onClick={() => { setView('login'); onClose(); }}>Log In</button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
