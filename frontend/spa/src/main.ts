import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { App } from './app/app';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { ConfigService } from './app/config.service';
import { APP_INITIALIZER } from '@angular/core';

async function initializeApp(configService: ConfigService) {
  await configService.loadConfig();
}

bootstrapApplication(App, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    importProvidersFrom(
      BrowserModule,
      HttpClientModule
    ),
    ConfigService, // Provide the ConfigService
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigService) => () => initializeApp(configService),
      deps: [ConfigService],
      multi: true
    }
  ]
}).catch(err => console.error(err));
