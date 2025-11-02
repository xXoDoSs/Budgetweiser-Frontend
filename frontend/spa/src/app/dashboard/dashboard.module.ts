import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';   
import { ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DashboardComponent } from './dashboard';

@NgModule({
  imports: [
    CommonModule,          
    ReactiveFormsModule,
    NgxChartsModule,
    DashboardComponent // Import the standalone component
  ],
  exports: [DashboardComponent]  
})
export class DashboardModule {}