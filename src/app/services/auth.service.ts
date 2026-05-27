import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginCredentials, SignupData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'bookworm_users';
  private readonly CURRENT_USER_KEY = 'bookworm_current_user';
  
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private router: Router) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
    if (userJson) {
      const user = JSON.parse(userJson);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    }
  }

  private getUsers(): User[] {
    const usersJson = localStorage.getItem(this.STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }

  login(credentials: LoginCredentials): { success: boolean; message: string } {
    const users = this.getUsers();
    const user = users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      // Don't store password in current user session
      const { password, ...userWithoutPassword } = user;
      this.currentUser.set(userWithoutPassword);
      this.isAuthenticated.set(true);
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return { success: true, message: 'Login successful' };
    }

    return { success: false, message: 'Invalid email or password' };
  }

  signup(data: SignupData): { success: boolean; message: string } {
    const users = this.getUsers();
    
    // Check if user already exists
    if (users.some(u => u.email === data.email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      password: data.password
    };

    users.push(newUser);
    this.saveUsers(users);

    // Auto login after signup
    const { password, ...userWithoutPassword } = newUser;
    this.currentUser.set(userWithoutPassword);
    this.isAuthenticated.set(true);
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

    return { success: true, message: 'Account created successfully' };
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}

// Made with Bob
