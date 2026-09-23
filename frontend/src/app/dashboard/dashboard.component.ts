import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { User } from '../shared/models/auth.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  template: `
    <div class="dashboard">
      <h1>Ciao, {{ user?.username }}! 👋</h1>
      <p>Benvenuto nel tuo Vault. La dashboard completa arriverà nella Fase 2.</p>
      <button (click)="logout()">Logout</button>
    </div>
  `,
  styles: [
    `
      .dashboard {
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
      }
      button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  user: User | null = null;

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (u) => (this.user = u),
      error: () => (this.user = null),
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
