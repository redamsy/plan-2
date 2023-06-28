import { Filter } from "../components/CardController";
import { Color } from "../models/Color";
import { CategoriesWithSub, DetailedProduct } from "../models/Product";
import { Size } from "../models/Size";

export const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );


// const GoogleDrivePublicImageUrl = 'https://drive.google.com/file/d/1IEnoQRH8mv5NqFNuQ8PWL2YGlnL1pl8Y/view?usp=sharing';  // this can be usp=drive_link or usp=sharing
// const imageId = '1IEnoQRH8mv5NqFNuQ8PWL2YGlnL1pl8Y';
// const imageSrc = `https://drive.google.com/thumbnail?id=${imageId}`;
enum IMAGE_TYPE {
  uc = 'uc', //high quality
  thumbnail = 'thumbnail', //low quality
}
export function extractImageSrcFromUrlAsUC(GoogleDrivePublicImageUrl: string | undefined | null): string | undefined {
  if(GoogleDrivePublicImageUrl) {
    const fileIdMatch = GoogleDrivePublicImageUrl.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    if (fileIdMatch && fileIdMatch[1]) {
      const imageId = fileIdMatch[1];
      const imageSrc = `https://drive.google.com/${IMAGE_TYPE.uc}?id=${imageId}`;
      return imageSrc;
    }
  }
  return undefined; // Return undefined if the image source couldn't be extracted
}
export function extractImageSrcFromUrlAsThumbnail(GoogleDrivePublicImageUrl: string | undefined | null): string | undefined {
  if(GoogleDrivePublicImageUrl) {
    const fileIdMatch = GoogleDrivePublicImageUrl.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    if (fileIdMatch && fileIdMatch[1]) {
      const imageId = fileIdMatch[1];
      const imageSrc = `https://drive.google.com/${IMAGE_TYPE.thumbnail}?id=${imageId}`;
      return imageSrc;
    }
  }
  return undefined; // Return undefined if the image source couldn't be extracted
}

export function isObjectEmpty(obj: Record<string, string>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Is value numeric
 * 
 * Determine whether variable is a number
 * 
 * @param {*} str 
 *
  import { isNumeric } from '../helpers/general'

  isNumeric(value)
*/
export function isNumeric(str: any) {
  if (['string', 'number'].indexOf(typeof str) === -1) return false; // we only process strings and numbers!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

export function generateCategoriesWithSub(detailedProducts: DetailedProduct[]) {
  const categoriesWithSub: CategoriesWithSub[] = [];

  detailedProducts.forEach((product) => {
    product.pSCCs.forEach((pSCC) => {
      const { category, subCategory } = pSCC;

      // Check if the category already exists in categoriesWithSub
      const existingCategory = categoriesWithSub.find((item) => item.category.id === category.id);

      if (existingCategory) {
        // Category already exists, check if the subCategory exists in its subCategories array
        const existingSubCategory = existingCategory.subCategories.find((subCat) => subCat.id === subCategory.id);

        if (!existingSubCategory) {
          // SubCategory doesn't exist, add it to the subCategories array
          existingCategory.subCategories.push(subCategory);
        }
      } else {
        // Category doesn't exist, create a new entry in categoriesWithSub with the subCategory
        categoriesWithSub.push({
          category,
          subCategories: [subCategory],
        });
      }
    });
  });
  return categoriesWithSub;
}
export function generateSizesAndColors(detailedProducts: DetailedProduct[]): { sizes: Size[], colors: Color[] } {
  const sizesMap: Record<string, Size> = {};
  const colorsMap: Record<string, Color> = {};

  detailedProducts.forEach((product) => {
    product.galleries.forEach((gallery) => {
      sizesMap[gallery.size.id] = gallery.size;
      colorsMap[gallery.color.id] = gallery.color;
    });
  });

  const sizes = Object.values(sizesMap);
  const colors = Object.values(colorsMap);

  return { sizes, colors };
}

export const generateFilteredProducts = (filterState: Filter[], detailedProducts: DetailedProduct[]): DetailedProduct[] => {
  const sCategories: string[] = filterState.filter((el) => el.category === 'categories')[0].items.filter((el) => el.value).map(el => el.name);
  const sSizes: string[] = filterState.filter((el) => el.category === 'sizes')[0].items.filter((el) => el.value).map(el => el.name);
  const sColors: string[] = filterState.filter((el) => el.category === 'colors')[0].items.filter((el) => el.value).map(el => el.name);

  // if nothing is selected return all
  if(sCategories.length === 0 && sSizes.length === 0 && sColors.length === 0) return detailedProducts;

  return detailedProducts.filter((product) => {
    const { pSCCs, galleries } = product;

    const categoryMatch = sCategories.length === 0 || pSCCs.some((pSCC) =>
      sCategories.some(
        (sCategory) => sCategory === pSCC.category.name
      )
    );

    const sizeColorMatch = galleries.some((gallery) => 
      (sSizes.length === 0 || sSizes.some((el) => el === gallery.size.name))
      && (sColors.length === 0 || sColors.some((el) => el === gallery.color.name))
    );

    return categoryMatch && sizeColorMatch;
  });
};

