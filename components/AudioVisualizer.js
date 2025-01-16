// components/AudioVisualizer.js
import React, { useRef, useEffect } from 'react';

/**
 * A Winamp-style bar visualizer:
 * - Each bar has a "peak cap" that lingers at the top briefly.
 * - Bars decay over time if volume lowers.
 * - Bars use a neon-green gradient from bottom to ~50% alpha, ending in 0% alpha.
 */
export default function AudioVisualizer({ analyser, currentFilename }) {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);

  // Keep a separate array to track the "peak" for each bar
  // so we can implement that lingering "cap."
  // We'll update these heights in draw() each frame.
  let peakArray = useRef([]);

  useEffect(() => {
    if (!analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Initialize the peakArray if it's empty or changed in size
    if (!peakArray.current.length || peakArray.current.length !== bufferLength) {
      peakArray.current = new Array(bufferLength).fill(0);
    }

    // Colors & styling
    const bgColor = '#222'; // background
    const barWidth = canvas.width / bufferLength;
    const maxOpacity = 0.5; // gradient's max alpha

    // You can tweak these to get different bouncy/lingering effects
    const PEAK_DECAY = 0.8;    // how fast the peak drops
    const BAR_DECAY = 0.8;      // how quickly the bar reacts to lower volume

    // The height of the little "cap" rectangle at the top of each bar
    const PEAK_CAP_HEIGHT = 3;

    function draw() {
      animationIdRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      // Clear the canvas
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bufferLength; i++) {
        // current raw value
        const currentValue = dataArray[i];
        // scale to canvas height
        const barHeight = (currentValue / 255) * canvas.height;

        // Smoothing / "decay" for the bar itself
        // We can let each bar "decay" if new barHeight is lower than peakArray
        // or instantly jump up if it's higher.
        // But for that "bouncy" effect, let's let it rise quickly, 
        // then decay if volume lowers.
        if (barHeight > peakArray.current[i]) {
          // jump up immediately
          peakArray.current[i] = barHeight;
        } else {
          // decay gradually
          peakArray.current[i] = Math.max(peakArray.current[i] - BAR_DECAY, barHeight);
        }

        // Calculate top Y position
        const y = canvas.height - peakArray.current[i];

        // Draw the main bar using a gradient from neon green ~50% alpha to 0 alpha
        const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
        // at the bar's top => alpha ~ maxOpacity
        gradient.addColorStop(0, `rgba(0, 255, 0, ${maxOpacity})`);
        // fade out to transparent at the bottom
        gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth, y, barWidth - 2, peakArray.current[i]);

        // Now handle the "peak cap"
        // We'll keep a separate "peak" that lingers longer with a slower decay
        // Alternatively, we could just use peakArray.current for both,
        // but let's do a small offset so it doesn't vanish instantly
        let peakTop = peakArray.current[i];

        // We'll track a separate array or we can reuse the same. Let's reuse the same approach:
        // For a separate "cap peak," we might store it in a separate array,
        // but let's do a second pass here:
        // We'll do a slow decay if barHeight < existing peak
        if (barHeight + 5 < peakTop) {
          // If significantly lower, let the peak fall slowly
          peakTop -= PEAK_DECAY * canvas.height;
          if (peakTop < barHeight) peakTop = barHeight;
        } else {
          peakTop = peakArray.current[i];
        }

        // The y position for the cap
        const capY = canvas.height - peakTop - PEAK_CAP_HEIGHT;

        // Only draw the cap if it's > 0
        if (peakTop > 0) {
          ctx.fillStyle = 'rgba(0, 255, 0, 1)'; // bright neon green
          ctx.fillRect(i * barWidth, capY, barWidth - 2, PEAK_CAP_HEIGHT);
        }
      }
    }

    draw();

    return () => {
      cancelAnimationFrame(animationIdRef.current);
    };
  }, [analyser]);

  return (
    <div className="audio-visualizer-container" style={{ textAlign: 'center' }}>
      <canvas
        className="audio-visualizer-canvas"
        ref={canvasRef}
        width="500"
        height="75"
        style={{ background: '#222' }}
      />
      <div className="current-filename" style={{ color: '#ccc', marginTop: '0.5rem' }}>
        <em>{currentFilename}</em>
      </div>
    </div>
  );
}
