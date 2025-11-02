import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';   
import { ReactiveFormsModule } from '@angular/forms';

import { SettingsComponent } from './settings';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SettingsComponent // Import the standalone component
  ],
  exports: [SettingsComponent]
})
export class SettingsModule {}
