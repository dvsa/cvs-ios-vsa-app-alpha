import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retryWhen, tap } from 'rxjs/operators';

import { genericRetryStrategy } from '../../utils/rxjs.utils';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {}),
      retryWhen(genericRetryStrategy())
    );
  }

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return next.handle(req).pipe(
  //     filter((event) => {
  //       if (event instanceof HttpErrorResponse && event.status === STATUS_CODE.FORBIDDEN) {
  //         return true;
  //       } else {
  //         console.log(event, req);
  //       }
  //     }),
  //     // filter(
  //     //   (event) => event instanceof HttpErrorResponse && event.status === STATUS_CODE.FORBIDDEN
  //     // ),
  //     retryWhen(genericRetryStrategy()),
  //     catchError((error: HttpErrorResponse) => {
  //       this.logProvider.dispatchLog({
  //         type: 'error in retry-interceptor.ts',
  //         message: `User ${
  //           this.authentication.tokenInfo.testerId
  //         } - request is unsuccessful after allowed number tries - Url: ${JSON.stringify(
  //           error.url
  //         )}`,
  //         timestamp: Date.now()
  //       });

  //       return Observable.throw(error);
  //     })
  //   );
  // }
}
