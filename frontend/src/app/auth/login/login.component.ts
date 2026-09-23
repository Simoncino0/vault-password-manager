import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  globalError: string | null = null;
  isLoading = false;

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.globalError = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
        this.router.navigate([returnUrl]);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        const fieldErrors = this.authService.extractValidationErrors(err);

        if (fieldErrors) {
          // Applica errori ai singoli campi del form
          Object.keys(fieldErrors).forEach((field) => {
            this.loginForm.get(field)?.setErrors({ apiError: fieldErrors[field] });
          });
        } else {
          this.globalError = err.error?.error || 'Credenziali non valide o errore del server.';
        }
      },
    });
  }
}
