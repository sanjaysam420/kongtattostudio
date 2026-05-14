import React from 'react';

export default function Bubbles() {
  const bubbleCount = 15;
  const bubbles = Array.from({ length: bubbleCount });

  return (
    <div className="bubbles-container">
      {bubbles.map((_, i) => (
        <div 
          key={i} 
          className={`bubble ${i % 2 === 0 ? 'bubble-red' : 'bubble-blue'}`} 
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 12}s`,
            animationDelay: `${Math.random() * 8}s`,
            opacity: 0.4 + Math.random() * 0.4
          }}
        ></div>
      ))}
    </div>
  );
}
