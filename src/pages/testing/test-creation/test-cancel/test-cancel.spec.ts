import {
  IonicModule,
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from 'ionic-angular';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestCancelPage } from './test-cancel';
import { TestService } from '../../../../providers/test/test.service';
import { TestModel } from '../../../../models/tests/test.model';
import { VisitService } from '../../../../providers/visit/visit.service';
import { VisitServiceMock } from '../../../../../test-config/services-mocks/visit-service.mock';
import { NavParamsMock } from '../../../../../test-config/ionic-mocks/nav-params.mock';
import { VisitDataMock } from '../../../../assets/data-mocks/visit-data.mock';
import { TestResultService } from '../../../../providers/test-result/test-result.service';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { AlertControllerMock, LoadingControllerMock, NavControllerMock } from 'ionic-mocks';
import { AuthenticationService } from '../../../../providers/auth/authentication/authentication.service';
import { AuthenticationServiceMock } from '../../../../../test-config/services-mocks/authentication-service.mock';
import { Store } from '@ngrx/store';
import { TestStore } from '../../../../modules/logs/data-store.service.mock';
import { TestResultServiceMock } from '../../../../../test-config/services-mocks/test-result-service.mock';
// import { FirebaseLogsService } from '../../../../providers/firebase-logs/firebase-logs.service';
// import { FirebaseLogsServiceMock } from '../../../../../test-config/services-mocks/firebaseLogsService.mock';
// import { Firebase } from '@ionic-native/firebase';
import { ActivityService } from '../../../../providers/activity/activity.service';
import { ActivityServiceMock } from '../../../../../test-config/services-mocks/activity-service.mock';
import { LogsProvider } from '../../../../modules/logs/logs.service';

describe('Component: TestCancelPage', () => {
  let component: TestCancelPage;
  let fixture: ComponentFixture<TestCancelPage>;
  let navCtrl: NavController;
  let testReportService: TestService;
  let testReportServiceSpy: any;
  let openNativeSettingsSpy: any;
  let visitService: VisitService;
  let visitServiceMock: VisitServiceMock;
  let alertCtrl: AlertController;
  let activityServiceMock: ActivityServiceMock;
  let store: Store<any>;
  // let firebaseLogsService: FirebaseLogsService;
  let logProvider: LogsProvider;
  let logProviderSpy: any;

  let testReport: TestModel = {
    startTime: null,
    endTime: null,
    status: null,
    reasonForCancellation: '',
    vehicles: []
  };

  beforeEach(async(() => {
    testReportServiceSpy = jasmine.createSpyObj('testReportService', [
      { getTestReport: testReport },
      'endTestReport'
    ]);
    openNativeSettingsSpy = jasmine.createSpyObj('OpenNativeSettings', [
      {
        open: new Promise(() => {
          return true;
        })
      }
    ]);

    logProviderSpy = jasmine.createSpyObj('LogsProvider', {
      dispatchLog: () => true
    });

    TestBed.configureTestingModule({
      declarations: [TestCancelPage],
      imports: [IonicModule.forRoot(TestCancelPage)],
      providers: [
        // Firebase,
        { provide: NavController, useFactory: () => NavControllerMock.instance() },
        // { provide: FirebaseLogsService, useClass: FirebaseLogsServiceMock },
        { provide: AlertController, useFactory: () => AlertControllerMock.instance() },
        { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
        { provide: OpenNativeSettings, useValue: openNativeSettingsSpy },
        { provide: NavParams, useClass: NavParamsMock },
        { provide: VisitService, useClass: VisitServiceMock },
        { provide: ActivityService, useClass: ActivityServiceMock },
        { provide: TestService, useValue: testReportServiceSpy },
        { provide: TestResultService, useClass: TestResultServiceMock },
        { provide: AuthenticationService, useClass: AuthenticationServiceMock },
        { provide: Store, useClass: TestStore },
        { provide: LogsProvider, useValue: logProviderSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCancelPage);
    component = fixture.componentInstance;
    navCtrl = TestBed.get(NavController);
    visitService = TestBed.get(VisitService);
    visitServiceMock = TestBed.get(VisitService);
    alertCtrl = TestBed.get(AlertController);
    activityServiceMock = TestBed.get(ActivityService);
    testReportService = TestBed.get(TestService);
    store = TestBed.get(Store);
    // firebaseLogsService = TestBed.get(FirebaseLogsService);
    logProvider = TestBed.get(LogsProvider);
  });

  beforeEach(() => {
    const navParams = fixture.debugElement.injector.get(NavParams);

    navParams.get = jasmine.createSpy('get').and.callFake((param) => {
      const params = {
        test: VisitDataMock.VisitTestData
      };
      return params[param];
    });
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    visitService = null;
    visitServiceMock = null;
    alertCtrl = null;
    activityServiceMock = null;
    store = null;
  });

  it('should create the component', () => {
    expect(fixture).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should test ionViewDidEnterLogic', () => {
    // spyOn(firebaseLogsService, 'setScreenName');
    // component.ionViewDidEnter();
    // expect(firebaseLogsService.setScreenName).toHaveBeenCalled();
  });

  it('should VisitService and TestCancelPage Component share the same instance', inject(
    [VisitService],
    (injectService: VisitService) => {
      expect(injectService).toBe(visitService);
    }
  ));

  it('should verify either a string is valid or not', () => {
    component.cancellationReason = ' ';
    expect(component.isValidReason()).toBeFalsy();
    component.cancellationReason = 'reason';
    expect(component.isValidReason()).toBeTruthy();
  });

  it('should test submitting a test - success case', () => {
    visitServiceMock.visit = VisitDataMock.VisitData;
    component.submit(VisitDataMock.VisitTestData);
    expect(alertCtrl.create).toHaveBeenCalled();
  });

  it('should test submitting a test - error case on submitActivity', () => {
    visitServiceMock.visit = VisitDataMock.VisitData;
    activityServiceMock.isSubmitError = true;
    component.submit(VisitDataMock.VisitTestData);
    expect(logProvider.dispatchLog).toHaveBeenCalled();
  });

  it('should present onSubmit alert depending on cancellationReason', () => {
    component.cancellationReason = '   ';
    component.onSubmit();
    expect(component.cancellationReason).toEqual('');
    expect(alertCtrl.create).toHaveBeenCalled();
  });

  it('should test the submit.s handler', () => {
    spyOn(component, 'submit');
    component.testData = testReport;
    component.submitHandler();
    expect(testReportService.endTestReport).toHaveBeenCalled();
    expect(component.submit).toHaveBeenCalled();
  });
});
