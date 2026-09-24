import { Injectable } from '@angular/core';

export interface PasswordOptions {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  excludeAmbiguous: boolean;
}

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}<>?;:,./~';
const AMBIGUOUS = 'Il1O0o|`\'"{}[]()/\\';

@Injectable({ providedIn: 'root' })
export class PasswordGeneratorService {
  generatePassword(options: PasswordOptions): string {
    const sets: string[] = [];
    if (options.useLowercase) sets.push(this.clean(LOWER, options.excludeAmbiguous));
    if (options.useUppercase) sets.push(this.clean(UPPER, options.excludeAmbiguous));
    if (options.useNumbers) sets.push(this.clean(NUMBERS, options.excludeAmbiguous));
    if (options.useSymbols) sets.push(this.clean(SYMBOLS, options.excludeAmbiguous));

    const activeSets = sets.filter((s) => s.length > 0);
    if (activeSets.length === 0) return '';

    const charset = activeSets.join('');
    const chars: string[] = [];

    // Almeno 1 carattere per ogni set selezionato
    for (const set of activeSets) {
      chars.push(set[this.randomInt(set.length)]);
    }
    // Riempimento fino alla lunghezza richiesta
    for (let i = chars.length; i < options.length; i++) {
      chars.push(charset[this.randomInt(charset.length)]);
    }
    // Shuffle Fisher-Yates con crypto: niente posizioni prevedibili
    for (let i = chars.length - 1; i > 0; i--) {
      const j = this.randomInt(i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.slice(0, options.length).join('');
  }

  // Intero casuale in [0, max) crittografico e SENZA bias del modulo
  private randomInt(max: number): number {
    const limit = Math.floor(0x100000000 / max) * max;
    const buffer = new Uint32Array(1);
    let value: number;
    do {
      crypto.getRandomValues(buffer); // ✅ MAI Math.random()
      value = buffer[0];
    } while (value >= limit);
    return value % max;
  }

  private clean(set: string, excludeAmbiguous: boolean): string {
    if (!excludeAmbiguous) return set;
    return [...set].filter((c) => !AMBIGUOUS.includes(c)).join('');
  }
}
