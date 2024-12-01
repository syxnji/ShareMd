import "@/styles/globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
