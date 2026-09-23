import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../shared/models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);

  categories: Category[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  createForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
  });

  editingCategory: Category | null = null;
  editForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
  });

  deletePendingId: number | null = null;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Errore nel caricamento delle categorie.';
      },
    });
  }

  onCreate(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    this.categoryService.createCategory(this.createForm.value).subscribe({
      next: (created) => {
        this.categories.push(created);
        this.createForm.reset();
        this.showSuccess(`Categoria "${created.name}" creata!`);
      },
      error: (err: HttpErrorResponse) => this.handleApiError(err, this.createForm),
    });
  }

  startEdit(category: Category): void {
    this.editingCategory = category;
    this.editForm.patchValue({ name: category.name });
  }

  cancelEdit(): void {
    this.editingCategory = null;
    this.editForm.reset();
  }

  onUpdate(): void {
    if (!this.editingCategory || this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.categoryService.updateCategory(this.editingCategory.id, this.editForm.value).subscribe({
      next: (updated) => {
        const i = this.categories.findIndex((c) => c.id === updated.id);
        if (i !== -1) this.categories[i] = updated;
        this.cancelEdit();
        this.showSuccess('Categoria aggiornata!');
      },
      error: (err: HttpErrorResponse) => this.handleApiError(err, this.editForm),
    });
  }

  askDelete(category: Category): void {
    this.deletePendingId = category.id;
  }

  cancelDelete(): void {
    this.deletePendingId = null;
  }

  onDelete(category: Category): void {
    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {
        this.categories = this.categories.filter((c) => c.id !== category.id);
        this.deletePendingId = null;
        this.showSuccess(`Categoria "${category.name}" eliminata.`);
      },
      error: (err: HttpErrorResponse) => {
        this.deletePendingId = null;
        this.errorMessage = err.error?.error || "Errore durante l'eliminazione.";
      },
    });
  }

  private handleApiError(err: HttpErrorResponse, form: FormGroup): void {
    if (err.error?.fields) {
      Object.keys(err.error.fields).forEach((field) => {
        form.get(field)?.setErrors({ apiError: err.error.fields[field] });
      });
    } else {
      this.errorMessage = err.error?.error || 'Errore nella richiesta.';
    }
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => (this.successMessage = null), 3000);
  }
}
