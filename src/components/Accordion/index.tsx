import React, { useState, memo } from 'react';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import styles from './Accordion.module.css';

interface Props {
  children: React.ReactNode;
  title: string;
  type?: string;
  customStyle: any;
}

const Accordion = memo((props: Props) => {
  const { title, type = 'caret', customStyle, children } = props;

  const [open, setOpen] = useState(false);

  const combinedStyling = { ...styles, ...customStyle };

  const icon =
    type === 'caret' ? (
      <KeyboardArrowDownOutlinedIcon/>
    ) : (
      <>{open === true ? <RemoveOutlinedIcon/> : <AddOutlinedIcon/>}</>
    );

  return (
    <div className={combinedStyling.accordionRoot}>
      <div
        className={`${combinedStyling.accordionHeader}`}
        role={'presentation'}
        onClick={() => setOpen(!open)}
      >
        <span
          className={`${combinedStyling.accordionTitle} ${combinedStyling.uppercase}`}
        >
          {title}
        </span>
        <div
          className={`${combinedStyling.iconContainer} ${
            open === true ? styles.rotate : ''
          }`}
        >
          {icon}
        </div>
      </div>
      <div
        className={`${styles.accordionContent} ${
          open === true ? styles.show : styles.hide
        }`}
      >
        {children}
      </div>
    </div>
  );
});

export default Accordion;