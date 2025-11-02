import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private readonly graphqlUrl = environment.backendUrl + '/graphql';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Or however you store your token
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  updateEmail(newEmail: string): Observable<any> {
    const mutation = {
      query: `mutation { updateEmail(input: { newEmail: "${newEmail}" }) { id email } }`
    };
    return this.http.post(this.graphqlUrl, mutation, { headers: this.getHeaders() });
  }

  updatePassword(newPassword: string): Observable<any> {
    const mutation = {
      query: `mutation { updatePassword(input: { newPassword: "${newPassword}" }) { id } }`
    };
    return this.http.post(this.graphqlUrl, mutation, { headers: this.getHeaders() });
  }

  updateSettings(notifications: boolean, darkMode: boolean): Observable<any> {
    const mutation = {
      query: `mutation { updateSettings(input: { notifications: ${notifications}, darkMode: ${darkMode} }) { id notifications darkMode } }`
    };
    return this.http.post(this.graphqlUrl, mutation, { headers: this.getHeaders() });
  }

  logout(): void {
    localStorage.removeItem('token');
    // You might want to redirect the user to the login page here
    window.location.href = '/login';
  }
}
