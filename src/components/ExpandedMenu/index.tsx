import React, { memo } from 'react';

import styles from './ExpandedMenu.module.css';
import { Link, useLocation } from 'react-router-dom';
import { CategoriesWithSub } from '../../models/Product';
import { extractImageSrcFromUrlAsUC } from '../../utils';

var NotFoundImage = require('../../static/not-found.png');

const ExpandedMenu = memo((props: { menu: CategoriesWithSub[];}) => {
  const { menu } = props;

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

  if (menu.length === 0) return <React.Fragment />;
  return (
    <div className={styles.root}>
      <div className={styles.linkContainers}>
        {menu.map((item, index) => {
          return (
            <div key={index} className={styles.categoryContainer}>
              <span className={styles.categoryName}>{item.category.name}</span>
              <ul>
                {item.subCategories.map((link, linkIndex) => {
                  return (
                    <li key={linkIndex}>
                      <Link className={styles.menuLink} to={`${filterPathName}/${item.category.name}/${link.name}`}>
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      <div className={styles.imageContainer}>
        <img src={extractImageSrcFromUrlAsUC('https://drive.google.com/file/d/13Y8Sgt5Db-FNcFFmGvpfnrlHxybocuQ4/view?usp=sharing') || NotFoundImage} alt={'header 1'}></img>
        <img src={extractImageSrcFromUrlAsUC('https://drive.google.com/file/d/1pxMFZO41MZoXLmiwXwEmap-g1bfOKTT_/view?usp=sharing') || NotFoundImage} alt={'header 2'}></img>
      </div>
    </div>
  );
});

export default ExpandedMenu;