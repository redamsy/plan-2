import React, { useState, useEffect, createRef, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

import AddNotification from '../AddNotification';
import Brand from '../Brand';
import Container from '../Container';
import Config from '../../assets/config.json';
import Drawer from '../Drawer';
import ExpandedMenu from '../ExpandedMenu';
import FormInputField from '../FormInputField';
import MiniCart from '../MiniCart';
import MobileNavigation from '../MobileNavigation';
import styles from './Header.module.css';
import { useAuthState } from '../../context/authContext';
import { useProductState } from '../../context/productsContext';
import { CategoriesWithSub } from '../../models/Product';
import CircularProgressPage from '../CircularProgressPage';

export interface NavObject {
  menuLabel: string;
  menuLink: string;
}
const Header = memo(() => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthState();
  const { loadingData, categoriesWithSubFilters } = useProductState();

  const [showMiniCart, setShowMiniCart] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(true);

  const [menu, setMenu] = useState<CategoriesWithSub[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | undefined>();

  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');

  const searchRef = createRef<HTMLInputElement>();
  const bannerMessage = 'Free shipping worldwide';
  const searchSuggestions = [
    'Oversize sweaters',
    'Lama Pajamas',
    'Candles Cinnamon',
  ];

  const handleHover = (navObject: NavObject) => {
    if (navObject.menuLabel === 'Shop') {
      setShowMenu(true);
      setMenu(categoriesWithSubFilters);
      setShowSearch(false);
    } else {
      setMenu([]);
    }
    setActiveMenu(navObject.menuLabel);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/search?q=${search}`);
    setShowSearch(false);
  };

  // disable active menu when show menu is hidden
  useEffect(() => {
    if (showMenu === false) setActiveMenu(undefined);
  }, [showMenu]);

  // hide menu onscroll
  useEffect(() => {
    const onScroll = () => {
      setShowMenu(false);
      setShowSearch(false);
      setActiveMenu(undefined);
    };
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // TODO: solve this ref is possibly 'null'
  //listen for show search and delay trigger of focus due to CSS visiblity property
  // useEffect(() => {
  //   if (showSearch === true) {
  //     const timer = setTimeout(() => {
  //       searchRef.current.focus();
  //     }, 250);
  //   return () => clearTimeout(timer);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [showSearch]);
  
  return (
      <>
      {loadingData ? (
        <CircularProgressPage />
      ) : (
        <div className={styles.root}>
          <div className={styles.headerMessageContainer}>
            <span>{bannerMessage}</span>
          </div>
          <Container size={'large'} spacing={'min'}>
            {/* header container */}
            <div className={styles.header}>
              <div className={styles.linkContainer}>
                <nav
                  role={'presentation'}
                  onMouseLeave={() => {
                    setShowMenu(false);
                  }}
                >
                  {Config.headerLinks.map((navObject) => (
                    <Link
                      key={navObject.menuLink}
                      onMouseEnter={() => handleHover(navObject)}
                      className={`${styles.navLink} ${
                        activeMenu === navObject.menuLabel ? styles.activeLink : ''
                      }`}
                      to={navObject.menuLink}
                    >
                      {navObject.menuLabel}
                    </Link>
                  ))}
                </nav>
              </div>
              <div
                role={'presentation'}
                onClick={() => {
                  setMobileMenu(!mobileMenu);
                  return;
                  // setDepth(0);
                }}
                className={styles.burgerIcon}
              >
                {mobileMenu === true ? <CloseIcon/> : <MenuIcon/>}
              </div>
              <Brand />
              <div className={styles.actionContainers}>
                <button
                  aria-label="Search"
                  className={`${styles.iconButton} ${styles.iconContainer}`}
                  onClick={() => {
                    setShowSearch(!showSearch);
                    return;
                  }}
                >
                  <SearchIcon/>
                </button>
                <Link
                  aria-label="Favorites"
                  to={!isAuthenticated ? '/signin' : "/account/favorites"}
                  className={`${styles.iconContainer} ${styles.hideOnMobile}`}
                >
                  <FavoriteBorderIcon/>
                </Link>
                <Link
                  aria-label="Orders"
                  to={!isAuthenticated ? '/signin' : '/account/orders/'}
                  className={`${styles.iconContainer} ${styles.hideOnMobile}`}
                >
                  <AccountCircleOutlinedIcon/>
                </Link>
                <button
                  aria-label="Cart"
                  className={`${styles.iconButton} ${styles.iconContainer} ${styles.bagIconContainer}`}
                  onClick={() => {
                    setShowMiniCart(true);
                    setMobileMenu(false);
                    return;
                  }}
                >
                  <ShoppingBagOutlinedIcon fontSize='inherit'/>
                  <div className={styles.bagNotification}>
                    <span>1</span>
                  </div>
                </button>
                <div className={styles.notificationContainer}>
                  <AddNotification openCart={() => setShowMiniCart(true)} />
                </div>
              </div>
            </div>

            {/* search container */}
            <div
              className={`${styles.searchContainer} ${
                showSearch === true ? styles.show : styles.hide
              }`}
            >
              <h4>What are you looking for?</h4>
              <form className={styles.searchForm} onSubmit={(e) => handleSearch(e)}>
                <FormInputField
                  ref={searchRef}
                  icon={'arrow'}
                  id={'searchInput'}
                  value={search}
                  placeholder={''}
                  type={'text'}
                  handleChange={(_: string, e: string) => setSearch(e)}
                />
              </form>
              <div className={styles.suggestionContianer}>
                {searchSuggestions.map((suggestion, index) => (
                  <p
                    role={'presentation'}
                    onClick={() => {
                      setShowSearch(false);
                      navigate(`/search?q=${suggestion}`);
                      return;
                    }}
                    key={index}
                    className={styles.suggestion}
                  >
                    {suggestion}
                  </p>
                ))}
              </div>
              <div
                role={'presentation'}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSearch(false);
                  return;
                }}
                className={styles.backdrop}
              ></div>
            </div>
          </Container>

          {/* menu container */}
          <div
            role={'presentation'}
            onMouseLeave={() => setShowMenu(false)}
            onMouseEnter={() => setShowMenu(true)}
            className={`${styles.menuContainer} ${
              showMenu === true ? styles.show : ''
            }`}
          >
            <Container size={'large'} spacing={'min'}>
              <ExpandedMenu menu={menu} />
            </Container>
          </div>

          {/* minicart container */}
          <Drawer visible={showMiniCart} close={() => setShowMiniCart(false)}>
            <MiniCart />
          </Drawer>

          {/* mobile menu */}
          <div className={styles.mobileMenuContainer}>
            <Drawer
              hideCross
              top={'98px'}
              isReverse
              visible={mobileMenu}
              close={() => setMobileMenu(false)}
            >
              <MobileNavigation categoriesWithSub={categoriesWithSubFilters} close={() => setMobileMenu(false)} />
            </Drawer>
          </div>
        </div>
      )}
    </>
  );
});

export default Header;