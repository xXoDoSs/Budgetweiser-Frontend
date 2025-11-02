import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {map} from "rxjs/operators";
import {DayPilot} from "@daypilot/daypilot-lite-angular";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root' })
export class DataService {

  private readonly graphqlUrl = environment.backendUrl + '/graphql';

  static colors = {
    green: "#6aa84f",
    yellow: "#f1c232",
    red: "#cc4125",
    gray: "#808080",
    blue: "#2e78d6",
  };

  constructor(private http : HttpClient){
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Or however you store your token
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {
    const query = {
      query: `{
        bookings {
          id
          title
          date
          amount
          type
        }
      }`
    };

    return this.http.post<any>(this.graphqlUrl, query, { headers: this.getHeaders() }).pipe(
      map(response => {
        if (response.data && response.data.bookings) {
          return response.data.bookings.map((booking: any) => {
            return {
              id: booking.id,
              text: `${booking.title} (${booking.amount} €)`,
              start: new DayPilot.Date(booking.date),
              end: new DayPilot.Date(booking.date),
              backColor: booking.type === 'EINNAHME' ? DataService.colors.green : DataService.colors.red
            };
          });
        } else {
          return [];
        }
      })
    );
  }

  getColors(): any[] {
      const colors = [
        {name: "Green", id: DataService.colors.green},
        {name: "Yellow", id: DataService.colors.yellow},
        {name: "Red", id: DataService.colors.red},
        {name: "Gray", id: DataService.colors.gray},
        {name: "Blue", id: DataService.colors.blue},
      ];
      return colors;
  }

}