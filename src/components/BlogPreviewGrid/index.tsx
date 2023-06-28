import React, { memo } from 'react';
import styles from './BlogPreviewGrid.module.css';

import BlogPreview from '../BlogPreview';

interface Props {
    data: {
        title: string;
        category: string;
        alt: string;
        image: string;
        link: string;
        excerpt: string;
    }[];
    // hideReadMoreOnWeb,
    showExcerpt?: boolean;
}
const BlogPreviewGrid = memo((props: Props) => {
  const { data, showExcerpt } = props;
  return (
    <div className={styles.root}>
      {data &&
        data.map((blog, index) => {
          return (
            <BlogPreview
              key={index}
              image={blog.image}
              altImage={blog.alt}
              title={blog.title}
              link={blog.link}
              category={blog.category}
              excerpt={blog.excerpt}
            //   hideReadMoreOnWeb={hideReadMoreOnWeb}
              showExcerpt={showExcerpt}
            />
          );
        })}
    </div>
  );
});

export default BlogPreviewGrid;