import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';   
import { ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardComponent } from './dashboard'; // This imports the component
import { RouterModule } from '@angular/router'; // Import RouterModule

@NgModule({
  imports: [
    CommonModule,          
    ReactiveFormsModule,
    NgxChartsModule,
    RouterModule.forChild([{ path: '', component: DashboardComponent }]) // Provide the route for the standalone component
  ],
  // No need to export DashboardComponent if it's only used via routing
})
export class DashboardModule {}