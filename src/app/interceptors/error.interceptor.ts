import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req:HttpRequest<unknown>, next:HttpHandlerFn) : Observable<HttpEvent<unknown>> => {
  
  
  return next(req).pipe(
    catchError((error:HttpErrorResponse)=>{
      let errorMsg='An unknown error occured!';

      if (error.error instanceof ErrorEvent) {
        errorMsg = `Error: ${error.error.message}`;
      }
      else {
        switch (error.status) {
          case 400:
            errorMsg = 'Bad request';
            break;
          case 404:
            errorMsg = 'Resource not found';
            break;
          case 500:
            errorMsg = 'Internal server error';
            break;
        }
      }
      
      return throwError(()=>new Error(errorMsg));
    })
  );
  
};
