import { TestStationDetailsPage } from './test-station-details';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  IonicModule,
  NavController,
  NavParams,
  AlertController,
  ViewController,
  LoadingController
} from 'ionic-angular';
import { PipesModule } from '../../../pipes/pipes.module';
// import { Firebase } from '@ionic-native/firebase';
import {
  NavControllerMock,
  AlertControllerMock,
  ViewControllerMock,
  LoadingControllerMock
} from 'ionic-mocks';
import { CallNumber } from '@ionic-native/call-number';
import { VisitService } from '../../../providers/visit/visit.service';
import { VisitServiceMock } from '../../../../test-config/services-mocks/visit-service.mock';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestStationReferenceDataModel } from '../../../models/reference-data-models/test-station.model';
import { NavParamsMock } from '../../../../test-config/ionic-mocks/nav-params.mock';
import { Store } from '@ngrx/store';
import { TestStore } from '../../../modules/logs/data-store.service.mock';
// import { FirebaseLogsService } from '../../../providers/firebase-logs/firebase-logs.service';
// import { FirebaseLogsServiceMock } from '../../../../test-config/services-mocks/firebaseLogsService.mock';
import { AppService } from '../../../providers/global/app.service';
import { AppServiceMock } from '../../../../test-config/services-mocks/app-service.mock';
import { LogsProvider } from '../../../modules/logs/logs.service';
import { AuthenticationService } from '../../../providers/auth';
import { AuthenticationServiceMock } from '../../../../test-config/services-mocks/authentication-service.mock';

describe('Component: TestStationDetailsPage', () => {
  let component: TestStationDetailsPage;
  let fixture: ComponentFixture<TestStationDetailsPage>;
  let callNumberSpy: any;
  let openNativeSettingsSpy: any;
  let navParams: NavParams;
  let visitServiceMock: VisitServiceMock;
  // let firebase: Firebase;
  let firebaseSpy: any;
  let alertCtrl: AlertController;
  // let firebaseLogsService: FirebaseLogsService;
  let logProvider: LogsProvider;
  let logProviderSpy;

  beforeEach(() => {
    callNumberSpy = jasmine.createSpyObj('CallNumber', ['callNumber']);
    openNativeSettingsSpy = jasmine.createSpyObj('OpenNativeSettings', ['open']);
    firebaseSpy = jasmine.createSpyObj('Firebase', ['logEvent']);
    logProviderSpy = jasmine.createSpyObj('LogsProvider', {
      dispatchLog: () => true
    });

    TestBed.configureTestingModule({
      declarations: [TestStationDetailsPage],
      imports: [IonicModule.forRoot(TestStationDetailsPage), PipesModule],
      providers: [
        // { provide: Firebase, useValue: firebaseSpy },
        { provide: NavController, useFactory: () => NavControllerMock.instance() },
        { provide: NavParams, useClass: NavParamsMock },
        // { provide: FirebaseLogsService, useClass: FirebaseLogsServiceMock },
        { provide: AlertController, useFactory: () => AlertControllerMock.instance() },
        { provide: ViewController, useFactory: () => ViewControllerMock.instance() },
        { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
        { provide: CallNumber, useValue: callNumberSpy },
        { provide: VisitService, useClass: VisitServiceMock },
        { provide: OpenNativeSettings, useValue: openNativeSettingsSpy },
        { provide: AuthenticationService, useClass: AuthenticationServiceMock },
        { provide: Store, useClass: TestStore },
        { provide: AppService, useClass: AppServiceMock },
        { provide: LogsProvider, useValue: logProviderSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestStationDetailsPage);
    component = fixture.componentInstance;
    navParams = TestBed.get(NavParams);
    visitServiceMock = TestBed.get(VisitService);
    // firebase = TestBed.get(Firebase);
    alertCtrl = TestBed.get(AlertController);
    // firebaseLogsService = TestBed.get(FirebaseLogsService);
    logProvider = TestBed.get(LogsProvider);
  });

  beforeEach(() => {
    const navParams = fixture.debugElement.injector.get(NavParams);

    navParams.get = jasmine.createSpy('get').and.callFake((param) => {
      const params = {
        testStation: {} as TestStationReferenceDataModel
      };
      return params[param];
    });
  });

  beforeEach(() => {
    component.testStation = navParams.get('testStation');
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    navParams = null;
    // firebase = null;
  });

  it('should create component', () => {
    expect(fixture).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should test ionViewDidEnterLogic', () => {
    // spyOn(firebaseLogsService, 'setScreenName');
    // component.ionViewDidEnter();
    // expect(firebaseLogsService.setScreenName).toHaveBeenCalled();
  });

  it('should test confirmStartVisit', () => {
    visitServiceMock.isError = true;
    component.confirmStartVisit();
    // expect(firebase.logEvent).toHaveBeenCalled();
    visitServiceMock.isError = false;
    component.confirmStartVisit();
    expect(component.isNextPageLoading).toBeFalsy();
  });

  it('should create reportIssue alert', () => {
    component.reportIssueHandler();
    expect(alertCtrl.create).toHaveBeenCalled();
  });

  it('should create alert for starting a visit', () => {
    component.startVisit();
    expect(alertCtrl.create).toHaveBeenCalled();
  });
});
