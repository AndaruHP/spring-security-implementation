import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;
  protectedData: any = null;
  loading = true;
  error = '';
  debugInfo: string = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      console.log('Not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    this.loadProtectedData();
  }

  loadProtectedData(): void {
    this.loading = true;
    this.error = '';
    this.debugInfo = '';
    this.protectedData = null;
    
    console.log('Loading protected data...');
    
    this.http.get('/api/protected/hello').subscribe({
      next: (data: any) => {
        console.log('Data received successfully:', data);
        this.protectedData = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading data:', err);
        this.loading = false;
        
        if (err.status === 0) {
          this.error = 'Cannot connect to backend. Please make sure the server is running.';
          this.debugInfo = 'Network error - Check if backend is running on port 8080';
        } else if (err.status === 401) {
          this.error = 'Session expired. Please login again.';
          setTimeout(() => {
            this.logout();
          }, 2000);
        } else if (err.status === 403) {
          this.error = 'Access denied.';
        } else {
          this.error = `Error ${err.status}: ${err.message || 'Unknown error'}`;
        }
        
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  retry(): void {
    this.loadProtectedData();
  }
}
