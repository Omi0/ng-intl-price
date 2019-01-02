export interface IntlPriceModuleConfig {
  updateInterval?: number;
  baseCurrency?: IntlPriceCurrencyCode;
  currencies?: IntlPriceCurrencyCode[];
}

export type IntlPriceExchangeRates = {
  rates: { [key in IntlPriceCurrencyCode]?: number };
  base: IntlPriceCurrencyCode;
  date: string;
};

export interface IntlPriceActiveCurrencyInfo {
  code: IntlPriceCurrencyCode;
  date: string;
  rate: number;
}

export interface IntlPriceFormat {
  amount: number;
  currency: IntlPriceCurrencyCode;
}

export declare type IntlPriceCurrencyCode =
  | 'BGN'
  | 'CAD'
  | 'BRL'
  | 'HUF'
  | 'DKK'
  | 'JPY'
  | 'ILS'
  | 'TRY'
  | 'RON'
  | 'GBP'
  | 'PHP'
  | 'HRK'
  | 'NOK'
  | 'ZAR'
  | 'MXN'
  | 'AUD'
  | 'USD'
  | 'KRW'
  | 'HKD'
  | 'EUR'
  | 'ISK'
  | 'CZK'
  | 'THB'
  | 'MYR'
  | 'NZD'
  | 'PLN'
  | 'CHF'
  | 'SEK'
  | 'CNY'
  | 'SGD'
  | 'INR'
  | 'IDR'
  | 'RUB';
