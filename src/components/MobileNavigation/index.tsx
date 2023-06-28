import React, { useState, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LogoutIcon from '@mui/icons-material/Logout';
import Config from '../../assets/config.json';

//TO DO: refactor this to handle multiple nested links to avoid hardcoding 'depth'
// have to restructure config.json
// refactor this

import styles from './MobileNavigation.module.css';
import { useAuthActions, useAuthState } from '../../context/authContext';
import { CategoriesWithSub } from '../../models/Product';
import { NavObject } from '../Header';

const MobileNavigation = memo((props: { categoriesWithSub: CategoriesWithSub[]; close: () => void }) => {
  const { signOut } = useAuthActions();

  // start of filter by url logic............
  //A URL pathname, beginning with a /.
  const { pathname } = useLocation();
  // if user is comming from ('shop'|| 'shop/...../ ) or ('shopvw'|| 'shopv2/...../ )
  let filterPathName = '/shop';

  //compare '/shopv2' first, since '/shopv2' and '/shop' start the same
  if (pathname.startsWith('/shopv2')) {
    filterPathName = '/shopv2';
  } else if (pathname.startsWith('/shop')) {
    filterPathName = '/shop';
  }
  //end....................................

  const { isAuthenticated } = useAuthState();
  const { categoriesWithSub, close } = props;

  const [subMenu, setSubMenu] = useState<CategoriesWithSub>();
  const [depth, setDepth] = useState<number>(0);

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className={styles.root}>
      <nav>
        <div className={styles.headerAuth}>
          {depth === 0 && isAuthenticated === false && (
            <div className={styles.authLinkContainer}>
              <Link to={'/signup'}>Sign Up</Link>
              <Link to={'/signin'}>Sign In</Link>
            </div>
          )}

          {depth === 0 && isAuthenticated === true && (
            <div
              className={styles.welcomeContainer}
              role={'presentation'}
              onClick={() => setDepth(-1)}
            >
              <span className={styles.welcomeMessage}>Welcome, John</span>
              <NavigateNextIcon/>
            </div>
          )}

          {depth === -1 && isAuthenticated === true && (
            <div
              className={styles.previousLinkContainer}
              onClick={() => setDepth(0)}
              role={'presentation'}
            >
              <div className={styles.previousIcon}>
                <NavigateNextIcon/>
              </div>
              <span>my account</span>
            </div>
          )}

          {depth === 1 && (
            <div
              className={styles.previousLinkContainer}
              onClick={() => setDepth(0)}
              role={'presentation'}
            >
              <div className={styles.previousIcon}>
                <NavigateNextIcon/>
              </div>
              <span>Shop</span>
            </div>
          )}

          {depth === 2 && subMenu && (
            <div
              className={styles.previousLinkContainer}
              onClick={() => setDepth(1)}
              role={'presentation'}
            >
              <div className={styles.previousIcon}>
                <NavigateNextIcon/>
              </div>
              <span>{subMenu.category.name}</span>
            </div>
          )}
        </div>

        <div className={styles.mobileNavContainer}>
          {/* dynamic portion */}
          {depth === 0 && (
            <div>
              {Config.headerLinks.map((navObject: NavObject) => {
                const hasSubmenu = navObject.menuLabel === 'Shop';
                return (
                  <Link
                    key={navObject.menuLink}
                    className={`${styles.mobileLink}`}
                    to={hasSubmenu === true ? '' : navObject.menuLink}
                    onClick={() => {
                      if (hasSubmenu) {
                        setDepth(1);
                      }
                      return;
                    }}
                  >
                    {navObject.menuLabel}
                    {hasSubmenu && <NavigateNextIcon/>}
                  </Link>
                );
              })}
              <div className={styles.navFooter}>
                <Link to={!isAuthenticated ? '/signin' : '/favorites'}>
                  <FavoriteBorderIcon/>
                  Favorites (0)
                </Link>
              </div>
            </div>
          )}

          {depth === 1 &&
            categoriesWithSub.map((menuItem) => {
              return (
                <Link
                  key={menuItem.category.id}
                  to={''}
                  onClick={() => {
                    setDepth(2);
                    setSubMenu(menuItem);
                    return;
                  }}
                  className={`${styles.mobileLink}`}
                >
                  {menuItem.category.name}
                  <NavigateNextIcon/>
                </Link>
              );
            })}

          {depth === 2 && subMenu && (
            subMenu.subCategories.map((subMenuItem) => {
              return (
                <Link
                  key={subMenuItem.id}
                  to={`${filterPathName}/${subMenu.category.name}/${subMenuItem.name}`}
                  className={`${styles.edgeLink}`}
                >
                  {subMenuItem.name}
                </Link>
              );
            })
          )}

          {depth === -1 && (
            <>
              <div>
                {/* no need to check for isAuthenticated , this depth will not be shown if not authenticated */}
                <Link to={'/account/orders/'} className={styles.mobileLink}>
                  Orders
                </Link>
                <Link to={'/account/address/'} className={styles.mobileLink}>
                  Addresses
                </Link>
                <Link to={'/account/settings/'} className={styles.mobileLink}>
                  Settings
                </Link>
                <Link to={'/account/viewed/'} className={styles.mobileLink}>
                  Recently Viewed
                </Link>
              </div>
              <div className={styles.navFooter}>
                <div
                  className={styles.logoutContainer}
                  role={'presentation'}
                  onClick={handleLogout}
                >
                  <LogoutIcon />
                  <span>Sign out </span>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
});

export default MobileNavigation;