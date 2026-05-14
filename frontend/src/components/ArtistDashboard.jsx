export default function ArtistDashboard({ bookings, fetchArtistBookings, setCurrentUser, setView }) {

  const deleteBookingAPI = async (b) => {
    try {
      const baseUrl = `http://${window.location.hostname}:5000`;
      const response = await fetch(`${baseUrl}/api/bookings`, {
        method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b),
      });
      if (response.ok) fetchArtistBookings();
      else alert("Failed to delete booking.");
    } catch { alert("Server error."); }
  };

  const cancelBookingAPI = async (b) => {
    try {
      const baseUrl = `http://${window.location.hostname}:5000`;
      const response = await fetch(`${baseUrl}/api/bookings/cancel`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b),
      });
      if (response.ok) fetchArtistBookings();
      else alert("Failed to cancel booking.");
    } catch { alert("Server error."); }
  };

  const handleDelete = (b) => {
    if (window.confirm("Are you sure you want to permanently delete this booking without notifying the customer?")) {
      deleteBookingAPI(b);
    }
  };

  const handleCancel = (b) => {
    if (window.confirm("Cancel this appointment?")) {
      cancelBookingAPI(b);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = `http://${window.location.hostname}:5000`;
      await fetch(`${baseUrl}/api/logout`, { method: "POST" });
    } catch (err) {
      console.error(err);
    }
    setCurrentUser(null);
    setView('home');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-left"></div>
        <div className="dashboard-header-center">
          <h1 onClick={handleLogout}>Kong Tattoo Studio</h1>
        </div>
        <div className="dashboard-header-right">
          <button className="btn-dashboard-back" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Log Out
          </button>
        </div>
      </header>
      <div className="dashboard-layout">
      <div className="sidebar">
        <h2 className="logo" style={{ textAlign: "center", marginBottom: "40px" }}>KONG</h2>
        <nav className="sidebar-nav">
          <a href="#" className="active" onClick={(e) => e.preventDefault()}>Bookings</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setView('home') }}>Public Site</a>
          <a href="#" style={{ marginTop: "auto", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }} onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Log Out
          </a>
        </nav>
      </div>
      <div className="dashboard-content">
        <h2 className="artist-dashboard-title">Artist Dashboard</h2>
        <button onClick={fetchArtistBookings} style={{ marginBottom: '20px', borderRadius: "5px" }}>Refresh Bookings</button>
        <div className="bookings-list">
          {bookings.length === 0 ? <p>No bookings yet.</p> : null}
          {bookings.map((b, i) => (
            <div key={i} className="artist-booking-card">
              <div>
                <strong className="appointment-date">{b.date} at {b.time}</strong>
                <br /><br /><span style={{ color: "#666" }}>Name:</span> {b.name} | <span style={{ color: "#666" }}>Email:</span> {b.email}
                {b.message && <><br /><br /><span style={{ color: "#666" }}>Message:</span> {b.message}</>}
                <br /><br />
                <span style={{ color: b.status === 'Cancelled' ? "#dc3545" : "#28a745", fontWeight: "bold" }}>
                  Status: {b.status === 'Cancelled' ? 'Cancelled' : 'Active'}
                </span>
              </div>
              <div className="artist-booking-actions">
                <button onClick={() => handleDelete(b)} style={{ background: "transparent", border: "1px solid #999", color: "#666", borderRadius: "5px" }}>Delete</button>
                <button onClick={() => handleCancel(b)} style={{ borderRadius: "5px", background: "darkblue" }}>Cancel</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}
