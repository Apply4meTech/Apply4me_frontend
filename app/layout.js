import { Roboto, Manrope } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "../components/ThemeRegistry";
import StoreProvider from "../store/StoreProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer/Footer";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-roboto',
});

const manrope = Manrope({
  weight: ['400', '500', '700', '800'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata = {
  title: "APPLY FOR ME",
  description: "ApplyForMe Frontend Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={manrope.className} style={{ fontFamily: 'var(--font-manrope), Manrope, sans-serif' }}>
        <StoreProvider>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
