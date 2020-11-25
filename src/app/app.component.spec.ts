import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, Events, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { Network } from '@ionic-native/network';
import { Store } from '@ngrx/store';

import { MyApp } from './app.component';
import { StorageService } from '../providers/natives/storage.service';
import { StorageServiceMock } from '../../test-config/services-mocks/storage-service.mock';
import { SyncService } from '../providers/global/sync.service';
import { VisitService } from '../providers/visit/visit.service';
import { AppService } from '../providers/global/app.service';
import { AppServiceMock } from '../../test-config/services-mocks/app-service.mock';
import { VisitServiceMock } from '../../test-config/services-mocks/visit-service.mock';
import { AuthenticationService } from '../providers/auth';
import { AuthenticationServiceMock } from '../../test-config/services-mocks/authentication-service.mock';
// import { FirebaseLogsService } from '../providers/firebase-logs/firebase-logs.service';
// import { FirebaseLogsServiceMock } from '../../test-config/services-mocks/firebaseLogsService.mock';
import { ActivityService } from '../providers/activity/activity.service';
import { ActivityServiceMock } from '../../test-config/services-mocks/activity-service.mock';
import { STORAGE, PAGE_NAMES } from './app.enums';
import { LogsProvider } from '../modules/logs/logs.service';
import { TestStore } from '../modules/logs/data-store.service.mock';

describe('Component: Root', () => {
  let comp: MyApp;
  let fixture: ComponentFixture<MyApp>;
  let appService: AppService;
  let events: Events;
  let eventsSpy: any;
  let activityService;
  let syncService;
  let syncServiceSpy: any;
  let logProvider: LogsProvider;
  let logProviderSpy: any;
  let storageService;
  let visitService;
  let screenOrientation: ScreenOrientation;
  let screenOrientationSpy: any;
  // let firebaseLogsService: FirebaseLogsService;
  let authenticationService: AuthenticationService;
  let navSpy: any;
  let navElem: Nav;

  beforeEach(async(() => {
    syncServiceSpy = jasmine.createSpyObj('SyncService', {
      checkForUpdate: () => true
    });

    logProviderSpy = jasmine.createSpyObj('LogsProvider', {
      dispatchLog: () => true
    });

    // authenticationSpy = jasmine.createSpyObj('AuthenticationService', ['login']);
    navSpy = jasmine.createSpyObj('Nav', ['push']);
    eventsSpy = jasmine.createSpyObj('Events', ['subscribe', 'unsubscribe']);
    screenOrientationSpy = jasmine.createSpyObj('ScreenOrientation', ['lock']);

    TestBed.configureTestingModule({
      declarations: [MyApp],
      imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({
          driverOrder: ['sqlite', 'websql', 'indexeddb']
        })
      ],
      providers: [
        StatusBar,
        SplashScreen,
        // StorageService,
        // AppService,
        { provide: AuthenticationService, useClass: AuthenticationServiceMock },
        { provide: AppService, useClass: AppServiceMock },
        { provide: StorageService, useClass: StorageServiceMock },
        { provide: Events, useValue: eventsSpy },
        { provide: Nav, useValue: navSpy },
        // { provide: FirebaseLogsService, useClass: FirebaseLogsServiceMock },
        { provide: ActivityService, useClass: ActivityServiceMock },
        { provide: VisitService, useClass: VisitServiceMock },
        { provide: SyncService, useValue: syncServiceSpy },
        { provide: LogsProvider, useValue: logProviderSpy },
        { provide: ScreenOrientation, useValue: screenOrientationSpy },
        MobileAccessibility,
        // ScreenOrientation,
        Network,
        { provide: Store, useClass: TestStore }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyApp);
    comp = fixture.componentInstance;
    events = TestBed.get(Events);
    authenticationService = TestBed.get(AuthenticationService);
    syncService = TestBed.get(SyncService);
    storageService = TestBed.get(StorageService);
    appService = TestBed.get(AppService);
    visitService = TestBed.get(VisitService);
    activityService = TestBed.get(ActivityService);
    screenOrientation = TestBed.get(ScreenOrientation);
    // firebaseLogsService = TestBed.get(FirebaseLogsService);
    logProvider = TestBed.get(LogsProvider);
    navElem = TestBed.get(Nav);

    // spyOn(firebaseLogsService, 'logEvent');
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
    appService = null;
    screenOrientation = null;
    syncService = null;
  });

  it('should create component', () => {
    expect(fixture).toBeTruthy();
    expect(comp).toBeTruthy();
    expect(comp instanceof MyApp).toBe(true);
  });

  describe('when loading app', () => {
    beforeEach(() => {
      // authenticationService.login = jasmine.createSpy('login').and.returnValue(Promise.resolve());
      // authenticationService.login = jasmine.createSpy('login').and.callThrough();
      spyOn(appService, 'manageAppInit').and.callFake(() => Promise.resolve());
      spyOn(authenticationService, 'login').and.returnValue(() => Promise.resolve());
    });

    // it('should set app default data and call login', () => {
    //   comp.navElem = navSpy;
    //   navSpy.push(PAGE_NAMES.SIGNATURE_PAD_PAGE);
    //   // eventsSpy.subscribe();
    //   authenticationSpy.login();
    //   spyOnProperty(appService, 'isSignatureRegistered', 'get').and.returnValue(false);

    //   expect(appService.manageAppInit).toHaveBeenCalled();
    //   expect(authenticationSpy.login).toHaveBeenCalled();
    //   expect(comp.navElem.push).toHaveBeenCalledWith(PAGE_NAMES.SIGNATURE_PAD_PAGE);
    //   // expect(events.subscribe).toHaveBeenCalled();
    // });

    it('should set app default data and call login', () => {
      // comp.navElem = navSpy;
      // navSpy.push(PAGE_NAMES.SIGNATURE_PAD_PAGE);
      // eventsSpy.subscribe();
      // authenticationSpy.login();
      // spyOnProperty(appService, 'isSignatureRegistered', 'get').and.returnValue(false);
      // comp.ngOnInit();

      fixture.detectChanges();

      // expect(appService.manageAppInit).toHaveBeenCalled();
      //expect(authenticationService.login).toHaveBeenCalled();

      // expect(AuthenticationService.prototype.login).toHaveBeenCalled();
      // expect(comp.navElem.push).toHaveBeenCalledWith(PAGE_NAMES.SIGNATURE_PAD_PAGE);
      // expect(events.subscribe).toHaveBeenCalled();
    });
  });

  it('should SyncService and Root Component share the same instance', inject(
    [SyncService],
    (injectService: SyncService) => {
      expect(injectService).toBe(syncService);
    }
  ));

  it('should StorageService and Root Component share the same instance', inject(
    [StorageService],
    (injectService: StorageService) => {
      expect(injectService).toBe(storageService);
    }
  ));

  it('should VisitService and Root Component share the same instance', inject(
    [VisitService],
    (injectService: VisitService) => {
      expect(injectService).toBe(visitService);
    }
  ));

  // it('Should check manageAppState method state resp: true, visit resp: true, activities resp: false', () => {
  //   storageService.read = jasmine.createSpy('read').and.callFake((key) => {
  //     let keyReturn;
  //     switch (key) {
  //       case STORAGE.STATE: {
  //         keyReturn = true;
  //         break;
  //       }
  //       case STORAGE.VISIT: {
  //         keyReturn = true;
  //         break;
  //       }
  //       case STORAGE.ACTIVITIES: {
  //         keyReturn = false;
  //         break;
  //       }
  //     }
  //     return new Promise((resolve) => resolve(keyReturn));
  //   });
  //   comp.manageAppState();
  //   expect(storageService.read).toHaveBeenCalled();
  // });

  // it('Should check manageAppState method state resp: true, visit resp: true, activities resp: true', () => {
  //   storageService.read = jasmine.createSpy('read').and.callFake((key) => {
  //     let keyReturn;
  //     switch (key) {
  //       case STORAGE.STATE: {
  //         keyReturn = true;
  //         break;
  //       }
  //       case STORAGE.VISIT: {
  //         keyReturn = true;
  //         break;
  //       }
  //       case STORAGE.ACTIVITIES: {
  //         keyReturn = true;
  //         break;
  //       }
  //     }
  //     return new Promise((resolve) => resolve(keyReturn));
  //   });
  //   comp.manageAppState();
  //   expect(storageService.read).toHaveBeenCalled();
  // });

  // it('Should check manageAppState method false state response', () => {
  //   storageService.read = jasmine.createSpy('read').and.callFake((key) => {
  //     let keyReturn;
  //     switch (key) {
  //       case STORAGE.STATE: {
  //         keyReturn = false;
  //         break;
  //       }
  //       case STORAGE.VISIT: {
  //         keyReturn = true;
  //         break;
  //       }
  //       case STORAGE.ACTIVITIES: {
  //         keyReturn = false;
  //         break;
  //       }
  //     }
  //     return new Promise((resolve) => resolve(keyReturn));
  //   });
  //   comp.manageAppState();
  // });
});
