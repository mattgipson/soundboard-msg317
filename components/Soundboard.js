// Soundboard.js
import React, { useEffect, useRef, useState } from 'react';
import AudioVisualizer from './AudioVisualizer';

/** 
 * A full QWERTY-ish layout
 */
const FULL_KEYS = [
  'Q','W','E','R','T','Y','U','I','O','P',
  'A','S','D','F','G','H','J','K','L',';',
  'Z','X','C','V','B','N','M',',','.','/'
];

/**
 * Example default sounds
 * We'll map these to the *first five* keys in FULL_KEYS.
 * The rest remain empty until the user drops a file.
 */
const DEFAULT_SOUNDS = [
  { url: '/sounds/doh-windowz.wav',     label: 'Ohdoh!',       fullName: 'doh-windowz.wav' },
  { url: '/sounds/signing-ophdoze.wav', label: 'CUL8R',        fullName: 'signing-ophdoze.wav' },
  { url: '/sounds/bellbong.wav',        label: 'Bonggg',       fullName: 'bellbong.wav' },
  { url: '/sounds/jumpman.wav',         label: 'Jump Around',  fullName: 'jumpman.wav' },
  { url: '/sounds/internet.wav',        label: 'Internet',     fullName: 'internet.wav' }
];

// Helper function to remove file extensions
function removeFileExtension(filename) {
  return filename.replace(/\.[^/.]+$/, '');
}

export default function Soundboard() {
  // Build the full keyboard array, assigning defaults to the first 5 keys
  const [sounds, setSounds] = useState(() => {
    return FULL_KEYS.map((key, i) => {
      if (DEFAULT_SOUNDS[i]) {
        return {
          id: i + 1,
          key,
          url: DEFAULT_SOUNDS[i].url,
          label: DEFAULT_SOUNDS[i].label,
          fullName: DEFAULT_SOUNDS[i].fullName
        };
      } 
      return {
        id: i + 1,
        key,
        url: '',
        label: '',
        fullName: ''
      };
    });
  });

  // Index of the key currently "pressed"
  const [activeIndex, setActiveIndex] = useState(null);

  // The filename displayed under the visualizer
  const [currentFilename, setCurrentFilename] = useState('Ready!');

  // We store refs for each <audio> element
  const audioRefs = useRef([]);

  // Single AudioContext + Analyser
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  // Current source node (so we can disconnect previous one)
  const currentSourceRef = useRef(null);

  // Initialize <audio> refs any time `sounds` array changes length
  useEffect(() => {
    audioRefs.current = sounds.map(() => React.createRef());
  }, [sounds]);

  // Create AudioContext + Analyser once on mount
  useEffect(() => {
    if (!audioContextRef.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      // Connect analyser -> destination so audio is both audible and visualized
      analyser.connect(ctx.destination);

      analyserRef.current = analyser;
    }
  }, []);

  // Keyboard event to trigger "play" by pressing the matching key
  useEffect(() => {
    const handleKeyDown = (e) => {
      const pressedKey = e.key.toUpperCase();
      const idx = sounds.findIndex((s) => s.key === pressedKey);
      if (idx !== -1) {
        handlePlay(idx);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sounds]);

  // Play a sound
  const handlePlay = (index) => {
    setActiveIndex(index);

    const audioEl = audioRefs.current[index].current;
    if (!audioEl) return;

    // Disconnect any previous source
    if (currentSourceRef.current) {
      currentSourceRef.current.disconnect();
      currentSourceRef.current = null;
    }

    // Create a new source from this <audio>
    currentSourceRef.current = audioContextRef.current.createMediaElementSource(audioEl);
    currentSourceRef.current.connect(analyserRef.current);

    // Resume audio context if suspended
    audioContextRef.current.resume().catch((err) => console.warn(err));

    // Actually play the audio
    audioEl.currentTime = 0;
    audioEl.play().catch((err) => console.warn('Audio play error:', err));

    // Show the full filename if it exists, else the label or "Untitled"
    const fName = sounds[index].fullName || sounds[index].label || 'Untitled';
    setCurrentFilename(fName);

    // Release pressed effect after 150ms
    setTimeout(() => setActiveIndex(null), 150);
  };

  // Drag-and-drop to override the file for a specific key
  const handleDropFile = (index, file) => {
    const noExt = removeFileExtension(file.name);
    const updated = sounds.map((sound, i) => {
      if (i === index) {
        return {
          ...sound,
          url: URL.createObjectURL(file),
          label: noExt,
          fullName: file.name
        };
      }
      return sound;
    });
    setSounds(updated);
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      {/* Retro/bouncy AudioVisualizer (assumes you've replaced the code in AudioVisualizer.js) */}
      {analyserRef.current && (
        <AudioVisualizer
          analyser={analyserRef.current}
          currentFilename={currentFilename}
        />
      )}

      <div
        className="full-keyboard"
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginTop: '2rem',
          maxWidth: '800px',
          margin: '2rem auto 0 auto'
        }}
      >
        {sounds.map((sound, i) => (
          <div
            key={sound.id}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '6px',
              border: '1px solid #aaa',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              cursor: 'pointer',
              boxShadow: i === activeIndex
                ? 'inset 2px 2px 4px rgba(0,0,0,0.3)'
                : '2px 2px 4px rgba(0,0,0,0.2)',
              userSelect: 'none'
            }}
            onClick={() => handlePlay(i)}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleDropFile(i, file);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            {/* Green dot if there's a valid URL */}
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                position: 'absolute',
                top: '6px',
                right: '6px',
                backgroundColor: sound.url ? 'limegreen' : '#ccc'
              }}
            />
            {/* Key letter in bigger text */}
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              {sound.key}
            </span>
            {/* Truncated label */}
            <span
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

            <audio ref={audioRefs.current[i]} src={sound.url || null} />
          </div>
        ))}
      </div>
    </div>
  );
}
