import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PasswordEntry, PasswordRequest } from '../../shared/models/password.model';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private readonly STORAGE_KEY = 'vault_mock_passwords';

  // 🔜 QUANDO SIMONE PUBBLICA LE API: sostituisci i corpi di questi metodi
  //    con chiamate HttpClient (stessa firma = i componenti non cambiano!)

  getPasswords(): Observable<PasswordEntry[]> {
    return of(this.load());
  }

  getPasswordById(id: number): Observable<PasswordEntry | undefined> {
    return of(this.load().find((p) => p.id === id));
  }

  createPassword(data: PasswordRequest): Observable<PasswordEntry> {
    const list = this.load();
    const now = new Date().toISOString();
    const entry: PasswordEntry = { ...data, id: this.nextId(list), createdAt: now, updatedAt: now };
    list.push(entry);
    this.save(list);
    return of(entry);
  }

  updatePassword(id: number, data: PasswordRequest): Observable<PasswordEntry> {
    const list = this.load();
    const i = list.findIndex((p) => p.id === id);
    if (i === -1) throw new Error('Password non trovata');
    const updated: PasswordEntry = { ...list[i], ...data, updatedAt: new Date().toISOString() };
    list[i] = updated;
    this.save(list);
    return of(updated);
  }

  deletePassword(id: number): Observable<void> {
    this.save(this.load().filter((p) => p.id !== id));
    return of(undefined);
  }

  private load(): PasswordEntry[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private save(list: PasswordEntry[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
  }

  private nextId(list: PasswordEntry[]): number {
    return list.length ? Math.max(...list.map((p) => p.id)) + 1 : 1;
  }
}
