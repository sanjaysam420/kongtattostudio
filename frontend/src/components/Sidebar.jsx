/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

const Icon = ({ name }) => {
  const icons = {
    home: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    about: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
    gallery: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    artists: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    contact: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
    signup: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
    login: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>,
    logout: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
  };
  return <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '10px' }}>{icons[name]}</span>;
};

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
        document.getElementById(scrollId)?.scrollIntoView({ behavior: 'smooth' });
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
          <a href="#" style={{ display: 'flex', alignItems: 'center' }} onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}><Icon name="home" /> Home</a>
          <a href="#about" style={{ display: 'flex', alignItems: 'center' }} onClick={(e) => { e.preventDefault(); handleNavClick('home', 'about'); }}><Icon name="about" /> About</a>
          <a href="#gallery" style={{ display: 'flex', alignItems: 'center' }} onClick={(e) => { e.preventDefault(); handleNavClick('home', 'gallery'); }}><Icon name="gallery" /> Gallery</a>
          <a href="#artists" style={{ display: 'flex', alignItems: 'center' }} onClick={(e) => { e.preventDefault(); handleNavClick('home', 'artists'); }}><Icon name="artists" /> Artists</a>
          <a href="#contact" style={{ display: 'flex', alignItems: 'center' }} onClick={(e) => { onClose(); scrollToBooking(e); }}><Icon name="contact" /> Contact</a>
        </nav>

        <div className="sidebar-footer">
          {currentUser ? (
            <div className="user-profile">
              <span className="welcome-text">Welcome, {currentUser.username}</span>
              <div className="auth-buttons">
                <button className="btn-sidebar-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleLogout}><Icon name="logout" /> Log Out</button>
                {currentUser.role === 'artist' && (
                  <button className="btn-sidebar-solid" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { setView('dashboard'); onClose(); }}><Icon name="dashboard" /> Dashboard</button>
                )}
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-sidebar-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { setView('signup'); onClose(); }}><Icon name="signup" /> Sign Up</button>
              <button className="btn-sidebar-solid" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { setView('login'); onClose(); }}><Icon name="login" /> Log In</button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
