import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { IntlPriceService } from '../intl-price.service';
import { Subscription, combineLatest } from 'rxjs';
import { IntlPriceCurrencyCode } from '../intl-price.interface';
import { take } from 'rxjs/operators';

@Component({
  selector: 'intl-price-selector',
  templateUrl: './intl-price-selector.component.html',
  styleUrls: ['./intl-price-selector.component.scss']
})
export class IntlPriceSelectorComponent implements OnInit, OnDestroy {
  @Output()
  private onChange = new EventEmitter<IntlPriceCurrencyCode>();
  private subscription: Subscription;

  public exchangeRates: { code: IntlPriceCurrencyCode; rate: number }[];
  public activeCurrency: IntlPriceCurrencyCode;

  constructor(private intlPriceService: IntlPriceService) {}

  ngOnInit() {
    this.subscription = combineLatest(
      this.intlPriceService.rates,
      this.intlPriceService.activeCurrency
    ).subscribe(([exchangeRates, currencyInfo]) => {
      this.exchangeRates = Object.keys(exchangeRates.rates).map(
        (key: IntlPriceCurrencyCode) => {
          return { code: key, rate: exchangeRates.rates[key] };
        }
      );
      this.activeCurrency = currencyInfo.code;
    });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  setActiveCurrency(code: IntlPriceCurrencyCode): void {
    this.intlPriceService
      .updateActiveCurrency(code)
      .pipe(take(1))
      .subscribe();
    this.onChange.emit(code);
  }
}
