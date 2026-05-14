import { useState, useEffect } from "react";
import "./style.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import PublicViews from "./components/PublicViews";
import AuthForms from "./components/AuthForms";
import CustomerDashboard from "./components/CustomerDashboard";
import ArtistDashboard from "./components/ArtistDashboard";
import Bubbles from "./components/Bubbles";

function App() {
  const [view, setView] = useState("home"); // "home", "login", "signup", "dashboard", "forgot"
  const [currentUser, setCurrentUser] = useState(null); // {username, role}
  const [bookings, setBookings] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const scrollToBooking = (e) => {
    if (e) e.preventDefault();
    if (!currentUser) {
      setView('login');
      return;
    }
    if (view !== "home") setView("home");
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const fetchArtistBookings = async () => {
    try {
      const baseUrl = `http://${window.location.hostname}:5000`;
      const response = await fetch(`${baseUrl}/api/bookings`);
      const data = await response.json();
      if (response.ok) {
         setBookings(data.bookings || []);
      }
    } catch (error) {
       console.error("Failed to fetch bookings");
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchArtistBookings();
    }
  }, [currentUser]);

  return (
    <div className="app-container">
      <Bubbles />
      {view !== "dashboard" && (
        <>
          <Navbar onToggleSidebar={toggleSidebar} setView={setView} scrollToBooking={scrollToBooking} currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={closeSidebar} 
            view={view} 
            setView={setView} 
            currentUser={currentUser} 
            setCurrentUser={setCurrentUser} 
            scrollToBooking={scrollToBooking} 
          />
        </>
      )}

      <main className={`main-content ${view === "dashboard" ? 'full-width' : ''}`}>

      {view === "home" && currentUser?.role === "customer" && (
        <CustomerDashboard currentUser={currentUser} bookings={bookings} fetchArtistBookings={fetchArtistBookings} />
      )}
      
      {view === "home" && (!currentUser || currentUser?.role !== "customer") && (
        <PublicViews scrollToBooking={scrollToBooking} currentUser={currentUser} setView={setView} />
      )}

      {(view === "login" || view === "signup" || view === "forgot") && (
        <AuthForms view={view} setView={setView} setCurrentUser={setCurrentUser} />
      )}

      {view === "dashboard" && (
        <ArtistDashboard bookings={bookings} fetchArtistBookings={fetchArtistBookings} setCurrentUser={setCurrentUser} setView={setView} />
      )}

        {view !== "dashboard" && (
          <footer>
            <p>© 2026 Kong Tattoo Studio</p>
          </footer>
        )}
      </main>
    </div>
  );
}

export default App;
