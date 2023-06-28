import React, { memo } from 'react';
import styles from './Highlight.module.css';
import { Link } from 'react-router-dom';
import { extractImageSrcFromUrlAsUC } from '../../utils';

var NotFoundImage = require('../../static/not-found.png');

interface Props {
    image: string;
    altImage: string;
    miniImage: string;
    miniImageAlt: string;
    title: string;
    description: string;
    textLink: string;
    link: string;
}
const Highlight = memo((props: Props) => {
  const {
    image,
    altImage,
    miniImage,
    miniImageAlt,
    title,
    description,
    textLink,
    link,
  } = props;

  return (
    <div className={styles.root}>
      <img alt={altImage} src={extractImageSrcFromUrlAsUC(image) || NotFoundImage} className={styles.highlightImage} />
      <div className={styles.contentContainer}>
        <h3>{title}</h3>
        <p>{description}</p>
        <Link to={link}>{textLink}</Link>
        <img
          className={styles.miniImage}
          alt={miniImageAlt}
          src={extractImageSrcFromUrlAsUC(miniImage) || NotFoundImage}
        ></img>
      </div>
    </div>
  );
});

export default Highlight;