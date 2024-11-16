import "../styles/globals.css";
import { Footer } from "../components/Footer/page";
import { Header } from "../components/Header/page";

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <Header />

        {children}
        
        <Footer />
      </body>
    </html>
  );
}
