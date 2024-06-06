import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token')
  const header = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
  return next(header);
};
