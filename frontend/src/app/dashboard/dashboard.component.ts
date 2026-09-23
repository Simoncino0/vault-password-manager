import { Component, inject, OnInit } from '@angular/core';
import { NgIf, DatePipe } from '@angular/common'; // ← QUI importi DatePipe
import { AuthService } from '../core/services/auth.service';
import { CategoryService } from '../core/services/category.service';
import { User } from '../shared/models/auth.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, DatePipe], // ← QUI lo registri per il template
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private categoryService = inject(CategoryService);

  user: User | null = null;
  categoryCount: number | null = null;

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (u) => (this.user = u),
      error: () => (this.user = null),
    });

    this.categoryService.getCategories().subscribe({
      next: (cats) => (this.categoryCount = cats.length),
      error: () => (this.categoryCount = null),
    });
  }
}
