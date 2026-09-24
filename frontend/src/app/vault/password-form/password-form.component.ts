import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { PasswordService } from '../../core/services/password.service';
import { CategoryService } from '../../core/services/category.service';
import { PasswordGeneratorService } from '../../core/services/password-generator.service';
import { Category } from '../../shared/models/category.model';
import { PasswordStrengthComponent } from '../../shared/components/password-strength/password-strength.component';

@Component({
    selector: 'app-password-form',
    standalone: true,
    imports: [ReactiveFormsModule, NgIf, NgFor, RouterLink, PasswordStrengthComponent],
    templateUrl: './password-form.component.html',
    styleUrl: './password-form.component.scss'
})
export class PasswordFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private passwordService = inject(PasswordService);
    private categoryService = inject(CategoryService);
    private generator = inject(PasswordGeneratorService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    categories: Category[] = [];
    editingId: number | null = null;
    isEdit = false;

    form: FormGroup = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(2)]],
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        url: [''],
        notes: [''],
        categoryId: [null]
    });

    ngOnInit(): void {
        this.categoryService.getCategories().subscribe(c => this.categories = c);
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.isEdit = true;
            this.editingId = +idParam;
            this.passwordService.getPasswordById(this.editingId).subscribe(entry => {
                if (entry) this.form.patchValue(entry);
            });
        }
    }

    get passwordValue(): string {
        return this.form.get('password')?.value ?? '';
    }

    generatePassword(): void {
        this.form.patchValue({
            password: this.generator.generatePassword({
                length: 20, useUppercase: true, useLowercase: true,
                useNumbers: true, useSymbols: true, excludeAmbiguous: true
            })
        });
    }

    onSubmit(): void {
        if (this.form.invalid) { this.form.markAllAsTouched(); return; }
        const value = this.form.value;
        const done = () => this.router.navigate(['/vault']);
        if (this.isEdit && this.editingId !== null) {
            this.passwordService.updatePassword(this.editingId, value).subscribe(done);
        } else {
            this.passwordService.createPassword(value).subscribe(done);
        }
    }
}