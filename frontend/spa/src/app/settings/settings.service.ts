import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

const UPDATE_EMAIL = gql`
  mutation UpdateEmail($newEmail: String!) {
    updateEmail(input: { newEmail: $newEmail }) {
      id
      email
    }
  }
`;

const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($newPassword: String!) {
    updatePassword(input: { newPassword: $newPassword }) {
      id
    }
  }
`;

const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($notifications: Boolean!, $darkMode: Boolean!) {
    updateSettings(input: { notifications: $notifications, darkMode: $darkMode }) {
      id
      notifications
      darkMode
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private apollo: Apollo) { }

  updateEmail(newEmail: string): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_EMAIL,
      variables: { newEmail }
    }).pipe(map(result => result.data));
  }

  updatePassword(newPassword: string): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_PASSWORD,
      variables: { newPassword }
    }).pipe(map(result => result.data));
  }

  updateSettings(notifications: boolean, darkMode: boolean): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_SETTINGS,
      variables: { notifications, darkMode }
    }).pipe(map(result => result.data));
  }

  logout(): void {
    localStorage.removeItem('token');
    // You might want to redirect the user to the login page here
    window.location.href = '/login';
  }
}
