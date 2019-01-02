import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  LOCALE_ID,
  Input
} from '@angular/core';
import { getCurrencySymbol, formatCurrency } from '@angular/common';
import { IntlPriceService } from '../intl-price.service';
import { Subscription, combineLatest } from 'rxjs';
import { MoltinProductMetaPrice } from '../../interfaces/product.interface';
import { HelpersService } from '@core/helpers/helpers.service';

@Component({
  selector: 'intl-price',
  templateUrl: './intl-price.component.html',
  styleUrls: ['./intl-price.component.scss']
})
export class IntlPriceComponent implements OnInit, OnDestroy {
  @Input()
  private price: MoltinProductMetaPrice;

  private subscription: Subscription;
  public formattedPrice: string = '';

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private intlPriceService: IntlPriceService,
    private helpers: HelpersService
  ) {}

  ngOnInit() {
    this.subscription = combineLatest(
      this.intlPriceService.rates,
      this.intlPriceService.activeCurrency
    ).subscribe(([exchangeRates, currencyInfo]) => {
      if (exchangeRates && currencyInfo.code && currencyInfo.rate) {
        const converted = this.intlPriceService.convertPrice(
          this.price,
          currencyInfo.code,
          exchangeRates
        );
        if (converted !== null)
          this.formattedPrice = formatCurrency(
            converted,
            this.locale,
            getCurrencySymbol(currencyInfo.code, 'narrow', this.locale),
            currencyInfo.code,
            '1.0-0'
          );
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
