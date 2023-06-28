import React, { useState, useContext, memo, useMemo } from 'react';
import styles from './sample.module.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import Accordion from '../../components/Accordion';
import AdjustItem from '../../components/AdjustItem';
import Button from '../../components/Button';
import BreadCrumbs from '../../components/BreadCrumbs';
import Container from '../../components/Container';
import Gallery from '../../components/Gallery';
import SizeList from '../../components/SizeList';
import Split from '../../components/Split';
import SwatchList from '../../components/SwatchList';

import ProductCardGrid from '../../components/ProductCardGrid';

import AddItemNotificationContext from '../../providers/AddItemNotificationProvider';
import Layout from '../../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import CircularProgressPage from '../../components/CircularProgressPage';
import { useProductState } from '../../context/productsContext';
import NotFoundComponent from '../../components/NotFoundComponent';
import { generateSizesAndColors } from '../../utils';
import { Size } from '../../models/Size';
import { Color } from '../../models/Color';
import CurrencyAndRateFormatter from '../../components/CurrencyAndRateFormatter';
import { useAuthState } from '../../context/authContext';

const ProductPage = memo(() => {
  let { itemcode } = useParams();
  const { userProfile} = useAuthState();
  const navigate = useNavigate();
  const { detailedProducts, loadingData } = useProductState();


  const ctxAddItemNotification = useContext(AddItemNotificationContext);
  const showNotification = ctxAddItemNotification.showNotification;

  const [qty, setQty] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);

  const { sampleProduct, sizes: sizeOptions, colors: colorOptions  } = useMemo(() => {
    const currentProduct = detailedProducts.find((el) => el.itemCode === itemcode);
    const { sizes, colors } = currentProduct ? generateSizesAndColors([currentProduct]) : {colors: undefined, sizes: undefined};
    return { sampleProduct: currentProduct, sizes: sizes, colors  }
  }, [detailedProducts, itemcode]);

  const [activeSize, setActiveSize] = useState<Size | undefined>(undefined);
  const [activeSwatch, setActiveSwatch] = useState<Color | undefined>(undefined);

  const { selectedGallery  } = useMemo(() => {
    const selectedGallery = sampleProduct?.galleries.find((el) => el.color.id === activeSwatch?.id && el.size.id === activeSize?.id)
    return { 
      selectedGallery
    }
  }, [sampleProduct, activeSize, activeSwatch]);

  return (
    <Layout>
      {loadingData ? (
        <CircularProgressPage />
      ) : !sampleProduct ? <NotFoundComponent/> : (
        <div className={styles.root}>
          <Container size={'large'} spacing={'min'}>
            <BreadCrumbs
              crumbs={[
                { link: '/', label: 'Home' },
                { label: 'Product' },
                { label: `${sampleProduct.title}` },
              ]}
            />
            <div className={styles.content}>
              <div className={styles.gallery}>
                <Gallery images={sampleProduct.galleries.length > 0 ? sampleProduct.galleries.map((el) => el.image) : [sampleProduct.image]} />
              </div>
              {/* in this div we should disable all clicks(chosing color, size, quantity, bcz this is only a demostration) */}
              <div className={styles.details}>
                <h1>{sampleProduct.title}</h1>
                <span className={styles.vendor}> by {sampleProduct.vendor.name}</span>

                <div className={styles.priceContainer}>
                  <span
                    className={`${sampleProduct.originalPrice !== undefined ? styles.salePrice : ''}`}
                  >
                    <CurrencyAndRateFormatter currency ={userProfile?.currency} rate ={userProfile?.rate} amount={sampleProduct.price} showOriginalCurrency/>
                  </span>
                  {sampleProduct.originalPrice && (
                    <span className={styles.originalPrice}>
                      <CurrencyAndRateFormatter currency ={userProfile?.currency} rate ={userProfile?.rate} amount={sampleProduct.originalPrice} showOriginalCurrency/>
                    </span>
                  )}
                </div>

                {colorOptions ? (
                <div>
                  <SwatchList
                    swatchList={colorOptions}
                    activeSwatch={activeSwatch}
                    setActiveSwatch={setActiveSwatch}
                  />
                  </div>
                ) : <div>No Colors found</div>}
                {sizeOptions ? (
                  <div className={styles.sizeContainer}>
                    <SizeList
                      sizeList={sizeOptions}
                      activeSize={activeSize}
                      setActiveSize={setActiveSize}
                    />
                  </div>
                ) :<div>No Sizes found</div>}

                <div className={styles.quantityContainer}>
                  <span>Quantity</span>
                  <AdjustItem qty={qty} setQty={setQty} />
                </div>

                <div className={styles.actionContainer}>
                  <div className={styles.addToButtonContainer}>
                    <Button
                      onClick={() => showNotification()}
                      fullWidth
                      level={'primary'}
                    >
                      Add to Bag
                    </Button>
                  </div>
                  <div
                    className={styles.wishlistActionContainer}
                    role={'presentation'}
                    onClick={() => setIsWishlist(!isWishlist)}
                  >
                    <FavoriteBorderIcon/>
                    <div
                      className={`${styles.heartFillContainer} ${
                        isWishlist === true ? styles.show : styles.hide
                      }`}
                    >
                      <FavoriteIcon/>
                    </div>
                  </div>
                </div>

                <div className={styles.description}>
                  <p>{sampleProduct.description}</p>
                  <span>Product code: {sampleProduct.itemCode}</span>
                </div>
                {/* ask client what he wants to put here, he might want to put 'contact inf' or 'help'*/}
                <div className={styles.informationContainer}>
                  <Accordion
                    type={'plus'}
                    customStyle={styles}
                    title={'Item Sub Code'}
                  >
                    <p className={styles.information}>
                      { selectedGallery ? selectedGallery.itemSubCode : 'No Item Found with this color and size'}
                    </p>
                  </Accordion>
                  <Accordion
                    type={'plus'}
                    customStyle={styles}
                    title={'Item Sub Original Price'}
                  >
                    <p className={styles.information}>
                      {selectedGallery ? (
                        <>
                          <span
                            className={`${selectedGallery.subOriginalPrice !== undefined ? styles.salePrice : ''}`}
                          >
                            <CurrencyAndRateFormatter currency ={userProfile?.currency} rate ={userProfile?.rate} amount={selectedGallery.subPrice} showOriginalCurrency/>
                          </span>
                          {selectedGallery?.subOriginalPrice && (
                            <span className={styles.originalPrice}>
                              <CurrencyAndRateFormatter currency ={userProfile?.currency} rate ={userProfile?.rate} amount={selectedGallery.subOriginalPrice} showOriginalCurrency/>
                            </span>
                          )}
                        </>
                      ) : 'No Item Found with this color and size'}
                    </p>
                  </Accordion>
                  <Accordion type={'plus'} customStyle={styles} title={'delivery & returns'}>
                    <p className={styles.information}>
                      Client's Delivery and Returns Policy...
                    </p>
                  </Accordion>
                </div>
              </div>
            </div>
            <div className={styles.suggestionContainer}>
              <h2>You may also like</h2>
              <ProductCardGrid
                spacing
                showSlider
                height={400}
                columns={4}
                data={detailedProducts.slice(0, 3)}
              />
            </div>
          </Container>

          <div className={styles.attributeContainer}>
            <Split
              image={'https://drive.google.com/file/d/10pX3gl3WIxAmXQsgMYQtWyQJoBgYvYFS/view?usp=sharing'}
              alt={'attribute description'}
              title={'Sustainability'}
              description={
                'We design our products to look good and to be used on a daily basis. And our aim is to inspire people to live with few timeless objects made to last. This is why quality over quantity is a cornerstone of our ethos and we have no interest in trends or seasonal collections.'
              }
              ctaText={'learn more'}
              cta={() => navigate('/blog')}
              bgColor={'var(--standard-light-grey)'}
            />
          </div>
        </div>
      )}
    </Layout>
  );
});

export default ProductPage;