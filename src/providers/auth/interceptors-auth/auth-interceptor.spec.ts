import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators';

import { AuthInterceptorService } from './auth-interceptor';
import { AuthenticationService } from './../authentication/authentication.service';
import { AuthenticationServiceMock } from '../../../../test-config/services-mocks/authentication-service.mock';

describe('AuthInterceptorService', () => {
  let authInterceptor: AuthInterceptorService;
  let authenticateService: AuthenticationService;

  const API_URL = '/test-stations';
  const AUTH_HEADER_KEY = 'Authorization';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthInterceptorService,
        { provide: AuthenticationService, useClass: AuthenticationServiceMock }
      ]
    });

    authInterceptor = TestBed.get(AuthInterceptorService);
    authenticateService = TestBed.get(AuthenticationService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('intercept', () => {
    let nextMock: any;
    let updatedReq: HttpRequest<any>;

    beforeEach(() => {
      nextMock = {
        handle: (req: HttpRequest<any>) => {
          updatedReq = req;
          return of(updatedReq);
        }
      };
    });

    it('should add bearer token to the request header', fakeAsync(() => {
      const requestMock: HttpRequest<any> = new HttpRequest<any>('GET', `${API_URL}`);

      authInterceptor
        .intercept(requestMock, nextMock)
        .pipe(take(1))
        .subscribe();

      tick();

      expect(updatedReq.url).toEqual(API_URL);
      expect(updatedReq.headers.has(AUTH_HEADER_KEY)).toBeTruthy();
      expect(updatedReq.headers.get(AUTH_HEADER_KEY)).toEqual(
        `Bearer ${authenticateService.tokenInfo.token}`
      );
    }));

    it('should not proceed with the request observable if url is missing', fakeAsync(() => {
      const requestMock: HttpRequest<any> = new HttpRequest<any>('GET', '');
      spyOn(nextMock, 'handle');

      authInterceptor
        .intercept(requestMock, nextMock)
        .pipe(take(1))
        .subscribe();

      tick();

      expect(nextMock.handle).not.toHaveBeenCalled();
    }));

    it('should not proceed with the request observable if auth status is falsy', fakeAsync(() => {
      const requestMock: HttpRequest<any> = new HttpRequest<any>('GET', API_URL);
      spyOn(nextMock, 'handle');
      spyOn(authenticateService, 'checkUserAuthStatus').and.returnValue(Promise.resolve(false));

      authInterceptor
        .intercept(requestMock, nextMock)
        .pipe(take(1))
        .subscribe();

      tick();

      expect(nextMock.handle).not.toHaveBeenCalled();
    }));
  });
});
