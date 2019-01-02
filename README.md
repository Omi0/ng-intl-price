# Angular 6+ Internatinal Price Formatter | Converter | Currencies Selector

Uses [exchangeratesapi.io](https://exchangeratesapi.io/) as exchange rate provider. This little module allows you to do the following:
1. Get up-to-date exchange rates
2. Allow customer select their currency
3. Convert displayed prices to selected currency based on currenct exchange rates


## System Requirements

* Angular 6+

## Usage

Import the module and configure it

```
@NgModule({
  imports: [
    IntlPriceModule.forRoot({
      updateInterval?: number; // Exchange rate update interval, in ms
      baseCurrency?: IntlPriceCurrencyCode; // Your base currency code
      currencies?: IntlPriceCurrencyCode[]; // Array to currencies to load exchange rates for and to display in selector
    })
  ]
})
```

Add currencies selector component whereever you want to

```
<intl-price-selector></intl-price-selector>
```


### Display Prices

###### via Component (recommended)

Its recommended method, because its more efficient then pipe. Not going to slow down your application

```
// Template
<intl-price [price]="productPrice"></intl-price>

// Component
public productPrice: {
  amount: number;
  currency: IntlPriceCurrencyCode;
  } = {
    amount: 99.99,
    currency: USD
  }
```

###### via the Pipe

It can be used in certain places, but the more active pipes us is present the slower the application is. Especially when you change active currency.
It might be used on checkout or cart components, though.

```
// Template
{{ productPrice | intlPrice }}
```
