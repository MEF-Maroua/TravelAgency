import React from 'react';

import Header from '../Header/Header';
import Router from '../../router/Router';
import Footer from '../Footer/Footer';

const Layout = () => {
  return (
    <div className="layout__wrapper">
      <Header />
      <main className="main__content">
        <Router />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;