import { NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { BookingListComponent } from "./bookinglist.component";


@NgModule({
    declarations:[BookingListComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,  
        HttpClientModule
    ],
    exports: [BookingListComponent]
})
export class BookingListModule{}
