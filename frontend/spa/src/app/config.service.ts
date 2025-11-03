import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient, @Inject(APP_BASE_HREF) private baseHref: string) {}

  async loadConfig() {
    const configUrl = this.baseHref === '/' ? '/config' : `${this.baseHref}config`;
    try {
      this.config = await firstValueFrom(this.http.get(configUrl));
    } catch (error) {
      console.error('Error loading configuration:', error);
      this.config = { backendUrl: 'http://localhost:8080' };
    }
    return this.config;
  }

  get backendUrl() { return this.config?.backendUrl; }
}