import {DataService} from "./data.service";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {CalendarComponent} from "./calendar.component";
import {DayPilotModule} from "@daypilot/daypilot-lite-angular";
import {provideHttpClient} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import { BookingListComponent } from "../bookinglist/bookinglist.component";
import { RouterModule } from '@angular/router'; // Import RouterModule

@NgModule({
  imports:      [
    CommonModule,
    FormsModule,
    DayPilotModule,
    RouterModule.forChild([{ path: '', component: CalendarComponent }]), // Provide the route for the standalone component
    BookingListComponent
  ],

  providers:    [
    DataService,
    provideHttpClient()
  ]
})
export class CalendarModule { }