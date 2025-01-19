// components/AudioVisualizer.js
import React, { useEffect, useRef } from 'react';

export default function AudioVisualizer({ analyser, currentFilename }) {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions dynamically
    function resizeCanvas() {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const peaks = Array(bufferLength).fill(0);

    const PEAK_CAP_HEIGHT = 4;
    const PEAK_DECAY = 1.5; // Adjust peak decay speed for a smoother effect

    function draw() {
      animationIdRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / (bufferLength * 2); // Ensure bars fit canvas width
      const centerX = canvas.width / 2;

      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];
        const barHeight = (value / 255) * canvas.height;

        // Gradient-filled bar
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, 'lime');
        gradient.addColorStop(1, 'green');

        ctx.fillStyle = gradient;

        // Draw bars on the left side (mirrored)
        ctx.fillRect(centerX - (i + 1) * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);

        // Draw bars on the right side
        ctx.fillRect(centerX + i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);

        // Peak caps
        if (value > peaks[i]) peaks[i] = value;
        else peaks[i] = Math.max(peaks[i] - PEAK_DECAY, 0);

        const peakBarHeight = (peaks[i] / 255) * canvas.height;
        ctx.fillStyle = '#ff5cc1';

        // Left-side peak caps
        ctx.fillRect(
          centerX - (i + 1) * barWidth,
          canvas.height - peakBarHeight - PEAK_CAP_HEIGHT,
          barWidth - 2,
          PEAK_CAP_HEIGHT
        );

        // Right-side peak caps
        ctx.fillRect(
          centerX + i * barWidth,
          canvas.height - peakBarHeight - PEAK_CAP_HEIGHT,
          barWidth - 2,
          PEAK_CAP_HEIGHT
        );
      }
    }

    draw();

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [analyser]);

  return (
    <div className="visualizer-wrapper">
      <canvas
        ref={canvasRef}
        className="audio-visualizer-canvas"
        style={{
          width: '400px',
          height: '100px',
          backgroundColor: '#222',
          display: 'block',
          margin: '0 auto',
        }}
      />
      <div
        style={{ textAlign: 'center', marginTop: '10px' }}
        className="visualizer-feedback"
      >
        {currentFilename || 'Ready!'}
      </div>
    </div>
  );
}