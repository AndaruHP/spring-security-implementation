import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoginRequest, RegisterRequest, LoginResponse, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api';
  private backendUrl = 'http://localhost:8080';
  private tokenKey = 'jwt_token';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedToken = localStorage.getItem(this.tokenKey);
    console.log('AuthService init, storedToken exists:', !!storedToken);
    
    if (storedToken) {
      const decoded = this.decodeToken(storedToken);
      console.log('Decoded user from storage:', decoded);
    }
    
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedToken ? this.decodeToken(storedToken) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('Login called');
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Login response received');
          if (response.accessToken) {
            localStorage.setItem(this.tokenKey, response.accessToken);
            console.log('Token saved');
          }
        }),
        map(response => {
          if (response.accessToken) {
            const decoded = this.decodeToken(response.accessToken);
            console.log('Login - Decoded user:', decoded);
            this.currentUserSubject.next(decoded);
          }
          return response;
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getGoogleLoginUrl(): string {
    return `${this.backendUrl}/oauth2/authorization/google`;
  }

  getGithubLoginUrl(): string {
    return `${this.backendUrl}/oauth2/authorization/github`;
  }

  handleOAuth2Callback(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    const decoded = this.decodeToken(token);
    console.log('OAuth2 - Decoded user:', decoded);
    this.currentUserSubject.next(decoded);
  }

  private decodeToken(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      console.log('Authorities from token:', payload.authorities);
      
      // Handle authorities format
      let authorities: string[] = ['ROLE_USER'];
      
      if (payload.authorities && Array.isArray(payload.authorities)) {
        authorities = payload.authorities.map((auth: any) => {
          if (auth && typeof auth === 'object' && auth.authority) {
            return auth.authority;
          }
          return String(auth);
        });
      }
      
      console.log('Processed authorities:', authorities);
      
      return {
        username: payload.sub,
        authorities: authorities
      };
    } catch (e) {
      console.error('Error decoding token:', e);
      return { username: 'unknown', authorities: ['ROLE_USER'] };
    }
  }
}
