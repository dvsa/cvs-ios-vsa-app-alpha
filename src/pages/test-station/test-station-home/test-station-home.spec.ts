import { TestStationHomePage } from './test-station-home';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController, IonicModule, NavController } from 'ionic-angular';
import { AppService } from '../../../providers/global/app.service';
import { StorageService } from '../../../providers/natives/storage.service';
import { VisitService } from '../../../providers/visit/visit.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AuthService } from '../../../providers/global/auth.service';
import { CallNumber } from '@ionic-native/call-number';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StorageServiceMock } from '../../../../test-config/services-mocks/storage-service.mock';
import { VisitServiceMock } from '../../../../test-config/services-mocks/visit-service.mock';
import { AuthServiceMock } from '../../../../test-config/services-mocks/auth-service.mock';
import { AlertControllerMock } from 'ionic-mocks';
import { PAGE_NAMES } from '../../../app/app.enums';
import { Store } from '@ngrx/store';
import { NetworkStateProvider } from '../../../modules/logs/network-state.service';
import { TestStore } from '../../../providers/interceptors/auth.interceptor.spec';
import { AppServiceMock } from '../../../../test-config/services-mocks/app-service.mock';
import { FirebaseLogsService } from '../../../providers/firebase-logs/firebase-logs.service';
import { FirebaseLogsServiceMock } from '../../../../test-config/services-mocks/firebaseLogsService.mock';
import { SyncService } from '../../../providers/global/sync.service';
import { LogsProvider } from '../../../modules/logs/logs.service';

describe('Component: TestStationHomePage', () => {
  let comp: TestStationHomePage;
  let fixture: ComponentFixture<TestStationHomePage>;
  let navCtrl: NavController;
  let appService: AppServiceMock;
  let storageService: StorageService;
  let visitService: VisitService;
  let screenOrientation: ScreenOrientation;
  let screenOrientationSpy: ScreenOrientation;
  let authService: AuthService;
  let alertCtrl: AlertController;
  let callNumber: CallNumber;
  let callNumberSpy: any;
  let navCtrlSpy: any;
  let networkStateProvider: NetworkStateProvider;
  let networkStateProviderSpy: any;
  let firebaseLogsService: FirebaseLogsService;
  let syncService: SyncService;
  let syncServiceSpy: any;
  let logProvider: LogsProvider;
  let logProviderSpy: any;

  beforeEach(async(() => {
    navCtrlSpy = jasmine.createSpyObj('NavController', ['push']);
    callNumberSpy = jasmine.createSpyObj('CallNumber', ['callNumber']);
    screenOrientationSpy = jasmine.createSpyObj('ScreenOrientation', ['lock']);
    networkStateProviderSpy = jasmine.createSpyObj('NetworkStateProvider', [
      'initialiseNetworkState'
    ]);
    syncServiceSpy = jasmine.createSpyObj('SyncService', {
      startSync: [null, true]
    });

    logProviderSpy = jasmine.createSpyObj('LogsProvider', {
      dispatchLog: () => true
    });

    TestBed.configureTestingModule({
      declarations: [TestStationHomePage],
      imports: [IonicModule.forRoot(TestStationHomePage)],
      providers: [
        { provide: NavController, useValue: navCtrlSpy },
        { provide: AppService, useClass: AppServiceMock },
        { provide: StorageService, useClass: StorageServiceMock },
        { provide: VisitService, useClass: VisitServiceMock },
        { provide: ScreenOrientation, useValue: screenOrientationSpy },
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: Store, useClass: TestStore },
        { provide: FirebaseLogsService, useClass: FirebaseLogsServiceMock },
        { provide: AlertController, useFactory: () => AlertControllerMock.instance() },
        { provide: CallNumber, useValue: callNumberSpy },
        { provide: NetworkStateProvider, useValue: networkStateProviderSpy },
        { provide: SyncService, useValue: syncServiceSpy },
        { provide: LogsProvider, useValue: logProviderSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestStationHomePage);
    comp = fixture.componentInstance;
    navCtrl = TestBed.get(NavController);
    appService = TestBed.get(AppService);
    storageService = TestBed.get(StorageService);
    visitService = TestBed.get(VisitService);
    screenOrientation = TestBed.get(ScreenOrientation);
    authService = TestBed.get(AuthService);
    alertCtrl = TestBed.get(AlertController);
    callNumber = TestBed.get(CallNumber);
    networkStateProvider = TestBed.get(NetworkStateProvider);
    firebaseLogsService = TestBed.get(FirebaseLogsService);
    syncService = TestBed.get(SyncService);
    logProvider = TestBed.get(LogsProvider);
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
    appService = null;
    storageService = null;
    visitService = null;
    screenOrientation = null;
    authService = null;
    alertCtrl = null;
    callNumber = null;
    callNumberSpy = null;
    screenOrientationSpy = null;
    networkStateProvider = null;
    syncService = null;
  });

  it('should create component', (done) => {
    expect(fixture).toBeTruthy();
    expect(comp).toBeTruthy();
    done();
  });

  it('should check if appService.enableCache has been called', () => {
    spyOn(appService, 'enableCache');
    comp.enableCache();
    expect(appService.enableCache).toHaveBeenCalled();
  });

  it('should check the ngOnInit logic', () => {
    comp.ngOnInit();
    expect(networkStateProvider.initialiseNetworkState).toHaveBeenCalled();
    expect(callNumber.callNumber).not.toHaveBeenCalled();
    expect(screenOrientation.lock).not.toHaveBeenCalled();
    expect(alertCtrl.create).toHaveBeenCalled();
  });

  it('should test ionViewDidEnter logic', () => {
    spyOn(firebaseLogsService, 'setScreenName');
    comp.ionViewDidEnter();
    expect(firebaseLogsService.setScreenName).toHaveBeenCalled();
  });

  it('should test getStarted flow', async () => {
    await comp.getStarted();

    expect(syncService.startSync).toHaveBeenCalled();
    expect(navCtrl.push).toHaveBeenCalledWith(PAGE_NAMES.TEST_STATION_SEARCH_PAGE);

    appService.isCordova = true;
    appService.isSignatureRegistered = true;
    comp.getStarted();
    expect(navCtrl.push).toHaveBeenCalledWith(PAGE_NAMES.TEST_STATION_SEARCH_PAGE);
  });
});
