'use client';

import Header from '../Header';
import Footer from '../Footer/Footer';

export default function MainLayout({ children, hideNavbarAndFooter = false }) {
  return (
    <>
      {!hideNavbarAndFooter && <Header />}
      {children}
      {!hideNavbarAndFooter && <Footer />}
    </>
  );
}
