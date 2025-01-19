// pages/_app.js
import 'bulma/css/bulma.css'; // Import Bulma
import '../styles/globals.css'; // Import custom global styles
import Layout from '../components/Layout'; // Import the new Layout component

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;