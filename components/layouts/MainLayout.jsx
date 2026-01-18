'use client';

import Header from '../Header';
import Footer from '../Footer/Footer';

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
