import { Component, Input, OnChanges } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './password-strength.component.html',
  styleUrl: './password-strength.component.scss',
})
export class PasswordStrengthComponent implements OnChanges {
  @Input() password = '';

  score = 0; // 0-4
  bits = 0;
  label = '';

  ngOnChanges(): void {
    if (!this.password) {
      this.score = 0;
      this.bits = 0;
      this.label = '';
      return;
    }
    let pool = 0;
    if (/[a-z]/.test(this.password)) pool += 26;
    if (/[A-Z]/.test(this.password)) pool += 26;
    if (/[0-9]/.test(this.password)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(this.password)) pool += 32;
    this.bits = Math.round(this.password.length * Math.log2(pool || 1));
    this.score = this.bits < 40 ? 1 : this.bits < 60 ? 2 : this.bits < 80 ? 3 : 4;
    this.label = ['', 'Debole', 'Media', 'Buona', 'Forte'][this.score];
  }
}
