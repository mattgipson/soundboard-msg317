// components/SoundButton.js
import React from 'react';

export default function SoundButton({
  sound,
  onPlay,
  onDropFile,
  audioRef,
  isActive
}) {
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      onDropFile(file);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  // If there's a URL, show green dot; else gray
  const hasFile = !!sound.url;
  const dotColorClass = hasFile ? 'has-background-success' : 'has-background-grey-dark';

  // We rely on Bulma plus some custom classes
  const buttonClassNames = [
    'sound-button',
    'button',
    'is-medium',
    'is-flex',
    'is-flex-direction-column',
    'is-align-items-center',
    'is-justify-content-center',
    isActive ? 'is-active-button' : ''
  ].join(' ');

  return (
    <div
      className={buttonClassNames}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={onPlay}
      style={{
        width: '80px',
        height: '80px',
        textAlign: 'center',
        marginBottom: '1rem',
        position: 'relative'
      }}
    >
      <span
        className={`sound-button-dot ${dotColorClass}`}
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          position: 'absolute',
          top: '6px',
          right: '6px'
        }}
      ></span>

      <span className="sound-button-key is-size-4" style={{ fontWeight: 'bold' }}>
        {sound.key}
      </span>

      {/* Truncated file label below */}
      <span
        className="sound-button-file is-size-7"
        style={{
          maxWidth: '70px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'inline-block'
        }}
      >
        {sound.label || ''}
      </span>

      <audio ref={audioRef} src={sound.url || null} />
    </div>
  );
}
