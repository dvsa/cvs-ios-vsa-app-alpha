import { MultipleTechRecordsSelectionPage } from './multiple-tech-records-selection';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AlertController,
  IonicModule,
  LoadingController,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import { NavParamsMock } from '../../../../../../test-config/ionic-mocks/nav-params.mock';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  AlertControllerMock,
  LoadingControllerMock,
  NavControllerMock,
  ViewControllerMock
} from 'ionic-mocks';
import { VehicleService } from '../../../../../providers/vehicle/vehicle.service';
import { VehicleServiceMock } from '../../../../../../test-config/services-mocks/vehicle-service.mock';
import { StorageService } from '../../../../../providers/natives/storage.service';
import { StorageServiceMock } from '../../../../../../test-config/services-mocks/storage-service.mock';
// import { Firebase } from '@ionic-native/firebase';
import { Store } from '@ngrx/store';
import { TestStore } from '../../../../../modules/logs/data-store.service.mock';
import { VehicleDataMock } from '../../../../../assets/data-mocks/vehicle-data.mock';
import { PAGE_NAMES } from '../../../../../app/app.enums';
import { Observable } from 'rxjs';
import { LogsProvider } from '../../../../../modules/logs/logs.service';
import { AuthenticationService } from '../../../../../providers/auth/authentication/authentication.service';
import { AuthenticationServiceMock } from '../../../../../../test-config/services-mocks/authentication-service.mock';

describe('Component: ', () => {
  let component: MultipleTechRecordsSelectionPage;
  let fixture: ComponentFixture<MultipleTechRecordsSelectionPage>;
  let navCtrl: NavController;
  let navParams: NavParams;
  let viewCtrl: ViewController;
  let vehicleService: VehicleService;
  let alertCtrl: AlertController;
  let logProvider: LogsProvider;
  let logProviderSpy: any;

  beforeEach(async(() => {
    logProviderSpy = jasmine.createSpyObj('LogsProvider', {
      dispatchLog: () => true
    });

    TestBed.configureTestingModule({
      declarations: [MultipleTechRecordsSelectionPage],
      imports: [IonicModule.forRoot(MultipleTechRecordsSelectionPage)],
      providers: [
        { provide: NavController, useFactory: () => NavControllerMock.instance() },
        { provide: NavParams, useClass: NavParamsMock },
        { provide: ViewController, useFactory: () => ViewControllerMock.instance() },
        { provide: VehicleService, useClass: VehicleServiceMock },
        { provide: StorageService, useClass: StorageServiceMock },
        { provide: AuthenticationService, useClass: AuthenticationServiceMock },
        // {
        //   provide: Firebase,
        //   useValue: jasmine.createSpyObj<Firebase>(['logEvent', 'setScreenName'])
        // },
        { provide: Store, useClass: TestStore },
        { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
        { provide: AlertController, useFactory: () => AlertControllerMock.instance() },
        { provide: LogsProvider, useValue: logProviderSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleTechRecordsSelectionPage);
    component = fixture.componentInstance;
    navCtrl = TestBed.get(NavController);
    navParams = TestBed.get(NavParams);
    viewCtrl = TestBed.get(ViewController);
    vehicleService = TestBed.get(VehicleService);
    alertCtrl = TestBed.get(AlertController);
    logProvider = TestBed.get(LogsProvider);
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

  it('should create the component', () => {
    expect(fixture).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should check if at at least one vehicle is skeleton', () => {
    component.vehicles = [];
    component.vehicles.push({ ...VehicleDataMock.VehicleData });
    component.ionViewWillEnter();
    expect(component.isAtLeastOneSkeleton).toBeFalsy();
    component.vehicles[0].techRecord.recordCompleteness = 'skeleton';
    component.ionViewWillEnter();
    expect(component.isAtLeastOneSkeleton).toBeTruthy();
  });

  it('should open the vehicle details page if the call to test-results is successful', () => {
    component.openVehicleDetails(VehicleDataMock.VehicleData);
    expect(navCtrl.push).toHaveBeenCalledWith(PAGE_NAMES.VEHICLE_DETAILS_PAGE, {
      test: undefined,
      vehicle: VehicleDataMock.VehicleData
    });
  });

  it('should open the vehicle details page if the call to test-results is failing', () => {
    spyOn(vehicleService, 'getTestResultsHistory').and.returnValue(Observable.throw('error'));
    component.openVehicleDetails(VehicleDataMock.VehicleData);
    expect(navCtrl.push).toHaveBeenCalledWith(PAGE_NAMES.VEHICLE_DETAILS_PAGE, {
      test: undefined,
      vehicle: VehicleDataMock.VehicleData
    });
    let skeletonVehicle = { ...VehicleDataMock.VehicleData };
    skeletonVehicle.techRecord.recordCompleteness = 'skeleton';
    component.openVehicleDetails(skeletonVehicle);
    expect(alertCtrl.create).toHaveBeenCalled();
  });
});
