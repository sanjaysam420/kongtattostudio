import { useState } from 'react';

export default function CustomerDashboard({ currentUser, bookings, fetchArtistBookings }) {
  const [formData, setFormData] = useState({ name: "", email: "", date: "", time: "", message: "" });
  const [message, setMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);

  const myBookings = bookings.filter(b => b.username === currentUser.username || b.name === currentUser.username || b.email === currentUser.username);
  const hasActiveBooking = myBookings.some(b => b.status === "Active" || !b.status);

  const handleBookingChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setFormData({ name: booking.name, email: booking.email, date: booking.date, time: booking.time, message: booking.message || "" });
  };

  const handleDeleteBooking = async (booking) => {
    if (!window.confirm(`Delete appointment on ${booking.date} at ${booking.time}?`)) return;
    try {
      const baseUrl = `http://${window.location.hostname}:5000`;
      const response = await fetch(`${baseUrl}/api/bookings`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: booking.email, date: booking.date, time: booking.time }),
      });
      if (response.ok) {
        setMessage("Appointment deleted successfully. Now booking a new appointment.");
        setFormData({ name: "", email: "", date: "", time: "", message: "" });
        fetchArtistBookings();
        setTimeout(() => setMessage(null), 3000);
      } else {
        setErrorMsg("Failed to delete appointment");
      }
    } catch {
      setErrorMsg("Failed to connect to the server.");
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); setErrorMsg(null);
    try {
      const baseUrl = `http://${window.location.hostname}:5000`;
      let response;

      if (editingBooking) {
        // Delete old booking and create new one
        await fetch(`${baseUrl}/api/bookings`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: editingBooking.email, date: editingBooking.date, time: editingBooking.time }),
        });
      }

      response = await fetch(`${baseUrl}/api/book`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, username: currentUser.username }),
      });

      const data = await response.json();
      if (!response.ok) setErrorMsg(data.error || "An error occurred");
      else {
        setMessage(editingBooking ? "Appointment updated successfully" : data.message);
        setFormData({ name: "", email: "", date: "", time: "", message: "" });
        setEditingBooking(null);
        fetchArtistBookings();
      }
    } catch { setErrorMsg("Failed to connect to the server."); }
  };

  return (
    <section className="section customer-section">
      {myBookings.length > 0 && (
        <div className="appointments-container">
          <h2>Appointments</h2>
          {myBookings.map((b, i) => (
            <div key={i} className="appointment-card">
              <strong className="appointment-date">{b.date} at {b.time}</strong>
              {b.status === 'Cancelled' ? (
                <div className="status-cancelled">
                  <strong>Status: Cancelled</strong><br />
                  Your appointment is cancelled, please select another date and time.
                </div>
              ) : (
                <div className="status-process">Status: In Process</div>
              )}
              {b.status !== 'Cancelled' && (
                <div className="appointment-buttons">
                  <button className="btn-edit" onClick={() => handleEditBooking(b)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDeleteBooking(b)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div id="contact" className={`book-appointment-container ${myBookings.length === 0 ? 'empty' : ''}`}>
        <h2>{editingBooking ? "Edit Appointment" : "Book Appointment"}</h2>
        {errorMsg && <p style={{ color: "red", fontWeight: "bold" }}>{errorMsg}</p>}
        {message && <p className="success-msg">{message}</p>}
        {!message && hasActiveBooking && !editingBooking ? (
          <div className="warning-box">
            <p className="warning-title">You already have an appointment in process.</p>
            <p className="warning-desc">Please wait until your current appointment is completed or cancelled before requesting a new one.</p>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit}>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleBookingChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleBookingChange} required />
            <input type="date" name="date" value={formData.date} onChange={handleBookingChange} required />
            <select name="time" value={formData.time} onChange={handleBookingChange} required>
              <option value="" disabled>Select Time (10 AM - 7 PM)</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">01:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="17:00">05:00 PM</option>
              <option value="18:00">06:00 PM</option>
              <option value="19:00">07:00 PM</option>
            </select>
            <textarea name="message" placeholder="Message" value={formData.message} onChange={handleBookingChange}></textarea>
            <div className="form-buttons">
              <button type="submit">{editingBooking ? "Update Appointment" : "Submit"}</button>
              {editingBooking && (
                <button type="button" className="btn-cancel" onClick={() => {
                  setEditingBooking(null);
                  setFormData({ name: "", email: "", date: "", time: "", message: "" });
                }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
