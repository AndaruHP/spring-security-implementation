import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  console.log('Interceptor called for:', req.url);
  console.log('Token exists:', !!token);
  
  if (token) {
    console.log('Attaching token to request');
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Request headers:', req.headers.get('Authorization')?.substring(0, 50) + '...');
  } else {
    console.warn('No token found in localStorage!');
  }
  
  return next(req);
};
