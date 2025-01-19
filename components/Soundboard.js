import React, { useEffect, useRef, useState } from 'react';
import AudioVisualizer from './AudioVisualizer';
import SoundButton from './SoundButton';
import Sidebar from './Sidebar';

const FULL_KEYS = [
  'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';',
  'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'
];

const DEFAULT_SOUNDS = [
  { url: '/sounds/doh-windowz.wav', label: 'Ohdoh!', fullName: 'doh-windowz.wav' },
  { url: '/sounds/signing-ophdoze.wav', label: 'CUL8R', fullName: 'signing-ophdoze.wav' },
  { url: '/sounds/bellbong.wav', label: 'Bonggg', fullName: 'bellbong.wav' },
  { url: '/sounds/s-and-s-READY.wav', label: 'Ready', fullName: 's-and-s-READY.wav' },
  { url: '/sounds/jumpman.wav', label: 'Jump Around', fullName: 'jumpman.wav' },
  { url: '/sounds/internet.wav', label: 'Internet', fullName: 'internet.wav' },
  { url: '/sounds/whammmmmmm.wav', label: 'Whammmmmmm', fullName: 'whammmmmmm.wav' },
  { url: '/sounds/drum-clap.wav', label: 'Clap', fullName: 'drum-clap.wav' },
  { url: '/sounds/drum-tsss.wav', label: 'Tssssk', fullName: 'drum-tsss.wav' },
  { url: '/sounds/s-and-s-M.wav', label: 'M', fullName: 's-and-s-M.wav' }
  
];

function removeFileExtension(filename) {
  return filename.replace(/\.[^/.]+$/, '');
}

export default function Soundboard() {
  const [sounds, setSounds] = useState(() =>
    FULL_KEYS.map((key, i) => {
      if (DEFAULT_SOUNDS[i]) {
        return {
          id: i + 1,
          key,
          url: DEFAULT_SOUNDS[i].url,
          label: DEFAULT_SOUNDS[i].label,
          fullName: DEFAULT_SOUNDS[i].fullName
        };
      }
      return { id: i + 1, key, url: '', label: '', fullName: '' };
    })
  );

  const [activeIndex, setActiveIndex] = useState(null);
  const [currentFilename, setCurrentFilename] = useState('Ready!');
  const [audioContextReady, setAudioContextReady] = useState(false);

  const audioRefs = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    audioRefs.current = sounds.map(() => React.createRef());
  }, [sounds]);

  const initializeAudioContext = () => {
    if (!audioContextRef.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;

      audioContextRef.current = ctx;
      analyserRef.current = analyser;

      setAudioContextReady(true);
      console.log('AudioContext initialized and ready!');
    }
  };

  useEffect(() => {
    if (!audioContextRef.current || !analyserRef.current) return;

    audioRefs.current.forEach((ref, index) => {
      const audioEl = ref.current;

      if (audioEl && audioEl.src) {
        try {
          console.log(`Connecting audio source: ${audioEl.src}`);
          const source = audioContextRef.current.createMediaElementSource(audioEl);
          source.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);

          console.log(`Connected audio source for index ${index}`);
        } catch (err) {
          console.error(`Error connecting audio source for index ${index}:`, err);
        }
      } else {
        console.warn('Audio element missing or invalid:', audioEl?.src);
      }
    });
  }, [sounds, audioContextReady]);

  // Animation synchronization
  useEffect(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const updateSpeakerAnimation = () => {
      requestAnimationFrame(updateSpeakerAnimation);

      analyserRef.current.getByteFrequencyData(dataArray);
      const avgVolume = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;

      const speakers = document.querySelectorAll('.at3k-speaker-wrapper');
      speakers.forEach((speaker) => {
        if (avgVolume > 50) {
          speaker.classList.add('is-pulsing');
        } else {
          speaker.classList.remove('is-pulsing');
        }
      });
    };

    updateSpeakerAnimation();
  }, [audioContextReady]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const pressedKey = e.key.toUpperCase();
      const index = sounds.findIndex((sound) => sound.key === pressedKey);

      if (index !== -1) {
        handlePlay(index);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sounds]);

  const handlePlay = (index) => {
    setActiveIndex(index);

    sounds.forEach((_, j) => {
      if (j !== index) {
        const otherEl = audioRefs.current[j]?.current;
        if (otherEl && !otherEl.paused) {
          otherEl.pause();
          otherEl.currentTime = 0;
        }
      }
    });

    const audioEl = audioRefs.current[index]?.current;
    if (audioEl) {
      audioContextRef.current.resume().catch((err) => console.warn(err));
      audioEl.currentTime = 0;
      audioEl.play().catch((err) => console.warn('Audio play error:', err));
      const fName = sounds[index].fullName || sounds[index].label || 'Add Sound to Use';
      setCurrentFilename(fName);
    }

    setTimeout(() => setActiveIndex(null), 150);
  };

  const handleDropFile = (index, file) => {
    const noExt = removeFileExtension(file.name);

    const updatedSounds = sounds.map((sound, i) => {
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

    setSounds(updatedSounds);

    const audioEl = audioRefs.current[index]?.current;
    if (audioEl) {
      try {
        audioContextRef.current.resume().catch((err) => console.warn(err));

        if (audioEl.dataset.connected === 'true') {
          audioEl.dataset.connected = 'false';
        }

        const source = audioContextRef.current.createMediaElementSource(audioEl);
        source.connect(analyserRef.current);
        source.connect(audioContextRef.current.destination);

        audioEl.dataset.connected = 'true';
        console.log(`Reconnected new audio source for index ${index}`);
      } catch (err) {
        console.error(`Error reconnecting audio source for index ${index}:`, err);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      {!audioContextReady && (
        <div style={{ marginBottom: '2rem', marginTop: '2rem' }}>
          <button
            onClick={initializeAudioContext}
            style={{ padding: '10px 20px', fontSize: '1.2rem' }}
            className=' start-button'
          >
            Start Soundboard
          </button>
        </div>
      )}

      {audioContextReady && (
        <>
          <div className="at3k-visualizer-container">
            <div className="columns is-vcentered is-multiline is-mobile">
              <div className="column is-hidden-mobile">
                <div className="at3k-speaker-wrapper">
                  <div className="at3k-speaker">
                    <div className="at3k-speaker-outer">
                      <div className="at3k-speaker-middle">
                        <div className="at3k-speaker-inner">

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="column is-full-mobile">
                <AudioVisualizer
                  analyser={analyserRef.current}
                  currentFilename={currentFilename}
                />
              </div>
              <div className="column is-hidden-mobile">
                <div className="at3k-speaker-wrapper">
                <div className="at3k-speaker">
                    <div className="at3k-speaker-outer">
                      <div className="at3k-speaker-middle">
                        <div className="at3k-speaker-inner">

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              maxWidth: '960px',
              margin: '2rem auto'
            }}
          >
            {sounds.map((sound, i) => (
              <SoundButton
                key={sound.id}
                sound={sound}
                audioRef={audioRefs.current[i]}
                isActive={i === activeIndex}
                onPlay={() => handlePlay(i)}
                onDropFile={(file) => handleDropFile(i, file)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}