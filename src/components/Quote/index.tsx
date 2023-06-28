import React, { memo } from 'react';
import styles from './Quote.module.css';

interface Props{
    bgColor: string;
    title: string;
    quote: string;
}
const Quote = memo((props: Props) => {
  const { bgColor, title, quote } = props;
  return (
    <div className={styles.root} style={{ backgroundColor: bgColor }}>
      <span>{title}</span>
      <p>{quote}</p>
    </div>
  );
});

export default Quote;