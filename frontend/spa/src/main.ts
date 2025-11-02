import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { App } from './app/app';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app.routing.module';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(App, {
  providers: [
    provideAnimations(),
    importProvidersFrom(
      BrowserModule,       
      AppRoutingModule,    
      HttpClientModule     
    )
  ]
}).catch(err => console.error(err));
