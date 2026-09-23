import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordStrengthComponent } from '../shared/components/password-strength/password-strength.component';

export interface PasswordOptions {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  excludeAmbiguous: boolean;
}

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, PasswordStrengthComponent],
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
})
export class GeneratorComponent implements OnInit {
  password = '';
  copied = false;
  options: PasswordOptions = {
    length: 16,
    useUppercase: true,
    useLowercase: true,
    useNumbers: true,
    useSymbols: true,
    excludeAmbiguous: true,
  };

  private readonly UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly LOWER = 'abcdefghijklmnopqrstuvwxyz';
  private readonly NUMBERS = '0123456789';
  private readonly SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  private readonly AMBIGUOUS = 'l1IO0o';

  ngOnInit(): void {
    this.generate();
  }

  generate(): void {
    this.copied = false;
    let pool = '';
    if (this.options.useUppercase) pool += this.UPPER;
    if (this.options.useLowercase) pool += this.LOWER;
    if (this.options.useNumbers) pool += this.NUMBERS;
    if (this.options.useSymbols) pool += this.SYMBOLS;
    if (this.options.excludeAmbiguous) {
      pool = pool
        .split('')
        .filter((c) => !this.AMBIGUOUS.includes(c))
        .join('');
    }
    if (!pool) {
      pool = this.LOWER;
    }
    const values = new Uint32Array(this.options.length);
    crypto.getRandomValues(values);
    this.password = Array.from(values, (v) => pool[v % pool.length]).join('');
  }

  copy(): void {
    navigator.clipboard.writeText(this.password).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }
}
