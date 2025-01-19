// components/SoundButton.js
import React from 'react';

export default function SoundButton({ sound, onPlay, onDropFile, audioRef, isActive }) {
  return (
    <button
      onClick={onPlay}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) onDropFile(file);
      }}
      onDragOver={(e) => e.preventDefault()}
      className={`sound-button ${isActive ? 'pressed' : ''}`}
      style={{
        width: '80px',
        height: '80px',
        borderRadius: '6px',
        border: '1px solid #111', // 6px border width
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        cursor: 'pointer',
        background: isActive
          ? 'linear-gradient(to bottom, #333, #444)' // Active backwwground gradient
          : 'linear-gradient(to bottom, #222, #333)', // Inactive background gradient
        boxShadow: isActive
          ? 'inset 2px 2px 4px rgba(0,0,0,0.3)' // Inner shadow for active state
          : '2px 2px 4px rgba(0,0,0,0.7)', // Subtle outer shadow for inactive state
      }}
    >
      <span
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          position: 'absolute',
          top: '6px',
          right: '6px',
          backgroundColor: sound.url ? 'limegreen' : '#444',
          boxShadow: sound.url ? '0px -1px 3px limegreen' : 'inset 0px 2px 2px rgba(0,0,0,0.3)',
  
        }}
        className='dot'
      />
      <span 
        className='sound-button-key' 
        style={{ 
          fontSize: '1.2rem', 
          fontWeight: 'bold',
          /*color: isActive
          ? 'limegreen' // Active 
          : '#ccc', // Inactive
          */
         color: sound.url ? '#ccc' : '#777'
        }}
      >
        {sound.key}
      </span>
      <span
        className='sound-button-file'
        style={{
          fontSize: '0.7rem',
          maxWidth: '70px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {sound.label}
      </span>
      <audio ref={audioRef} src={sound.url || null} />
    </button>
  );
}