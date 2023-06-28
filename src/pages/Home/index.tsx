import React, {  useCallback, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Button } from '@mui/material';

import AttributeGrid from '../../components/AttributeGrid';
import Container from '../../components/Container';
import Hero from '../../components/Hero';
import BlogPreviewGrid from '../../components/BlogPreviewGrid';
import Highlight from '../../components/Highlight';
import Layout from '../../components/Layout';
import ProductCollectionGrid from '../../components/ProductCollectionGrid';
import ProductCardGrid from '../../components/ProductCardGrid';
import Quote from '../../components/Quote';
import Title from '../../components/Title';

import { generateMockBlogData } from '../../utils/mock';

import styles from './Home.module.css';
import CircularProgressPage from '../../components/CircularProgressPage';
import { useProductState } from '../../context/productsContext';
import { DetailedProduct } from '../../models/Product';
import EditFirstContainer, { IFirstContainerAttributes } from './EditFirstContainer';
import { usePageActions, usePageState } from '../../context/pagesContext';
import { SectionPayload } from '../../models/Page';
import { useAuthState } from '../../context/authContext';
import EditSocialMediaContainer, { ISocialMediaContainerAttributes } from './EditSocialMediaContainer';
import { extractImageSrcFromUrlAsUC } from '../../utils';

var NotFoundImage = require('../../static/not-found.png');

export enum PAGE_SLUG_ENUM {
  HOME= 'HOME',
  ABOUT= 'ABOUT',
  CONTACT_US= 'CONTACT_US',
};

export enum SECTION_NAME_ENUM {
  FIRST_CONTAINER= 'FIRST_CONTAINER',
  SOCIAL_MEDIA_CONTAINER= 'SOCIAL_MEDIA_CONTAINER',
  PROMOTION_CONTAINER= 'PROMOTION_CONTAINER',
};

const IndexPage = () => {
  const { isAuthenticated } = useAuthState();
  const navigate = useNavigate();
  const { detailedProducts, loadingData, categoriesWithSubFilters } = useProductState();
  const { pages, loadingData: loadingPageData, isCreating, isUpdating } = usePageState();
  const pageActions = usePageActions();

  const newArrivals = useMemo(() => generateNewArrivals(detailedProducts), [detailedProducts]);

  const blogData = generateMockBlogData(3);

  const [isEditingFirstContainer, setEditingFirstContainer] = useState(false);
  const [isEditingPromotionContainer, setEditingPromotionContainer] = useState(false);
  const [isEditingSocialMediaContainer, setEditingSocialMediaContainer] = useState(false);
  
  const goToShop = () => {
    navigate('/shop');
  };
  const readMore = () => {
    navigate('/about');
  };

  const {
    pageId,
    sections,
    firstContainerSectionId,
    socialMediaContainerSectionId,
    promotionContainerSectionId,
    firstContainerAttributesObject,
    socialMediaContainerAttributesObject,
    promotionContainerAttributesObject,
  } = useMemo(() => {
    const pageData = pages.find((p) => p.slug === PAGE_SLUG_ENUM.HOME);

    const firstContainerSection = pageData?.sections.find((s) => s.name === SECTION_NAME_ENUM.FIRST_CONTAINER);
    const socialMediaContainerSection = pageData?.sections.find((s) => s.name === SECTION_NAME_ENUM.SOCIAL_MEDIA_CONTAINER);
    const promotionContainerSection = pageData?.sections.find((s) => s.name === SECTION_NAME_ENUM.PROMOTION_CONTAINER);

    const firstContainerAttributesOb: Partial<IFirstContainerAttributes> = {};
    firstContainerSection?.attributes.forEach((attribute) => {
      firstContainerAttributesOb[attribute.name as keyof Partial<IFirstContainerAttributes>] = attribute.value;
    });
    const socialMediaContainerAttributesOb: Partial<ISocialMediaContainerAttributes> = {};
    socialMediaContainerSection?.attributes.forEach((attribute) => {
      socialMediaContainerAttributesOb[attribute.name as keyof Partial<ISocialMediaContainerAttributes>] = attribute.value;
    });
    const promotionContainerAttributesOb: Partial<IFirstContainerAttributes> = {};//have same attributes as firstContainer(but different value)
    promotionContainerSection?.attributes.forEach((attribute) => {
      promotionContainerAttributesOb[attribute.name as keyof Partial<IFirstContainerAttributes>] = attribute.value;
    });

    return {
      pageId: pageData?.id,
      sections: pageData?.sections,
      firstContainerSectionId: firstContainerSection?.id,
      socialMediaContainerSectionId: socialMediaContainerSection?.id,
      promotionContainerSectionId: promotionContainerSection?.id,
      firstContainerAttributesObject: firstContainerAttributesOb,
      socialMediaContainerAttributesObject: socialMediaContainerAttributesOb,
      promotionContainerAttributesObject: promotionContainerAttributesOb,
    }
  },[pages]);

  const createOrUpdate = useCallback( async (payload: SectionPayload, sectionDataId?: string) => {
    if(pageId) {
      let sectionPayload: SectionPayload[] = [];
      if(sections) {
        const existingSection = sections.find((s) => s.id === sectionDataId);
        if(existingSection) {
          sectionPayload = sections.filter((s) => s.id === sectionDataId).map((s) => ({
            name: s.name,
            attributes: s.attributes.map((a) => ({name: a.name, value: a.value})),
          }));
          sectionPayload.push(payload);
        } else {
          sectionPayload = sections.map((s) => ({
            name: s.name,
            attributes: s.attributes.map((a) => ({name: a.name, value: a.value})),
          }));
          sectionPayload.push(payload)
        }
      } else {
        sectionPayload = [payload]
      }  

      pageActions.updateCurrentPage({
        id: pageId,
        slug: PAGE_SLUG_ENUM.HOME,
        sections:  sectionPayload,
      });
    } else {
      pageActions.createNewPage({
        slug: PAGE_SLUG_ENUM.HOME,
        sections: [payload]
      });
    }
  },[pageId, pageActions, sections])

  const FirstContainer = () => {
    //       {/* <Hero
    //         maxWidth={'500px'}
    //         image={'/banner1.png'}
    //         title={'Essentials for a cold winter'}
    //         subtitle={'Discover Autumn Winter 2021'}
    //         ctaText={'shop now'}
    //         ctaAction={goToShop}
    //       /> */}
    if(isEditingFirstContainer && isAuthenticated) {
      return (
        <>
          {firstContainerSectionId ? (
            <EditFirstContainer
              maxWidth={'500px'}
              sectionDataId={firstContainerSectionId}
              sectionName={SECTION_NAME_ENUM.FIRST_CONTAINER}
              firstContainerAttributesObject={firstContainerAttributesObject}
              createOrUpdate={(payload, sectionDataId) => createOrUpdate(payload, sectionDataId)}
              onCancel={()=> setEditingFirstContainer(false)}
              isCreatingOrUpdating={isUpdating}
            />
          ) : (
            <EditFirstContainer
              maxWidth={'500px'}
              sectionName={SECTION_NAME_ENUM.FIRST_CONTAINER}
              createOrUpdate={(payload) => createOrUpdate(payload)}
              onCancel={()=> setEditingFirstContainer(false)}
              isCreatingOrUpdating={isCreating}
            />
          )}
        </>
      )
    }
    return (
      <div className={styles.container}>
        {isAuthenticated ? (
          <Button
            variant="outlined"
            onClick={()=> setEditingFirstContainer(true)}
            startIcon={<EditOutlinedIcon fontSize="inherit" />}
            className={styles.firstContainerEditButton}
          >
            Edit
          </Button>
        ) : <></>}
        <div className={styles.hoverEditFirstContainer}>
          <Hero
            maxWidth={'500px'}
            image={firstContainerAttributesObject.image}
            title={firstContainerAttributesObject.title}
            subtitle={firstContainerAttributesObject.subtitle}
            ctaText={'shop now'}
            ctaAction={goToShop}
          />
        </div>
      </div>
    )
  };
  const PromotionContainer = () => {
      // <Hero
      //   image={'/banner3.png'}
      //   title={'We are Sustainable'}
      //   subtitle={
      //     'From caring for our land to supporting our people, discover the steps we’re taking to do more for the world around us.'
      //   }
      //   ctaText={'read more'}
      //   maxWidth={'660px'}
      //   ctaStyle={styles.ctaCustomButton}
      // />
    if(isEditingPromotionContainer && isAuthenticated) {
      return (
        <>
          {promotionContainerSectionId ? (
            <EditFirstContainer
              maxWidth={'660px'}
              ctaStyle={styles.ctaCustomButton}
              sectionDataId={promotionContainerSectionId}
              sectionName={SECTION_NAME_ENUM.PROMOTION_CONTAINER}
              firstContainerAttributesObject={promotionContainerAttributesObject}
              createOrUpdate={(payload, sectionDataId) => createOrUpdate(payload, sectionDataId)}
              onCancel={()=> setEditingPromotionContainer(false)}
              isCreatingOrUpdating={isUpdating}
            />
          ) : (
            <EditFirstContainer
              maxWidth={'660px'}
              ctaStyle={styles.ctaCustomButton}
              sectionName={SECTION_NAME_ENUM.PROMOTION_CONTAINER}
              createOrUpdate={(payload) => createOrUpdate(payload)}
              onCancel={()=> setEditingPromotionContainer(false)}
              isCreatingOrUpdating={isCreating}
            />
          )}
        </>
      )
    }
    return (
      <div className={styles.container}>
        {isAuthenticated ? (
          <Button
            variant="outlined"
            onClick={()=> setEditingPromotionContainer(true)}
            startIcon={<EditOutlinedIcon fontSize="inherit" />}
            className={styles.promotionContainerEditButton}
          >
            Edit
          </Button>
        ) : <></>}
        <div className={styles.hoverEditPromotionContainer}>
          <Hero
            maxWidth={'660px'}
            ctaStyle={styles.ctaCustomButton}
            image={promotionContainerAttributesObject.image}
            title={promotionContainerAttributesObject.title}
            subtitle={promotionContainerAttributesObject.subtitle}
            ctaText={'read more'}
            ctaAction={readMore}
          />
        </div>
      </div>
    )
  };
  const SocialMediaContainer = () => {
  //   <div className={styles.socialContainer}>
  //   <Title
  //     name={'Styled by You'}
  //     subtitle={'Tag @sydney to be featured.'}
  //   />
  //   <div className={styles.socialContentGrid}>
  //     <img src={`/social/socialMedia1.png`} alt={'social media 1'} />
  //     <img src={`/social/socialMedia2.png`} alt={'social media 2'} />
  //     <img src={`/social/socialMedia3.png`} alt={'social media 3'} />
  //     <img src={`/social/socialMedia4.png`} alt={'social media 4'} />
  //   </div>
  // </div>
    if(isEditingSocialMediaContainer && isAuthenticated) {
      return (
        <div className={styles.container}>
          {socialMediaContainerSectionId ? (
            <EditSocialMediaContainer
              sectionDataId={socialMediaContainerSectionId}
              sectionName={SECTION_NAME_ENUM.SOCIAL_MEDIA_CONTAINER}
              socialMediaContainerAttributesObject={socialMediaContainerAttributesObject}
              createOrUpdate={(payload, sectionDataId) => createOrUpdate(payload, sectionDataId)}
              onCancel={()=> setEditingSocialMediaContainer(false)}
              isCreatingOrUpdating={isUpdating}
            />
          ) : (
            <EditSocialMediaContainer
              sectionName={SECTION_NAME_ENUM.SOCIAL_MEDIA_CONTAINER}
              createOrUpdate={(payload) => createOrUpdate(payload)}
              onCancel={()=> setEditingSocialMediaContainer(false)}
              isCreatingOrUpdating={isCreating}
            />
          )}
        </div>
      )
    }

    return (
      <div className={styles.container}>
        {isAuthenticated ? (
          <Button
            variant="outlined"
            onClick={()=> setEditingSocialMediaContainer(true)}
            startIcon={<EditOutlinedIcon fontSize="inherit" />}
            className={styles.socialMediaContainerEditButton}
          >
            Edit
          </Button>
        ) : <></>}
        <div className={styles.hoverEditSocialMediaContainer}>
          {/* pictures from instagram maybe */}
          {/* Social Media */}
          <Title
            name={socialMediaContainerAttributesObject.name}
            subtitle={socialMediaContainerAttributesObject.subtitle}
          />
          <div className={styles.socialContentGrid}>
            <img src={extractImageSrcFromUrlAsUC(socialMediaContainerAttributesObject?.image1) || NotFoundImage} alt={'social media 1'} />
            <img src={extractImageSrcFromUrlAsUC(socialMediaContainerAttributesObject?.image2) || NotFoundImage} alt={'social media 2'} />
            <img src={extractImageSrcFromUrlAsUC(socialMediaContainerAttributesObject?.image3) || NotFoundImage} alt={'social media 3'} />
            <img src={extractImageSrcFromUrlAsUC(socialMediaContainerAttributesObject?.image4) || NotFoundImage} alt={'social media 4'} />
          </div>
        </div>
      </div>
    )
  };
  return (
    <Layout disablePaddingBottom>
      {loadingData || loadingPageData ? (
        <CircularProgressPage />
      ) : (
        <>
          {/* Hero Container */}
          <FirstContainer/>
          
          {/* Message Container */}
          <div className={styles.messageContainer}>
            <p>
              This is a demonstration of the Sydney theme for verse by{' '}
              <span className={styles.gold}>matter design.</span>
            </p>
            <p>
              wear by <span className={styles.gold}>sunspel</span> and{' '}
              <span className={styles.gold}>scotch&soda</span>
            </p>
          </div>

          {/* Collection Container */}
          <div className={styles.collectionContainer}>
            <Container size={'large'}>
              <Title name={'New Collection'} />
              <ProductCollectionGrid />
            </Container>
          </div>

          {/* New Arrivals */}
          <div className={styles.newArrivalsContainer}>
            <Container>
              <Title name={'New Arrivals'} link={'/shop'} textLink={'view all'} />
              <ProductCardGrid
                spacing={true}
                showSlider
                height={480}
                columns={3}
                data={newArrivals}
              />
            </Container>
          </div>

          {/* Highlight  */}
          <div className={styles.highlightContainer}>
            <Container size={'large'} fullMobile>
              <Highlight
                image={'https://drive.google.com/file/d/1_MxYtlgkPsJaO7iBVyd1FtLAeMYjaKFq/view?usp=sharing'}
                altImage={'highlight image'}
                miniImage={'https://drive.google.com/file/d/1YZTSwby2FTJDn9Ux9ptSxaaa2QNdi6dh/view?usp=sharing'}
                miniImageAlt={'mini highlight image'}
                title={'Luxury Knitwear'}
                description={`This soft lambswool jumper is knitted in Scotland, using yarn from one of the world's oldest spinners based in Fife`}
                textLink={'shop now'}
                link={'/shop'}
              />
            </Container>
          </div>

          {/* Promotion */}
          <div className={styles.promotionContainer}>
            <Hero
              image={'https://drive.google.com/file/d/1x9543mg8j0vBTirLkhFm1WP4889TL5IZ/view?usp=sharing'}
              title={`-50% off \n All Essentials`}
            />
            {loadingData ?
              <></>
            :
              <div className={styles.linkContainers}>
                {categoriesWithSubFilters.slice(0, 2).map((cat, index) => (
                  <span key={index}>
                    <Link to={`/shop/${cat.category.name}`}>{cat.category.name}</Link>
                  </span>
                ))}
              </div>
            }
          </div>

          {/* Quote */}
          <Quote
            bgColor={'var(--standard-light-grey)'}
            title={'about Sydney'}
            quote={
              '“We believe in two things: the pursuit of quality in everything we do, and looking after one another. Everything else should take care of itself.”'
            }
          />

          {/* Blog Grid */}
          <div className={styles.blogsContainer}>
            <Container size={'large'}>
              <Title name={'Journal'} subtitle={'Notes on life and style'} />
              <BlogPreviewGrid data={blogData} />
            </Container>
          </div>

          {/* Promotion */}
          <div className={styles.sustainableContainer}>
            <PromotionContainer />
          </div>

          {/* Social Media */}
          <div className={styles.socialContainer}>
            <SocialMediaContainer />
          </div>
          
          <AttributeGrid />
        </>
      )}
    </Layout>
  );
};

export default IndexPage;

function generateNewArrivals(detailedProducts: DetailedProduct[]): DetailedProduct[] {
  // TODO: sort(by createdAt) then get 3 products from productState
  return detailedProducts.slice(0, 3);
}
