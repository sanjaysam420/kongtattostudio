import { useState, useEffect } from 'react';

export default function PublicViews({ scrollToBooking, currentUser, setView }) {
  const [galleryItems] = useState([
    { "src": "/images/phoenix.png", "alt": "Phoenix Rising", "label": "Phoenix Rising", "link": "https://www.google.com/search?tbm=isch&q=phoenix+tattoo+designs" },
    { "src": "/images/geometric.png", "alt": "Geometric Patterns", "label": "Geometric Patterns", "link": "https://www.google.com/search?tbm=isch&q=geometric+tattoo+designs" },
    { "src": "/images/wolf.png", "alt": "Wolf Pack", "label": "Wolf Pack", "link": "https://www.google.com/search?tbm=isch&q=wolf+pack+tattoo+designs" },
    { "src": "/images/black.png", "alt": "Black Ink Art", "label": "Black Ink Art", "link": "https://www.google.com/search?tbm=isch&q=black+ink+tattoo+designs" },
    { "src": "/images/dragon.png", "alt": "Dragon Art", "label": "Dragon Art", "link": "https://www.google.com/search?tbm=isch&q=dragon+tattoo+designs" },
    { "src": "/images/floral.png", "alt": "Floral Design", "label": "Floral Design", "link": "https://www.google.com/search?tbm=isch&q=floral+tattoo+designs" }
  ]);
  const [aboutInfo] = useState({
    title: "About Us",
    description: "Kong Tattoo Studio delivers high-quality tattoos with professional artists and unique designs. We specialize in custom ink that tells your story with precision and artistry."
  });

  return (
    <>
      <section className="hero">
        <div className="hero-text">
        </div>
      </section>

      <section id="about" className="section">
        <h2>{aboutInfo.title}</h2>
        <p>{aboutInfo.description}</p>
      </section>

      <section id="gallery" className="section gallery-white">
        <h2>Gallery</h2>
        <div className="gallery-grid">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="gallery-grid-item"
              onClick={() => window.open(item.link, '_blank')}
              style={{ cursor: 'pointer' }}
            >
              <img src={item.src} alt={item.alt} />
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </section>


      <section id="artists" className="section">
        <h2>Artist</h2>
        <div className="cards">
          <div className="card">
            <img src="/images/pub.jpeg" alt="Pugazh" />
            <h3>Pugazh</h3>
            <p>Realism Expert</p>
          </div>
        </div>
      </section>

      {currentUser?.role === 'artist' && (
        <section className="section">
          <h2>Welcome, Artist</h2>
          <p>Go to your <a href="#" className="artist-welcome" onClick={(e) => { e.preventDefault(); setView('dashboard'); }}>Dashboard</a> to view bookings.</p>
        </section>
      )}
    </>
  )
}
