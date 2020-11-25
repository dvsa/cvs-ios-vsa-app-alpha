import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { STATUS_CODE } from '../../../app/app.enums';
import { RetryInterceptor } from './retry-interceptor';

describe('RetryInterceptor', () => {
  let retryInterceptor: RetryInterceptor;

  const API_URL = '/test-stations';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RetryInterceptor]
    });

    retryInterceptor = TestBed.get(RetryInterceptor);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('intercept', () => {
    let nextMock: any;
    let requestMock: HttpRequest<any>;
    let updatedReq: HttpRequest<any>;

    beforeEach(() => {
      requestMock = new HttpRequest<any>('GET', `${API_URL}`);

      nextMock = {
        handle: (req: HttpRequest<any>) => {
          updatedReq = req;
          const errorResponse = new HttpErrorResponse({
            status: STATUS_CODE.UNAUTHORIZED,
            statusText: 'test-status-error'
          });
          return Observable.throw(errorResponse);
        }
      };
    });

    it('should not attempt request retry if response status code is 401 ', fakeAsync(() => {
      retryInterceptor
        .intercept(requestMock, nextMock)
        .pipe(take(1))
        .subscribe(
          (next) => {},
          (error: HttpErrorResponse) => {
            expect(error.statusText).toEqual('test-status-error');
          }
        );

      tick();
    }));

    it('should attempt request retry if response status code is 403 ', fakeAsync(() => {
      const next403Mock = {
        handle: (req: HttpRequest<any>) => {
          updatedReq = req;
          const errorResponse = new HttpErrorResponse({
            status: STATUS_CODE.FORBIDDEN,
            statusText: 'test-status-error'
          });
          return Observable.throw(errorResponse);
        }
      };

      retryInterceptor
        .intercept(requestMock, next403Mock)
        .pipe(take(1))
        .subscribe(
          (next) => {},
          (error: HttpErrorResponse) => {
            expect(error.statusText).toEqual('test-status-error');
          }
        );

      tick(3000);
      tick(3000);
    }));
  });
});
