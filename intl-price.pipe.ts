import {
  Pipe,
  PipeTransform,
  OnDestroy,
  Inject,
  LOCALE_ID
} from '@angular/core';
import { getCurrencySymbol, formatCurrency } from '@angular/common';
import { IntlPriceService } from './intl-price.service';
import { Subscription, combineLatest } from 'rxjs';
import { IntlPriceFormat } from './intl-price.interface';

/**
 * Converting Price to Currency
 * IMPROTANT: Use it smart. Impure pipe can radically slow down application
 */
@Pipe({
  name: 'intlPrice',
  pure: false
})
export class IntlPricePipe implements PipeTransform, OnDestroy {
  private value: string = '';
  private subscription: Subscription;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private intlPriceService: IntlPriceService
  ) {}

  transform(price: IntlPriceFormat): string {
    if (!price || !price.amount || !price.currency) return this.value;

    this.subscription = combineLatest(
      this.intlPriceService.rates,
      this.intlPriceService.activeCurrency
    ).subscribe(([exchangeRates, activeCurrency]) => {
      if (exchangeRates && activeCurrency.code && activeCurrency.rate) {
        const converted = this.intlPriceService.convertPrice(price, activeCurrency.code, exchangeRates);
        if (converted !== null)
          this.value = formatCurrency(
            converted,
            this.locale,
            getCurrencySymbol(activeCurrency.code, 'narrow', this.locale),
            activeCurrency.code,
            '1.0-0'
          );
      }
    });

    return this.value;
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
