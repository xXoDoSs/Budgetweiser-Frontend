import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors, FormGroup, Form, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingsService } from './settings.service';

/* Validator: prüft, ob zwei Felder übereinstimmen */
function match(controlName: string, confirmName: string) {
  return (group: AbstractControl): ValidationErrors | null => {
    const a = group.get(controlName)?.value ?? '';
    const b = group.get(confirmName)?.value ?? '';
    return a && b && a !== b ? { mismatch: true } : null;
  };
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent {
  /* State für Button */
  notifications = false;
  darkmode = false;

  /* Formulare: Passwort & E-Mail */
  pwForm: FormGroup;
  mailForm: FormGroup;

  /* einfache Benachrichtigung */
  toasts: string[] = [];

  constructor(private fb: FormBuilder, private settingsService: SettingsService) {
    // Passwort-Formular
    this.pwForm = this.fb.group({
      newPw: ['', [Validators.required, Validators.minLength(8)]],
      repeat: ['', [Validators.required]]
    }, { validators: match('newPw', 'repeat') });

    // E-Mail-Formular
    this.mailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get pwMismatch(): boolean {
  return this.pwForm.hasError('mismatch') && !!this.pwForm.get('repeat')?.touched;
}


  /* Benachrichtigung ain und ausblenden */
  toast(message: string) {
    this.toasts.push(message);
    const idx = this.toasts.length - 1;

    setTimeout(() => {
      const el = document.querySelectorAll('.toast')[idx] as HTMLElement | undefined;
      if (el) el.style.opacity = '0';
    }, 2600);

    setTimeout(() => this.toasts.splice(idx, 1), 3000);
  }

  /* Formular-Aktionen */
  savePw() {
    if (this.pwForm.invalid) return;
    this.settingsService.updatePassword(this.pwForm.value.newPw).subscribe(() => {
      this.toast('Passwort gespeichert');
      this.pwForm.reset();
    });
  }

  saveMail() {
    if (this.mailForm.invalid) return;
    this.settingsService.updateEmail(this.mailForm.value.email).subscribe(() => {
      this.toast('E-Mail gespeichert');
      this.mailForm.reset();
    });
  }

  /* Button-Aktionen (Benachrichtigungen, Darkmode) */
  toggleNotify(on: boolean) {
    this.notifications = on;
    this.settingsService.updateSettings(this.notifications, this.darkmode).subscribe(() => {
      this.toast(`Benachrichtigungen: ${on ? 'An' : 'Aus'}`);
    });
  }

  toggleDark(on: boolean) {
    this.darkmode = on;
    this.settingsService.updateSettings(this.notifications, this.darkmode).subscribe(() => {
      this.toast(on ? 'Darkmode aktiviert' : 'Lightmode aktiviert');
    });
  }

  logout() {
    this.settingsService.logout();
  }
}
