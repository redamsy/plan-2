import React, { memo } from 'react';
import styles from './Checkbox.module.css';

interface Props {
    value: string;
    label: string;
    id: string;
    name: string;
    action:(e: React.ChangeEvent<HTMLInputElement>) => void
    isChecked?: boolean;
    size?: string;
}
const Checkbox = memo((props: Props) => {
  const { value, label, id, name, action, isChecked, size = 'md' } = props;
  return (
    <div className={styles.checkboxWrapper}>
      <div className={styles.inputWrapper}>
        <input
          type="checkbox"
          className={styles.input}
          id={id}
          value={value}
          name={name}
          data-label={label}
          onChange={(e) => action(e)}
          checked={isChecked}
        />
        <span
          className={`${styles.box} ${styles[size]}`}
          role="presentation"
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          <span className={styles.innerBox}></span>
        </span>
      </div>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
    </div>
  );
});

export default Checkbox;