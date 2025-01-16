// pages/_app.js
import 'bulma/css/bulma.css'; // Import Bulma
import '../styles/globals.css'; // If you want a custom globals.css

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
