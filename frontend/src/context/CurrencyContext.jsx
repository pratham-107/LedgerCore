import React, { createContext, useContext, useState, useEffect } from 'react';

export const SUPPORTED_CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0, flag: '🇺🇸', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, flag: '🇪🇺', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.78, flag: '🇬🇧', decimals: 2 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.50, flag: '🇮🇳', decimals: 2 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 155.20, flag: '🇯🇵', decimals: 0 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rate: 1.36, flag: '🇨🇦', decimals: 2 },
  AUD: { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', rate: 1.52, flag: '🇦🇺', decimals: 2 },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 0.90, flag: '🇨🇭', decimals: 2 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 1.35, flag: '🇸🇬', decimals: 2 },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rate: 3.67, flag: '🇦🇪', decimals: 2 },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 7.24, flag: '🇨🇳', decimals: 2 },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rate: 5.40, flag: '🇧🇷', decimals: 2 },
};

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currencyCode, setCurrencyCodeState] = useState(() => {
    return localStorage.getItem('ledgercore_currency') || 'USD';
  });

  const currency = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;

  const setCurrencyCode = (code) => {
    if (SUPPORTED_CURRENCIES[code]) {
      setCurrencyCodeState(code);
      localStorage.setItem('ledgercore_currency', code);
    }
  };

  /**
   * Convert amount from base currency (USD) to target currency
   */
  const convertFromUSD = (amountUSD, targetCode = currencyCode) => {
    if (amountUSD === null || amountUSD === undefined || isNaN(amountUSD)) return 0;
    const target = SUPPORTED_CURRENCIES[targetCode] || SUPPORTED_CURRENCIES.USD;
    return amountUSD * target.rate;
  };

  /**
   * Convert amount between any two supported currencies
   */
  const convert = (amount, fromCode = 'USD', toCode = currencyCode) => {
    if (amount === null || amount === undefined || isNaN(amount)) return 0;
    const fromRate = SUPPORTED_CURRENCIES[fromCode]?.rate || 1.0;
    const toRate = SUPPORTED_CURRENCIES[toCode]?.rate || 1.0;
    // Base amount in USD
    const inUSD = amount / fromRate;
    return inUSD * toRate;
  };

  /**
   * Format any USD base amount into the active currency string
   */
  const format = (amountUSD, targetCode = currencyCode) => {
    if (amountUSD === null || amountUSD === undefined || isNaN(amountUSD)) {
      const cur = SUPPORTED_CURRENCIES[targetCode] || currency;
      return `${cur.symbol}0.00`;
    }
    const cur = SUPPORTED_CURRENCIES[targetCode] || currency;
    const converted = amountUSD * cur.rate;
    const decimals = cur.decimals ?? 2;
    
    return `${cur.symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };

  /**
   * Format an amount that is already in a specific currency without conversion
   */
  const formatRaw = (amount, code = currencyCode) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '0.00';
    const cur = SUPPORTED_CURRENCIES[code] || SUPPORTED_CURRENCIES.USD;
    const decimals = cur.decimals ?? 2;
    return `${cur.symbol}${Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyCode,
        supportedCurrencies: Object.values(SUPPORTED_CURRENCIES),
        setCurrencyCode,
        convert,
        convertFromUSD,
        format,
        formatRaw,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
