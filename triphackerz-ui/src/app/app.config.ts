import {ApplicationConfig, InjectionToken, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {environment} from '../environment/environment';
import {AppConfig} from './models/app-config.model';

export const APP_CONFIG = new InjectionToken<AppConfig>('App Config');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_CONFIG,
      useValue: environment as AppConfig
    }
  ]
};
