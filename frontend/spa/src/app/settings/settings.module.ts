import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';   
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './settings'; // This imports the component
import { RouterModule } from '@angular/router'; // Import RouterModule

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: SettingsComponent }]) // Provide the route for the standalone component
  ],
  // No need to export SettingsComponent if it's only used via routing
})
export class SettingsModule {}
