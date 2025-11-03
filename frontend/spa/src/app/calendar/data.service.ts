import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DayPilot } from "@daypilot/daypilot-lite-angular";
import { Apollo, gql } from 'apollo-angular';

const GET_EVENTS = gql`
  query GetBookings {
    bookings {
      id
      title
      date
      amount
      type
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  static colors = {
    green: "#6aa84f",
    yellow: "#f1c232",
    red: "#cc4125",
    gray: "#808080",
    blue: "#2e78d6",
  };

  constructor(private apollo: Apollo) {
  }

  getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {
    return this.apollo.watchQuery<any>({
      query: GET_EVENTS
    }).valueChanges.pipe(
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
      { name: "Green", id: DataService.colors.green },
      { name: "Yellow", id: DataService.colors.yellow },
      { name: "Red", id: DataService.colors.red },
      { name: "Gray", id: DataService.colors.gray },
      { name: "Blue", id: DataService.colors.blue },
    ];
    return colors;
  }

}