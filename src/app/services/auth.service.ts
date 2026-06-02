import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { User, LoginCredentials, SignupData } from '../models/user.model';
import { environment } from '../../environments/environment';

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'bookworm_token';
  private readonly CURRENT_USER_KEY = 'bookworm_current_user';
  
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
    const token = localStorage.getItem(this.TOKEN_KEY);
    
    if (userJson && token) {
      const user = JSON.parse(userJson);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    }
  }

  login(credentials: LoginCredentials): Observable<{ success: boolean; message: string }> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            // Store token and user
            localStorage.setItem(this.TOKEN_KEY, token);
            localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
            
            // Update signals
            this.currentUser.set(user);
            this.isAuthenticated.set(true);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return of({ 
            success: false, 
            message: error.error?.message || 'Login failed. Please try again.' 
          });
        })
      );
  }

  signup(data: SignupData): Observable<{ success: boolean; message: string }> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            // Store token and user
            localStorage.setItem(this.TOKEN_KEY, token);
            localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
            
            // Update signals
            this.currentUser.set(user);
            this.isAuthenticated.set(true);
          }
        }),
        catchError(error => {
          console.error('Signup error:', error);
          return of({ 
            success: false, 
            message: error.error?.message || 'Signup failed. Please try again.' 
          });
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {})
      .pipe(
        tap(() => {
          this.clearAuthData();
        }),
        catchError(error => {
          console.error('Logout error:', error);
          // Clear auth data even if API call fails
          this.clearAuthData();
          return of(null);
        })
      );
  }

  private clearAuthData(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}

// Made with Bob
