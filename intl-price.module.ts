import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IntlPriceSelectorComponent } from './intl-price-selector/intl-price-selector.component';
import { IntlPriceComponent } from './intl-price/intl-price.component';
import { IntlPricePipe } from './intl-price.pipe';
import { IntlPriceModuleConfig } from './intl-price.interface';

export const intlPriceModuleConfig = new InjectionToken<IntlPriceModuleConfig>('config');

@NgModule({
  declarations: [
    IntlPriceSelectorComponent,
    IntlPricePipe,
    IntlPriceComponent
  ],
  imports: [CommonModule, FormsModule],
  exports: [
    IntlPriceSelectorComponent,
    IntlPriceComponent,
    IntlPricePipe
  ]
})
export class IntlPriceModule {
  static forRoot(config: IntlPriceModuleConfig): ModuleWithProviders {
    return {
      ngModule: IntlPriceModule,
      providers: [
        {
          provide: intlPriceModuleConfig,
          useValue: config
        }
      ]
    };
  }
}
