import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  IntlPriceCurrencyCode,
  IntlPriceModuleConfig,
  IntlPriceExchangeRates,
  IntlPriceActiveCurrencyInfo,
  IntlPriceFormat
} from './intl-price.interface';
import {
  Observable,
  ConnectableObservable,
  BehaviorSubject,
  interval
} from 'rxjs';
import {
  map,
  take,
  shareReplay,
  switchMap,
  startWith,
  retryWhen,
  delay
} from 'rxjs/operators';
import { intlPriceModuleConfig } from './intl-price.module';

@Injectable({
  providedIn: 'root'
})
export class IntlPriceService {
  private _config: IntlPriceModuleConfig = {
    baseCurrency: 'GBP',
    updateInterval: 1000 * 60 * 60 * 3
  };
  private activeCurrencySubject = new BehaviorSubject<IntlPriceCurrencyCode>(
    this._config.baseCurrency
  );

  private rates$: ConnectableObservable<IntlPriceExchangeRates> = interval(
    this._config.updateInterval
  ).pipe(
    startWith(this.loadRates()),
    switchMap(_ => this.loadRates()),
    shareReplay(1)
  ) as ConnectableObservable<IntlPriceExchangeRates>;

  constructor(
    @Inject(intlPriceModuleConfig) private config: IntlPriceModuleConfig,
    private http: HttpClient
  ) {
    Object.assign(this._config, config);
  }

  /**
   * Fetchin data from exchangeratesapi.io
   * 
   * @return Observable<IntlPriceExchangeRates>
   */
  private loadRates(): Observable<IntlPriceExchangeRates> {
    let params = new HttpParams();
    if (this._config.baseCurrency)
      params.set('base', this._config.baseCurrency);
    if (this._config.currencies)
      params.set('symbols', this._config.currencies.join(','));

    return this.http
      .get<IntlPriceExchangeRates>('//api.exchangeratesapi.io/latest', {
        params: params
      })
      .pipe(
        startWith({
          rates: {
            [this._config.baseCurrency]: 1
          },
          base: this._config.baseCurrency,
          date: new Date().toString()
        }),
        retryWhen(errors => errors.pipe(delay(1000)))
      );
  }

  /**
   * Getting Exchange Rates
   *
   * @returns ConnectableObservable<IntlPriceExchangeRates>
   */
  get rates(): ConnectableObservable<IntlPriceExchangeRates> {
    return this.rates$;
  }

  /**
   * Getting Active Currency
   *
   * @returns Observable<IntlPriceCurrencyCode>
   */
  private getActiveCurrency(): Observable<IntlPriceCurrencyCode> {
    return this.activeCurrencySubject.asObservable().pipe(
      switchMap(_ =>
        this.rates$.pipe(
          map(exchangeRates => {
            const activeCurrency = localStorage.getItem(
              'config::active_currency'
            ) as IntlPriceCurrencyCode;
            if (activeCurrency && exchangeRates.rates[activeCurrency])
              return activeCurrency;
            else {
              return this._config.baseCurrency;
            }
          })
        )
      )
    );
  }

  /**
   * Getting Active Currency Info
   *
   * @returns Observable<IntlPriceActiveCurrencyInfo>
   */
  get activeCurrency(): Observable<IntlPriceActiveCurrencyInfo> {
    return this.getActiveCurrency().pipe(
      switchMap(currencyCode =>
        this.rates$.pipe(
          map(exchangeRates => {
            return {
              code: currencyCode,
              date: exchangeRates.date,
              rate: exchangeRates[currencyCode]
            };
          })
        )
      )
    );
  }

  /**
   * Updating Active Currency
   *
   * @returns Observable<boolean>
   */
  updateActiveCurrency(code: IntlPriceCurrencyCode): Observable<boolean> {
    return this.rates$.pipe(
      take(1),
      map(exchangeRates => {
        if (exchangeRates[code]) {
          localStorage.setItem('config::active_currency', code);
          this.activeCurrencySubject.next(code);
          return true;
        } else {
          localStorage.removeItem('config::active_currency');
          this.activeCurrencySubject.next(this._config.baseCurrency);
          return false;
        }
      })
    );
  }

  convertPrice(
    price: IntlPriceFormat,
    currency: IntlPriceCurrencyCode,
    exchangeRates: IntlPriceExchangeRates
  ): number {
    if (!price.amount || !price.currency || !currency) return null;

    if (exchangeRates.rates[price.currency] || exchangeRates.rates[currency])
      throw new Error(
        'Unable to convert price, currencies do not set propertly'
      );

    return (
      (price.amount / exchangeRates.rates[price.currency]) *
      exchangeRates.rates[currency]
    );
  }
}
