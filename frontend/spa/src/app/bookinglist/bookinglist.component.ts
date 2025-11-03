import { Component,  OnInit } from "@angular/core";
import { BookingService } from "./booking.service";
import {map, catchError} from 'rxjs/operators'
import { of} from 'rxjs'

interface Booking {
    id: number;
    title:string;
    type: 'EINNAHME' | 'AUSGABE';
    amount : number;
    date: string;
    category: string;
    notes?:string;
    categoryIcon?: string;
}

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-bookinglist',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './bookinglist.component.html',
    styleUrls: ["./bookinglist.component.css"]
})

export class BookingListComponent implements OnInit{
    bookings: Booking[] = []; 
    filteredBooking: Booking[] =[];
    search: string = '';
    filtertyp: string ='no-filter';
    selectedCategory?: string; 
    showNotes: {[key: number]: boolean} = {}; 

    constructor(private bookingService: BookingService) {}

    ngOnInit(): void {
        this.loadBookings();
    }

    loadBookings(): void{
        this.bookingService.getBookings()
            .pipe(map(res => res.map(b => this.addCategoryIcon(b))),
            catchError((err: any) => {
                console.error('Fehler beim laden der Buchung:', err);
                return of([]);
            }))
            .subscribe(bookings => {
                this.bookings = bookings;
                this.applyFilter();
            });
    }

    private addCategoryIcon(booking: Booking): Booking {
        const icons: {[key: string]: string} = {
    
            'GEHALT': '💰',
            'SONSTIGE_EINNAHMEN':  '💲',
            'MIETE' : '🏠',
            'NAHRUNGSMITTEL': '🍎',
            'FREIZEIT':  '✈️',
            'MOBILITAET':  '🚗',
            'VERSICHERUNGEN':  '🛡️',
            'NEBENKOSTEN':  '📅',
            'SONSTIGE_AUSGABEN':  '📑',
            'SPAREN':  '📈',
        };
        booking.categoryIcon = icons[booking.category] || '❓';
        return booking;
    }


    applyFilter(): void {
        const searchLower=this.search.toLowerCase();

        this.filteredBooking = this.bookings.filter (booking => {
            const matchesSearch = 
            booking.title.toLowerCase().includes(searchLower) ||
            (booking.notes && booking.notes.toLowerCase().includes(searchLower)) ||
            booking.category.toLowerCase(). includes(searchLower);
        

        switch(this.filtertyp){
            case 'einnahme-filter':
                return matchesSearch && booking.type=== 'EINNAHME';
            case 'ausgaben-filter':
                return matchesSearch && booking.type=== 'AUSGABE';
            case 'category-filter':
                if (!this.selectedCategory) return matchesSearch;
                return matchesSearch && booking.category === this.selectedCategory;
            default: 
                return matchesSearch;
        }
    
    })
    .sort((a,b) => {
        //Betrag Filter 
        //höchste summe zuerst
        if (this.filtertyp === 'amount-filter') {
            return b.amount -a.amount; 
        }

        // Datum-Filter  (aufsteigend)
        if(this.filtertyp === 'date-filter'){
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        return 0; 
    });
}

toggleDropdown (id:number):void{
    this.showNotes[id] = !this.showNotes[id];
}

deleteBooking(id: number): void{
    this.bookingService.deleteBooking(id)
    .pipe(
    catchError(err => {
                console.error('Fehler beim Löschen der Buchung', err);
                return of(false);
        })
    )
    .subscribe(success => {
        if (success) {
            this.bookings = this.bookings.filter(b => b.id !== id);
            this.applyFilter();
        }
    });
    
}
}