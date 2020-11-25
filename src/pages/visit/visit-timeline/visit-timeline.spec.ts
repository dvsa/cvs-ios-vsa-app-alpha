import { VisitTimelinePage } from './visit-timeline';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  IonicModule,
  NavController,
  LoadingController,
  Events,
  AlertController,
  NavParams,
  ToastController,
  ModalController
} from 'ionic-angular';
import { PipesModule } from '../../../pipes/pipes.module';
import { StateReformingService } from '../../../providers/global/state-reforming.service';
import { StateReformingServiceMock } from '../../../../test-config/services-mocks/state-reforming-service.mock';
import {
  LoadingControllerMock,
  EventsMock,
  NavControllerMock,
  AlertControllerMock,
  NavParamsMock,
  ToastControllerMock,
  ModalControllerMock
} from 'ionic-mocks';
import { AppService } from '../../../providers/global/app.service';
import { AppServiceMock } from '../../../../test-config/services-mocks/app-service.mock';
import { TestService } from '../../../providers/test/test.service';
import { TestServiceMock } from '../../../../test-config/services-mocks/test-service.mock';
import { VisitService } from '../../../providers/visit/visit.service';
import { StorageService } from '../../../providers/natives/storage.service';
import { StorageServiceMock } from '../../../../test-config/services-mocks/storage-service.mock';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VisitDataMock } from '../../../assets/data-mocks/visit-data.mock';
// import { FirebaseLogsService } from '../../../providers/firebase-logs/firebase-logs.service';
// import { FirebaseLogsServiceMock } from '../../../../test-config/services-mocks/firebaseLogsService.mock';
import { ActivityService } from '../../../providers/activity/activity.service';
import { ActivityDataMock } from '../../../assets/data-mocks/activity.data.mock';
import { TestStationDataMock } from '../../../assets/data-mocks/reference-data-mocks/test-station-data.mock';
import { TestModel } from '../../../models/tests/test.model';
import { APP_STRINGS, AUTH, PAGE_NAMES, STORAGE, VEHICLE_TYPE } from '../../../app/app.enums';
// import { Firebase } from '@ionic-native/firebase';
import { Observable } from 'rxjs';
import { VehicleDataMock } from '../../../assets/data-mocks/vehicle-data.mock';
import { VehicleModel } from '../../../models/vehicle/vehicle.model';
import { FormatVrmPipe } from '../../../pipes/format-vrm/format-vrm.pipe';
import { VisitModel } from '../../../models/visit/visit.model';
import { LogsProvider } from '../../../modules/logs/logs.service';
import { ActivityModel } from '../../../models/visit/activity.model';
import { of } from 'rxjs/observable/of';
import { AuthenticationService } from '../../../providers/auth/authentication/authentication.service';
import { AuthenticationServiceMock } from './../../../../test-config/services-mocks/authentication-service.mock';

describe('Component: VisitTimelinePage', () => {
  let component: VisitTimelinePage;
  let fixture: ComponentFixture<VisitTimelinePage>;
  let openNativeSettingsSpy: any;
  let loadingCtrl: LoadingController;
  // let firebaseLogsService: FirebaseLogsService;
  let modalCtrl: ModalController;
  let alertCtrl: AlertController;
  let navCtrl: NavController;
  let storageService: StorageService;
  let storageServiceSpy: any;
  let activityService: ActivityService;
  let activityServiceSpy: jasmine.SpyObj<ActivityService>;
  let visitService: VisitService;
  let visitServiceSpy: jasmine.SpyObj<VisitService>;
  let logProvider: LogsProvider;
  let logProviderSpy: any;
  let authenticationService: AuthenticationService;

  let waitActivity = ActivityDataMock.WaitActivityData;
  let testStation = TestStationDataMock.TestStationData[0];

  const TEST_STATION_NAME = 'Ashby';
  const getMockVisit = (): VisitModel => {
    return {
      id: 'visit_UUID',
      testStationName: TEST_STATION_NAME,
      testStationEmail: `${TEST_STATION_NAME}@xyx.com`
    } as VisitModel;
  };

  const getMockVisitTest = (): TestModel => {
    return {
      startTime: '2019-05-23T14:52:04.208Z',
      endTime: '2019-05-23T14:52:24.773Z'
    } as TestModel;
  };

  const getMockActivity = (): ActivityModel => {
    return {
      activityType: 'wait',
      startTime: '2019-05-22T11:11:14.702Z',
      endTime: '2019-05-22T11:12:31.625Z',
      id: '8ae539aa-cbfb-49e2-8951-63567003b512',
      notes: 'qwewe'
    } as ActivityModel;
  };

  beforeEach(() => {
    openNativeSettingsSpy = jasmine.createSpyObj('OpenNativeSettings', ['open']);
    storageServiceSpy = jasmine.createSpyObj('StorageService', ['delete']);

    logProviderSpy = jasmine.createSpyObj('LogsProvider', {
      dispatchLog: () => true
    });

    activityServiceSpy = jasmine.createSpyObj('ActivityService', [
      'createActivity',
      'getActivities',
      'createActivityBodyForCall',
      'createActivitiesForUpdateCall',
      'submitActivity',
      'updateActiviesArgs',
      'updateActivityReasons'
    ]);

    visitServiceSpy = jasmine.createSpyObj('VisitService', ['endVisit', 'getTests']);

    TestBed.configureTestingModule({
      declarations: [VisitTimelinePage],
      imports: [IonicModule.forRoot(VisitTimelinePage), PipesModule],
      providers: [
        // Firebase,
        { provide: ModalController, useFactory: () => ModalControllerMock.instance() },
        // { provide: FirebaseLogsService, useClass: FirebaseLogsServiceMock },
        { provide: NavController, useFactory: () => NavControllerMock.instance() },
        { provide: NavParams, useClass: NavParamsMock },
        { provide: StateReformingService, useClass: StateReformingServiceMock },
        { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
        { provide: AlertController, useFactory: () => AlertControllerMock.instance() },
        { provide: ToastController, useFactory: () => ToastControllerMock.instance() },
        { provide: AppService, useClass: AppServiceMock },
        { provide: Events, useFactory: () => EventsMock },
        { provide: TestService, useClass: TestServiceMock },
        { provide: ActivityService, useValue: activityServiceSpy },
        { provide: VisitService, useValue: visitServiceSpy },
        { provide: StorageService, useClass: StorageServiceMock },
        { provide: AuthenticationService, useClass: AuthenticationServiceMock },
        { provide: OpenNativeSettings, useValue: openNativeSettingsSpy },
        { provide: LogsProvider, useValue: logProviderSpy },
        FormatVrmPipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitTimelinePage);
    component = fixture.componentInstance;
    loadingCtrl = TestBed.get(LoadingController);
    // firebaseLogsService = TestBed.get(FirebaseLogsService);
    activityService = TestBed.get(ActivityService);
    visitService = TestBed.get(VisitService);
    modalCtrl = TestBed.get(ModalController);
    alertCtrl = TestBed.get(AlertController);
    navCtrl = TestBed.get(NavController);
    storageService = TestBed.get(StorageService);
    authenticationService = TestBed.get(AuthenticationService);
    logProvider = TestBed.get(LogsProvider);
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    loadingCtrl = null;
    // firebaseLogsService = null;
    modalCtrl = null;
    alertCtrl = null;
    storageService = null;
  });

  it('should create component', () => {
    expect(fixture).toBeTruthy();
    expect(component).toBeTruthy();
  });

  // it('should delete platformSubscription if it exists', () => {
  //   component.platformSubscription = new Subscription();
  //   component.ngOnDestroy();
  //   expect(component.platformSubscription.closed).toBeTruthy();
  // });

  it('should test if logEvent method was called', () => {
    component.createNewTestReport();
    // expect(firebaseLogsService.search_vehicle_time.search_vehicle_start_time).toBeTruthy();
  });

  // it('should check ionViewDidEnter logic', () => {
  //   component.visit = {...VisitDataMock.VisitData};
  //   component.timeline = [];

  //   visitService.createVisit(testStation);
  //   let customTest: TestModel = {} as TestModel;
  //   customTest.startTime = "2019-05-23T14:52:04.208Z";
  //   customTest.endTime = "2019-05-23T14:52:24.773Z";
  //   customTest.status = TEST_REPORT_STATUSES.CANCELLED;
  //   visitService.addTest(customTest);

  //   component.createTimeline();
  //   component.ionViewDidEnter();
  //   expect(component.timeline.length).toEqual(component.visit.tests.length + 1);
  // });

  it('should check ionViewDidEnter logic when timeline already has an wait activity', () => {
    component.timeline = [];
    component.timeline.push(waitActivity);
    component.ionViewDidEnter();
    component.createNewTestReport();
    expect(component.timeline.length > 0).toBeTruthy();
  });

  it('should test if have5MinutesPassedSinceLastActivity', () => {
    component.visit = {} as VisitModel;
    component.visit.startTime = '2020-03-19T03:07:44.669Z';
    component.visit.tests = [];
    expect(component.have5MinutesPassedSinceLastActivity()).toBeTruthy();
    component.visit = { ...VisitDataMock.VisitData };
    expect(component.have5MinutesPassedSinceLastActivity()).toBeTruthy();
  });

  it('should creat a wait time activity with correct start time', () => {
    component.timeline = [];
    component.visit = {
      ...getMockVisit(),
      startTime: '2020-03-19T03:07:44.669Z',
      endTime: '2020-03-19T10:07:44.669Z'
    } as VisitModel;

    activityServiceSpy.createActivity.and.returnValue(getMockActivity() as ActivityModel);

    component.createWaitTime();
    expect(component.timeline[0].startTime).toEqual(component.visit.startTime);
    component.timeline[0].endTime = '2020-03-19T10:07:44.669Z';
    component.createWaitTime();
    expect(component.timeline[1].startTime).toEqual(component.timeline[0].endTime);
  });

  it('should create timeline', () => {
    activityServiceSpy.getActivities.and.returnValue([getMockActivity()] as ActivityModel[]);
    visitServiceSpy.getTests.and.returnValue([getMockVisitTest()] as TestModel[]);

    component.createTimeline();

    expect(component.timeline).toEqual([getMockActivity(), getMockVisitTest()]);
  });

  it('should display the wait reason alert if an activity has wait time reason', () => {
    const visit = getMockVisit();
    spyOn(component, 'checkWaitTimeReasons').and.returnValue(true);

    component.showConfirm(visit);

    expect(alertCtrl.create).toHaveBeenCalledWith({
      title: APP_STRINGS.END_VISIT_WAITING_TITLE,
      message: APP_STRINGS.END_VISIT_WAITING_MSG,
      buttons: [APP_STRINGS.OK]
    });
  });

  it('should display the end visit alert if there are no activity with wait time reason', () => {
    const visit = getMockVisit();
    spyOn(component, 'checkWaitTimeReasons').and.returnValue(false);

    component.showConfirm(visit);

    expect(alertCtrl.create).toHaveBeenCalledWith({
      title: APP_STRINGS.END_VISIT_TITLE,
      message: `${APP_STRINGS.END_VISIT_MSG}${visit.testStationName}.`,
      buttons: [
        {
          text: APP_STRINGS.CANCEL,
          role: APP_STRINGS.CANCEL.toLowerCase()
        },
        {
          text: APP_STRINGS.END_VISIT_TITLE,
          handler: jasmine.any(Function)
        }
      ]
    });
  });

  it('should show loading indicator if loading text is provided', () => {
    component.showLoading(APP_STRINGS.END_VISIT_LOADING);

    expect(component.loading.present).toHaveBeenCalled();
  });

  it('should dimiss loading indicator if loading text is not provided', () => {
    component.loading = loadingCtrl.create({
      content: 'text'
    });
    component.showLoading('');

    expect(component.loading.dismiss).toHaveBeenCalled();
  });

  describe('confirmEndVisit$', () => {
    beforeEach(() => {
      component.visit = getMockVisit();
      // spyOn(firebaseLogsService, 'logEvent');
      spyOn(component, 'showLoading');
    });

    it('should display the site closed alert if visit was previously closed', () => {
      visitServiceSpy.endVisit.and.returnValue(
        of({
          body: {
            wasVisitAlreadyClosed: true
          }
        })
      );

      let sitePrevClosed: boolean;
      component.confirmEndVisit$().subscribe((siteClosed) => (sitePrevClosed = siteClosed));

      expect(sitePrevClosed).toBeUndefined();
      expect(component.isCreateTestEnabled).toBeFalsy();
      expect(component.showLoading).toHaveBeenCalledWith(APP_STRINGS.END_VISIT_LOADING);
      expect(visitService.endVisit).toHaveBeenCalledWith(getMockVisit().id);
      // expect(firebaseLogsService.logEvent).toHaveBeenCalledWith(FIREBASE.SUBMIT_VISIT);
      expect(logProvider.dispatchLog).toHaveBeenCalled();
      expect(alertCtrl.create).toHaveBeenCalledWith({
        title: APP_STRINGS.SITE_VISIT_CLOSED_TITLE,
        message: APP_STRINGS.SITE_VISIT_CLOSED_MESSAGE,
        buttons: [
          {
            text: APP_STRINGS.OK,
            handler: jasmine.any(Function)
          }
        ]
      });
    });

    it('should display the try again alert if endVisit failed', () => {
      const receivedError = {
        error: AUTH.INTERNET_REQUIRED
      };
      visitServiceSpy.endVisit.and.returnValue(Observable.throw(receivedError));

      component.confirmEndVisit$().subscribe();

      expect(component.showLoading).toHaveBeenCalledWith('');
      expect(logProvider.dispatchLog).toHaveBeenCalled();
      // expect(firebaseLogsService.logEvent).toHaveBeenCalledWith(
      //   FIREBASE.TEST_ERROR,
      //   FIREBASE.ERROR,
      //   FIREBASE.ENDING_ACTIVITY_FAILED
      // );
      expect(alertCtrl.create).toHaveBeenCalledWith({
        title: APP_STRINGS.UNABLE_TO_END_VISIT,
        message: APP_STRINGS.NO_INTERNET_CONNECTION,
        buttons: [
          {
            text: APP_STRINGS.SETTINGS_BTN,
            handler: jasmine.any(Function)
          },
          {
            text: APP_STRINGS.TRY_AGAIN_BTN,
            handler: jasmine.any(Function)
          }
        ]
      });
    });

    describe('createActivityToPost$', () => {
      beforeEach(() => {
        activityServiceSpy.createActivityBodyForCall.and.returnValue(getMockActivity());
      });

      it('should submit activity if visit was not previously closed', () => {
        activityServiceSpy.submitActivity.and.returnValue(
          of({
            body: {
              id: 'activity_id'
            }
          })
        );

        component.createActivityToPost$().subscribe();

        expect(logProvider.dispatchLog).toHaveBeenCalled();
        expect(activityService.updateActiviesArgs).toHaveBeenCalled();
      });

      it('should log error if submit activity fails', () => {
        activityServiceSpy.submitActivity.and.returnValue(Observable.throw('error'));

        component.createActivityToPost$().subscribe();

        expect(component.showLoading).toHaveBeenCalledWith('');
        expect(logProvider.dispatchLog).toHaveBeenCalled();
        // expect(firebaseLogsService.logEvent).toHaveBeenCalledWith(
        //   FIREBASE.TEST_ERROR,
        //   FIREBASE.ERROR,
        //   FIREBASE.WAIT_ACTIVITY_SUBMISSION_FAILED
        // );
      });
    });

    describe('createActivityReasonsToPost$', () => {
      const activityReason = {
        id: 'activity_id',
        waitReason: 'having lunch',
        notes: 'flat tyres'
      };
      beforeEach(() => {
        spyOn(storageService, 'delete');
      });

      it('should post the activity with reasons if exist and clear storage', () => {
        activityServiceSpy.createActivitiesForUpdateCall.and.returnValue([activityReason]);
        activityServiceSpy.updateActivityReasons.and.returnValue(
          of({
            status: 200
          })
        );

        component.createActivityReasonsToPost$([getMockActivity()]).subscribe();

        expect(logProvider.dispatchLog).toHaveBeenCalled();
        resetOnActivityReasonSuccess();
      });

      it('should only clear storage if activity reason does not exist', () => {
        activityServiceSpy.createActivitiesForUpdateCall.and.returnValue([]);

        component.createActivityReasonsToPost$([getMockActivity()]).subscribe();

        resetOnActivityReasonSuccess();
      });

      function resetOnActivityReasonSuccess() {
        expect(storageService.delete).toHaveBeenCalledWith(STORAGE.VISIT);
        expect(storageService.delete).toHaveBeenCalledWith(STORAGE.STATE);
        expect(storageService.delete).toHaveBeenCalledWith(STORAGE.ACTIVITIES);
        expect(component.showLoading).toHaveBeenCalledWith('');
        expect(navCtrl.push).toHaveBeenCalledWith(PAGE_NAMES.CONFIRMATION_PAGE, {
          testStationName: TEST_STATION_NAME
        });
      }

      it('should log error if post activity with reason fails', () => {
        activityServiceSpy.createActivitiesForUpdateCall.and.returnValue([activityReason]);
        activityServiceSpy.updateActivityReasons.and.returnValue(Observable.throw('error'));

        component.createActivityReasonsToPost$([getMockActivity()]).subscribe();

        expect(component.showLoading).toHaveBeenCalledWith('');
        expect(logProvider.dispatchLog).toHaveBeenCalled();
      });
    });
  });

  it('should check if it can be added another waiting time', () => {
    let customTimeline = [];
    expect(component.canAddOtherWaitingTime(customTimeline)).toBeTruthy();

    customTimeline.push(waitActivity);
    expect(component.canAddOtherWaitingTime(customTimeline)).toBeFalsy();
  });

  it('should check if waitTimeReasons are checked', () => {
    let customTimeline = ActivityDataMock.Activities;
    expect(component.checkWaitTimeReasons(customTimeline)).toBeTruthy();
  });

  it('should check if modal is created', () => {
    component.editWaitTime(waitActivity);
    expect(modalCtrl.create).toHaveBeenCalled();

    waitActivity.activityType = 'other';
    component.editWaitTime(waitActivity);
    expect(modalCtrl.create).toHaveBeenCalled();
  });

  it('should return the VRM when the vehicle is a PSV', () => {
    let vehicle: VehicleModel = Object.create(VehicleDataMock.VehicleData);
    vehicle.techRecord.vehicleType = VEHICLE_TYPE.PSV;
    vehicle.vrm = 'AB12CDE';
    expect(component.getVehicleIdentifier(vehicle)).toBe('AB12 CDE');
  });

  it('should return the Trailer ID when the vehicle is a Trailer', () => {
    let vehicle: VehicleModel = Object.create(VehicleDataMock.VehicleData);
    vehicle.techRecord.vehicleType = VEHICLE_TYPE.TRL;
    vehicle.trailerId = 'C000001';
    expect(component.getVehicleIdentifier(vehicle)).toBe('C000001');
  });
});
