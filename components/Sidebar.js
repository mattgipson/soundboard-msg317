// components/Sidebar.js
import React from 'react';

export default function Sidebar({ isOpen, onClose }) {
  // We'll use a couple Bulma classes plus a custom class to show/hide
  const sidebarClass = isOpen ? 'sidebar is-open' : 'sidebar';

  return (
    <aside className={sidebarClass}>
      <div className="sidebar-header">
        <button 
          className="delete is-large sidebar-close-btn" 
          onClick={onClose}
          aria-label="close sidebar"
        />
        <h1 className="title is-4">My Soundboard App</h1>
      </div>

      {/* A simple technical overview / instructions */}
      <div className="sidebar-content">
        <p>
          This is a simple React/Next.js soundboard framework that lets you assign 
          audio files to keyboard keys and play them with a click or key press.
        </p>
        <br />
        <p>
          <strong>How to use:</strong><br />
          1. Drag & drop an audio file onto a key.<br />
          2. Press that key on your physical keyboard or click it to hear the sound.<br />
        </p>
      </div>
    </aside>
  );
}
