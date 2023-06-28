import productJson from '../assets/product.json';
import blogJson from '../assets/blog.json';
/**

*/
function generateMockProductData(count: number, tag: string) {
  const products = productJson;
  const filtered = products.filter((item) => item.tags.includes(tag));
  return filtered.slice(0, count);
}

function generateMockBlogData(count: number) {
  return blogJson.slice(0, count);
}

export { generateMockProductData, generateMockBlogData };