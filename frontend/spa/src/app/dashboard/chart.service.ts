import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private baseUrl = environment.backendUrl + '/api/charts';

  constructor(private http: HttpClient) { }

  getExpensesByCategory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/expenses-by-category`);
  }

  getIncomeVsExpenses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/income-vs-expenses`);
  }

  getSavingsTrend(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/savings-trend`);
  }
}
