import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './BlogPreview.module.css';
import { extractImageSrcFromUrlAsUC } from '../../utils';

var NotFoundImage = require('../../static/not-found.png');

interface Props {
    image: string;
    altImage: string;
    title: string;
    link: string;
    category: string;
    showExcerpt?: boolean;
    excerpt: string;
}
const BlogPreview = memo((props: Props) => {
    const navigate = useNavigate();
  const { image, altImage, title, link, category, showExcerpt, excerpt } =
    props;

  const handleClick = () => {
    navigate(link);
  };

  return (
    /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
    <div className={styles.root} onClick={handleClick}>
      <img
        className={styles.blogPreviewImage}
        alt={altImage}
        src={extractImageSrcFromUrlAsUC(image) || NotFoundImage}
        role={'figure'}
      />
      <span className={styles.category}>{category}</span>
      <h4 className={styles.title}>
        <Link to={link}>{title}</Link>
      </h4>
      {showExcerpt && <p className={styles.excerpt}>{excerpt}</p>}
    </div>
  );
});

export default BlogPreview;