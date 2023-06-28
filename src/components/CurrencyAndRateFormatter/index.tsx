import React, { memo } from 'react';
import { CURRENCY_ENUM } from '../../models/userProfile';

const CurrencyAndRateFormatter = memo(({
  amount,
  rate = 1,
  currency = CURRENCY_ENUM.LBP,
  showOriginalCurrency = false,
}: {
    amount: number;
    rate?: number;
    currency?: CURRENCY_ENUM;
    showOriginalCurrency?: boolean;
}) => {

  const originalCurrency = currency === CURRENCY_ENUM.LBP ? CURRENCY_ENUM.USD : currency;
  const formattedPrice = rate * amount;
  return (
    <>
      <span>{currency}</span>
      <span>{' '}{formattedPrice}</span>

      {(showOriginalCurrency && formattedPrice !== amount) ? (
        <>
          <span>{' = '}{amount}</span>
          <span>{' '}{originalCurrency}</span>
        </>
      ) : <></>}
    </>
  );
});

export default CurrencyAndRateFormatter;