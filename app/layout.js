import { Roboto } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "../components/ThemeRegistry";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "ApplyForMe",
  description: "ApplyForMe Frontend Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
