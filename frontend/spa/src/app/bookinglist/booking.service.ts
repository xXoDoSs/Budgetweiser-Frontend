import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  getBookings(): Observable<Booking[]> {
    const query = `
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
      }`;
    return this.http.post<{ data: { bookings: Booking[] } }>('/graphql', { query }).pipe(
      map(res => res.data.bookings)
    );
  }

  deleteBooking(id: number): Observable<boolean> {
    const mutation = `
      mutation DeleteBooking($id: ID!) {
        deleteBooking(id: $id)
      }`;
    return this.http.post<{ data: { deleteBooking: boolean } }>('/graphql', { query: mutation, variables: { id } }).pipe(
      map(res => res.data.deleteBooking)
    );
  }
}
