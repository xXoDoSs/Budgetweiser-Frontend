import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  async loadConfig() {
    try {
      this.config = await firstValueFrom(this.http.get('/config'));
    } catch {
      this.config = { backendUrl: 'http://localhost:8080' };
    }
    return this.config;
  }

  get backendUrl() { return this.config?.backendUrl; }
}