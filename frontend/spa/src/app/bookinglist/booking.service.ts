import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

interface Booking {
    id: number;
    title: string;
    type: 'EINNAHME' | 'AUSGABE';
    amount: number;
    date: string;
    category: string;
    notes?: string;
    categoryIcon?: string;
}

const GET_BOOKINGS = gql`
  query {
    bookings {
      id
      title
      amount
      type
      date
      category
      notes
    }
  }
`;

const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: ID!) {
    deleteBooking(id: $id)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private apollo: Apollo) { }

  getBookings(): Observable<Booking[]> {
    return this.apollo.watchQuery<{ bookings: Booking[] }>({
      query: GET_BOOKINGS
    }).valueChanges.pipe(
      map(result => {
        if (result.data && result.data.bookings) {
          return result.data.bookings.filter(b => b).map(b => b as Booking);
        }
        return [];
      })
    );
  }

  deleteBooking(id: number): Observable<boolean> {
    return this.apollo.mutate<{ deleteBooking: boolean }>({
      mutation: DELETE_BOOKING,
      variables: { id }
    }).pipe(map(result => {
      if (result.data) {
        return result.data.deleteBooking;
      }
      return false;
    }));
  }
}
