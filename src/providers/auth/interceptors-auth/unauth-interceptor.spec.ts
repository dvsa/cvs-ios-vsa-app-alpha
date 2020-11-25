import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CallNumber } from '@ionic-native/call-number';
import { AlertController } from 'ionic-angular';
import { AlertControllerMock } from 'ionic-mocks';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { UnauthInterceptor } from './unauth-interceptor';
import { AppAlertService } from '../../global/app-alert.service';
import { STATUS_CODE } from '../../../app/app.enums';

describe('UnauthInterceptor', () => {
  let unAuthInterceptor: UnauthInterceptor;
  let appAlertService: AppAlertService;

  const API_URL = '/test-stations';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UnauthInterceptor,
        AppAlertService,
        CallNumber,
        { provide: AlertController, useFactory: () => AlertControllerMock.instance() }
      ]
    });

    unAuthInterceptor = TestBed.get(UnauthInterceptor);
    appAlertService = TestBed.get(AppAlertService);
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
          const errorResponse = new HttpErrorResponse({
            status: STATUS_CODE.UNAUTHORIZED,
            statusText: 'test-status-error'
          });
          return Observable.throw(errorResponse);
        }
      };
    });

    it('should call alertUnAuthorise if the request is not authorised ', fakeAsync(() => {
      const requestMock: HttpRequest<any> = new HttpRequest<any>('GET', `${API_URL}`);
      spyOn(appAlertService, 'alertUnAuthorise');

      unAuthInterceptor
        .intercept(requestMock, nextMock)
        .pipe(take(1))
        .subscribe(
          (next) => {},
          (error: HttpErrorResponse) => {
            expect(error.statusText).toEqual('test-status-error');
          }
        );

      tick();

      expect(updatedReq.url).toEqual(API_URL);
      expect(appAlertService.alertUnAuthorise).toHaveBeenCalled();
    }));
  });
});
