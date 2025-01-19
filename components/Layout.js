// components/Layout.js
export default function Layout({ children }) {
    return (
      <>

        <main>{children}</main>
        <footer style={{ color: '#666', padding: '1rem', fontSize: '14px', textAlign: 'center' }}>
        <p><strong><a href="https://github.com/mattgipson/soundboard-msg317" target="_blank">Audiotron3000</a></strong> / A React soundboard app framework by <a href="https://msg317.com" target="_blank">MSG317</a>.</p>
        <br/>
        <p>
          <strong>How to use:</strong><br />
          1. Drag & drop an audio file onto a key.<br />
          2. Press that key on your physical keyboard or click it to hear the sound.<br />
        </p>
        </footer>
      </>
    );
  }