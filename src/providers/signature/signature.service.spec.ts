import { TestBed } from '@angular/core/testing';
import { Events, ToastController, Platform } from 'ionic-angular';
import { SignatureService } from './signature.service';
import { ToastControllerMock, PlatformMock } from 'ionic-mocks';

import { StorageService } from '../natives/storage.service';
import { HTTPService } from '../global/http.service';
import { AuthenticationService } from '../auth';
import { SIGNATURE_STATUS } from '../../app/app.enums';

describe('SignatureService', () => {
  let signatureService: SignatureService;
  let storageService: StorageService;
  let storageServiceSpy: any;
  let httpService: HTTPService;
  let httpServiceSpy;
  let authenticationService: AuthenticationService;
  let authenticationSpy: any;
  let eventsSpy: any;
  let events: Events;
  let toastCtrl: ToastController;

  beforeEach(() => {
    storageServiceSpy = jasmine.createSpyObj('StorageService', ['create']);
    httpServiceSpy = jasmine.createSpyObj('HTTPService', ['saveSignature']);
    eventsSpy = jasmine.createSpyObj('Events', ['unsubscribe']);
    authenticationSpy = jasmine.createSpyObj('authenticationService', ['tokenInfo']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SignatureService,
        { provide: Events, useValue: eventsSpy },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: ToastController, useFactory: () => ToastControllerMock.instance() },
        { provide: AuthenticationService, useValue: authenticationSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: HTTPService, useValue: httpServiceSpy }
      ]
    });

    signatureService = TestBed.get(SignatureService);
    storageService = TestBed.get(StorageService);
    httpService = TestBed.get(HTTPService);
    authenticationService = TestBed.get(AuthenticationService);
    events = TestBed.get(Events);
    toastCtrl = TestBed.get(ToastController);
  });

  it('should check if saveSignature haveBeenCalled', () => {
    signatureService.signatureString = '22charsofgibberish////dGVzdA==';
    signatureService.saveSignature();
    expect(httpService.saveSignature).toHaveBeenCalled();
    expect(httpService.saveSignature).toHaveBeenCalledWith(undefined, 'dGVzdA==');
  });

  it('should save signature in storage', () => {
    signatureService.saveToStorage();
    expect(storageService.create).toHaveBeenCalled();
  });

  it('should test if events.unsubscribe haveBeenCalled', () => {
    let toast = toastCtrl.create();
    expect(toastCtrl.create).toHaveBeenCalled();
    signatureService.presentSuccessToast();
    expect(events.unsubscribe).toHaveBeenCalledWith(SIGNATURE_STATUS.SAVED);
    expect(events.unsubscribe).toHaveBeenCalledWith(SIGNATURE_STATUS.ERROR);
    expect(toast.present).toHaveBeenCalled();
  });
});
