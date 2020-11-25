import { AppServiceMock } from './../../../../../test-config/services-mocks/app-service.mock';
import { AppService } from './../../../../providers/global/app.service';
import { AddPreparerPage } from './add-preparer';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { PreparerService } from '../../../../providers/preparer/preparer.service';
import {
  AlertController,
  IonicModule,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestService } from '../../../../providers/test/test.service';
import { ViewControllerMock } from '../../../../../test-config/ionic-mocks/view-controller.mock';
import { VehicleService } from '../../../../providers/vehicle/vehicle.service';
import { VehicleServiceMock } from '../../../../../test-config/services-mocks/vehicle-service.mock';
import { TechRecordDataMock } from '../../../../assets/data-mocks/tech-record-data.mock';
import { VisitDataMock } from '../../../../assets/data-mocks/visit-data.mock';
import { NavParamsMock } from '../../../../../test-config/ionic-mocks/nav-params.mock';
import { VehicleTechRecordModel } from '../../../../models/vehicle/tech-record.model';
import { VisitService } from '../../../../providers/visit/visit.service';
import { PipesModule } from '../../../../pipes/pipes.module';
import { PreparersDataMock } from '../../../../assets/data-mocks/reference-data-mocks/preparers-data.mock';
import { AlertControllerMock } from 'ionic-mocks';
import { of } from 'rxjs/observable/of';
import { AuthenticationService } from '../../../../providers/auth/authentication/authentication.service';
import { AuthenticationServiceMock } from '../../../../../test-config/services-mocks/authentication-service.mock';
import { APP_STRINGS, VEHICLE_TYPE } from '../../../../app/app.enums';
// import { FirebaseLogsService } from '../../../../providers/firebase-logs/firebase-logs.service';
// import { FirebaseLogsServiceMock } from '../../../../../test-config/services-mocks/firebaseLogsService.mock';
import { VehicleDataMock } from '../../../../assets/data-mocks/vehicle-data.mock';
import { CommonFunctionsService } from '../../../../providers/utils/common-functions';
import { VehicleModel } from '../../../../models/vehicle/vehicle.model';

describe('Component: AddPreparerPage', () => {
  let comp: AddPreparerPage;
  let fixture: ComponentFixture<AddPreparerPage>;
  let preparerService: PreparerService;
  let testService: TestService;
  let navCtrl: NavController;
  let vehicleService: VehicleService;
  let visitService: VisitService;
  let preparerServiceSpy: any;
  // let firebaseLogsService: FirebaseLogsService;

  const TECH_RECORD: VehicleTechRecordModel = TechRecordDataMock.VehicleTechRecordData;
  const VEHICLE: VehicleModel = VehicleDataMock.VehicleData;

  beforeEach(async(() => {
    preparerServiceSpy = jasmine.createSpyObj('PreparerService', [
      { getPreparersFromStorage: of(PreparersDataMock.PreparersData) }
    ]);
    TestBed.configureTestingModule({
      declarations: [AddPreparerPage],
      imports: [IonicModule.forRoot(AddPreparerPage), PipesModule],
      providers: [
        NavController,
        TestService,
        CommonFunctionsService,
        // { provide: FirebaseLogsService, useClass: FirebaseLogsServiceMock },
        { provide: AlertController, useFactory: () => AlertControllerMock.instance() },
        { provide: AuthenticationService, useClass: AuthenticationServiceMock },
        { provide: NavParams, useClass: NavParamsMock },
        { provide: PreparerService, useValue: preparerServiceSpy },
        { provide: VehicleService, useClass: VehicleServiceMock },
        { provide: ViewController, useClass: ViewControllerMock },
        { provide: VisitService, useClass: VisitDataMock },
        { provide: AppService, useClass: AppServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPreparerPage);
    comp = fixture.componentInstance;
    preparerService = TestBed.get(PreparerService);
    testService = TestBed.get(TestService);
    navCtrl = TestBed.get(NavController);
    vehicleService = TestBed.get(VehicleService);
    visitService = TestBed.get(VisitService);
    // firebaseLogsService = TestBed.get(FirebaseLogsService);
  });

  beforeEach(() => {
    const navParams = fixture.debugElement.injector.get(NavParams);

    navParams.get = jasmine.createSpy('get').and.callFake((param) => {
      const params = {
        test: VisitDataMock.VisitTestData,
        vehicle: TECH_RECORD
      };
      return params[param];
    });
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
    preparerService = null;
    testService = null;
    vehicleService = null;
    visitService = null;
    // firebaseLogsService = null;
  });

  it('should create the component', () => {
    expect(fixture).toBeTruthy();
    expect(comp).toBeTruthy();
    expect(preparerService).toBeTruthy();
    expect(testService).toBeTruthy();
    expect(visitService).toBeTruthy();
  });

  it('should test ionViewDidEnterLogic', () => {
    // spyOn(firebaseLogsService, 'setScreenName');
    // comp.ionViewDidEnter();
    // expect(firebaseLogsService.setScreenName).toHaveBeenCalled();
  });

  it('should VehicleService and TestCancelPage Component share the same instance', inject(
    [VehicleService],
    (injectService: VehicleService) => {
      expect(injectService).toBe(vehicleService);
    }
  ));

  it('should test checkForMatch', () => {
    expect(comp.checkForMatch(VEHICLE.techRecord.vehicleType, VEHICLE_TYPE.PSV)).toBeTruthy();
  });

  it('should format the data from confirm with a preparer selected', () => {
    spyOn(comp, 'presentPreparerConfirm').and.callThrough();
    comp.preparers = PreparersDataMock.PreparersData;
    comp.searchValue = 'AK4434';
    comp.formatDataForConfirm();
    expect(comp.presentPreparerConfirm).toHaveBeenCalledWith(
      {
        preparerId: 'AK4434',
        preparerName: 'Durrell Vehicles Limited'
      },
      false
    );
  });

  it('should format the data from confirm without a preparer selected', () => {
    spyOn(comp, 'presentPreparerConfirm').and.callThrough();
    comp.preparers = PreparersDataMock.PreparersData;
    comp.searchValue = '';
    comp.formatDataForConfirm();
    expect(comp.presentPreparerConfirm).toHaveBeenCalledWith(
      {
        preparerId: 'No preparer ID given',
        preparerName: ''
      },
      false,
      false
    );
  });

  it('should format the data from confirm with a preparer not found', () => {
    spyOn(comp, 'presentPreparerConfirm').and.callThrough();
    comp.preparers = PreparersDataMock.PreparersData;
    comp.searchValue = 'xxx';
    comp.formatDataForConfirm();
    expect(comp.presentPreparerConfirm).toHaveBeenCalledWith(
      {
        preparerId: 'No preparer ID found',
        preparerName: ''
      },
      false,
      false,
      true
    );
  });

  it('should get data from service', () => {
    expect(comp.preparers).toBeDefined();
  });

  it('should check if user has rights to test selected vehicle', () => {
    let result: boolean;

    comp.vehicleData = {
      techRecord: {
        vehicleType: VEHICLE_TYPE.PSV
      }
    } as VehicleModel;

    result = comp.ionViewCanEnter();
    expect(result).toBeTruthy();

    comp.vehicleData = {
      techRecord: {
        vehicleType: VEHICLE_TYPE.HGV
      }
    } as VehicleModel;

    result = comp.ionViewCanEnter();
    expect(result).toBeTruthy();
  });

  it('should check if firebase.logEvent was called', () => {
    // spyOn(firebaseLogsService, 'logEvent');
    // comp.logIntoFirebase();
    // expect(firebaseLogsService.logEvent).toHaveBeenCalled();
  });

  it('should check if searchValue is updated or not', () => {
    let vehicles = [];
    expect(comp.searchValue).toBeFalsy();
    comp.autoPopulatePreparerInput(vehicles);
    expect(comp.searchValue).toBeFalsy();

    let vehicle = VehicleDataMock.VehicleData;
    vehicle.preparerId = 'qwerty';
    vehicles.push(vehicle);
    expect(comp.searchValue).toBeFalsy();
    comp.autoPopulatePreparerInput(vehicles);
    expect(comp.searchValue).toEqual('qwerty');

    comp.searchValue = '';
    vehicles[0].preparerId = APP_STRINGS.NO_PREPARER_ID_GIVEN;
    expect(comp.searchValue).toBeFalsy();
    comp.autoPopulatePreparerInput(vehicles);
    expect(comp.searchValue).toBeFalsy();
  });

  it('should test ngOnInit logic, autoPopulatePreparerInput method should be called', () => {
    spyOn(comp, 'autoPopulatePreparerInput');
    spyOn(comp, 'getPreparers');
    comp.testData = VisitDataMock.VisitTestData;
    comp.ngOnInit();
    expect(comp.autoPopulatePreparerInput).toHaveBeenCalled();
    expect(comp.getPreparers).toHaveBeenCalled();
  });
});
