import { Component, inject, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PasswordService } from '../../core/services/password.service';
import { CategoryService } from '../../core/services/category.service';
import { PasswordEntry } from '../../shared/models/password.model';
import { Category } from '../../shared/models/category.model';

@Component({
    selector: 'app-password-list',
    standalone: true,
    imports: [NgFor, NgIf, FormsModule, RouterLink],
    templateUrl: './password-list.component.html',
    styleUrl: './password-list.component.scss'
})
export class PasswordListComponent implements OnInit {
    private passwordService = inject(PasswordService);
    private categoryService = inject(CategoryService);

    passwords: PasswordEntry[] = [];
    categories: Category[] = [];
    search = '';
    visibleIds: Set<number> = new Set();
    copiedId: number | null = null;
    deletePendingId: number | null = null;

    ngOnInit(): void {
        this.passwordService.getPasswords().subscribe(p => this.passwords = p);
        this.categoryService.getCategories().subscribe(c => this.categories = c);
    }

    get filtered(): PasswordEntry[] {
        const q = this.search.toLowerCase().trim();
        if (!q) return this.passwords;
        return this.passwords.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.username.toLowerCase().includes(q) ||
            (p.url ?? '').toLowerCase().includes(q)
        );
    }

    categoryName(id: number | null): string {
        if (id === null) return '—';
        return this.categories.find(c => c.id === id)?.name ?? '—';
    }

    isVisible(id: number): boolean { return this.visibleIds.has(id); }

    toggleVisible(id: number): void {
        if (this.visibleIds.has(id)) this.visibleIds.delete(id);
        else this.visibleIds.add(id);
    }

    copy(entry: PasswordEntry): void {
        navigator.clipboard.writeText(entry.password).then(() => {
            this.copiedId = entry.id;
            setTimeout(() => this.copiedId = null, 1500);
        });
    }

    askDelete(id: number): void { this.deletePendingId = id; }
    cancelDelete(): void { this.deletePendingId = null; }

    onDelete(id: number): void {
        this.passwordService.deletePassword(id).subscribe(() => {
            this.passwords = this.passwords.filter(p => p.id !== id);
            this.deletePendingId = null;
        });
    }
}