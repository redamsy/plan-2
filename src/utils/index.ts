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
