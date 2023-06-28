import React, { memo } from 'react';
import Helmet from 'react-helmet';

import Header from '../Header';
// import Footer from '../Footer';
import styles from './Layout.module.css';

// CSS not modular here to provide global styles
import './Globals.css';

const Layout = memo(({ children, disablePaddingBottom = false } : { children: React.ReactNode; disablePaddingBottom?: boolean }) => {
  return (
    <>
      <Helmet>
        {/* Add any sitewide scripts here */}
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          //TODO: chekc if this is ok
          // charset="UTF-8"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
      </Helmet>

      <Header />
      <main
        className={`${styles.main} ${
          disablePaddingBottom === true ? styles.disablePaddingBottom : ''
        }`}
      >
        {children}
      </main>
      {/* <Footer /> */}
    </>
  );
});

export default Layout;