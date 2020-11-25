import { async, TestBed } from '@angular/core/testing';
import { TechRecordDataMock } from '../../assets/data-mocks/tech-record-data.mock';
import { TestTypeModel } from '../../models/tests/test-type.model';
import { TestTypeDataModelMock } from '../../assets/data-mocks/data-model/test-type-data-model.mock';
import { VisitService } from '../visit/visit.service';
import { VisitServiceMock } from '../../../test-config/services-mocks/visit-service.mock';
import { HTTPService } from '../global/http.service';
import { VehicleService } from './vehicle.service';
import { PreparersReferenceDataModel } from '../../models/reference-data-models/preparers.model';
import { ODOMETER_METRIC, STORAGE, TEST_TYPE_RESULTS } from '../../app/app.enums';
import { VehicleTechRecordModel } from '../../models/vehicle/tech-record.model';
import { VehicleDataMock } from '../../assets/data-mocks/vehicle-data.mock';
import { Store } from '@ngrx/store';
import { TestStore } from '../../modules/logs/data-store.service.mock';
import { StorageService } from '../natives/storage.service';
import { StorageServiceMock } from '../../../test-config/services-mocks/storage-service.mock';
import { AuthenticationService } from '../auth/authentication/authentication.service';
import { AuthenticationServiceMock } from '../../../test-config/services-mocks/authentication-service.mock';
import { of } from 'rxjs/observable/of';
import { HttpEventType, HttpHeaders } from '@angular/common/http';
import { TestResultsHistoryDataMock } from '../../assets/data-mocks/test-results-history-data.mock';
import { AlertController } from 'ionic-angular';
import { LogsProvider } from '../../modules/logs/logs.service';

describe('Provider: VehicleService', () => {
  let vehicleService: VehicleService;
  let visitService: VisitService;
  let httpService: HTTPService;
  let storageService: StorageService;
  let vehicle = VehicleDataMock.VehicleData;
  let alertCtrl: AlertController;
  let logProvider: LogsProvider;
  let logProviderSpy: any;

  const VEHICLE_TECH_RECORD: VehicleTechRecordModel = TechRecordDataMock.VehicleTechRecordData;
  const TEST_TYPE: TestTypeModel = TestTypeDataModelMock.TestTypeData;
  const PREPARER: PreparersReferenceDataModel = {
    preparerId: 'AK4434',
    preparerName: 'Durrell Vehicles Limited'
  };

  beforeEach(() => {
    const httpServiceSpy = {
      getTechRecords: jasmine.createSpy('getTechRecords').and.callFake(() => of(null)),
      getTestResultsHistory: jasmine.createSpy('getTestResultsHistory').and.callFake(() =>
        of({
          type: {} as HttpEventType.Response,
          clone: {} as any,
          headers: {} as HttpHeaders,
          status: 200,
          statusText: '',
          url: '',
          ok: true,
          body: TestResultsHistoryDataMock.TestResultHistoryData
        })
      )
    };

    logProviderSpy = jasmine.createSpyObj('LogsProvider', {
      dispatchLog: () => true
    });

    TestBed.configureTestingModule({
      providers: [
        VehicleService,
        { provide: VisitService, useClass: VisitServiceMock },
        { provide: HTTPService, useValue: httpServiceSpy },
        { provide: Store, useClass: TestStore },
        { provide: StorageService, useClass: StorageServiceMock },
        { provide: AuthenticationService, useClass: AuthenticationServiceMock },
        { provide: LogsProvider, useValue: logProviderSpy }
      ]
    });
    vehicleService = TestBed.get(VehicleService);
    visitService = TestBed.get(VisitService);
    httpService = TestBed.get(HTTPService);
    storageService = TestBed.get(StorageService);
    logProvider = TestBed.get(LogsProvider);
  });

  afterEach(() => {
    vehicleService = null;
    visitService = null;
    httpService = null;
  });

  it('should create a new vehicle', () => {
    let newVehicle;
    expect(newVehicle).toBeUndefined();
    newVehicle = vehicleService.createVehicle(VEHICLE_TECH_RECORD);
    expect(newVehicle.techRecord).toBeDefined();
    expect(newVehicle.vrm).toEqual('BQ91YHQ');
  });

  it('should create a new vehicle with vehicle categorry included', () => {
    let vehicleWithCategory = { ...VEHICLE_TECH_RECORD };
    vehicleWithCategory.techRecord[0].euVehicleCategory = 'n1';
    let createdVehicle;
    expect(createdVehicle).toBeUndefined();
    createdVehicle = vehicleService.createVehicle(vehicleWithCategory);
    expect(createdVehicle.techRecord.euVehicleCategory).toEqual('n1');
  });

  it('should create a vehicle with null VRM if vrms array is empty', () => {
    let newVehicle;
    expect(newVehicle).toBeUndefined();
    let vehicleTechRecord = { ...VEHICLE_TECH_RECORD };
    vehicleTechRecord.vrms = [];
    newVehicle = vehicleService.createVehicle(vehicleTechRecord);
    expect(newVehicle.techRecord).toBeDefined();
    expect(newVehicle.vrm).toBeNull();
  });

  it('should add a test-type to vehicle.testTypes array', () => {
    let newVehicle = vehicleService.createVehicle(VEHICLE_TECH_RECORD);
    expect(newVehicle.testTypes.length).toBe(0);
    vehicleService.addTestType(newVehicle, TEST_TYPE);
    expect(newVehicle.testTypes.length).toBe(1);
  });

  it('should add odometer values', () => {
    let odomReading: string = '1234';
    let odomMetric: ODOMETER_METRIC = ODOMETER_METRIC.KILOMETRES;
    let newVehicle = vehicleService.createVehicle(VEHICLE_TECH_RECORD);
    expect(newVehicle.odometerMetric).toBeFalsy();
    expect(newVehicle.odometerReading).toBeFalsy();
    vehicleService.setOdometer(newVehicle, odomReading, odomMetric);
    expect(newVehicle.odometerReading).toBe(odomReading);
    expect(newVehicle.odometerMetric).toBe(odomMetric);
  });

  it('should remove the added test-type from vehicle.testTypes array', () => {
    let newVehicle = vehicleService.createVehicle(VEHICLE_TECH_RECORD);
    expect(newVehicle.testTypes.length).toBe(0);
    vehicleService.addTestType(newVehicle, TEST_TYPE);
    expect(newVehicle.testTypes.length).toBe(1);
    vehicleService.removeTestType(newVehicle, TEST_TYPE);
    expect(newVehicle.testTypes.length).toBe(0);
  });

  it('should add preparer to vehicle', () => {
    let newVehicle = vehicleService.createVehicle(VEHICLE_TECH_RECORD);
    expect(newVehicle.preparerId).toBeFalsy();
    expect(newVehicle.preparerName).toBeFalsy();
    vehicleService.addPreparer(newVehicle, PREPARER);
    expect(newVehicle.preparerId).toBeTruthy();
    expect(newVehicle.preparerName).toBeTruthy();
  });

  it('should format odometer reading value', () => {
    let number = '1000';
    expect(vehicleService.formatOdometerReadingValue(number)).toBe('1,000');

    number = null;
    expect(vehicleService.formatOdometerReadingValue(null)).toBeNull();
  });

  it('should check if httpService.getTechRecords was called', () => {
    vehicleService.getVehicleTechRecords('BQ91YHQ', 'all');
    expect(httpService.getTechRecords).toHaveBeenCalled();
  });

  it('should check if httpService.getTestResultsHistory was called', () => {
    vehicleService.getTestResultsHistory('BQ91YHQ');
    expect(httpService.getTestResultsHistory).toHaveBeenCalled();
  });

  it('should test hasOnlyOneTestTypeWithSic', () => {
    for (let i = 0; i <= 3; i++) vehicle.testTypes.push(TEST_TYPE);
    vehicle.testTypes.push({
      name: 'annual test',
      testTypeName: 'Annual test',
      testTypeId: '1',
      certificateNumber: null,
      secondaryCertificateNumber: null,
      testTypeStartTimestamp: '2018-12-19T00:00:00.000Z',
      testTypeEndTimestamp: null,
      numberOfSeatbeltsFitted: null,
      lastSeatbeltInstallationCheckDate: null,
      seatbeltInstallationCheckDate: false,
      prohibitionIssued: null,
      additionalNotesRecorded: null,
      testResult: TEST_TYPE_RESULTS.PASS,
      reasonForAbandoning: null,
      additionalCommentsForAbandon: null,
      defects: [],
      reasons: [],
      linkedIds: null
    });
    let onlyOne = vehicleService.hasOnlyOneTestTypeWithSic(vehicle);
    expect(onlyOne).toBeTruthy();
  });

  it('should update ionic storage when retrieving test results history', async(() => {
    const systemNumber = '10000000';
    spyOn(storageService, 'update');
    vehicleService.getTestResultsHistory(systemNumber).subscribe(() => {
      expect(storageService.update).toHaveBeenCalledTimes(1);
      expect(storageService.update).toHaveBeenCalledWith(
        STORAGE.TEST_HISTORY + systemNumber,
        TestResultsHistoryDataMock.TestResultHistoryData
      );
    });
  }));

  it('should check if a specific vehicle is a skeleton record or not', () => {
    let vehicle = { ...VehicleDataMock.VehicleData };
    expect(vehicleService.isVehicleSkeleton(vehicle)).toBeFalsy();
    vehicle.techRecord.recordCompleteness = 'skeleton';
    expect(vehicleService.isVehicleSkeleton(vehicle)).toBeTruthy();
  });

  it('should compare two techRecords and return -1 if the first vehicle is not a skeleton but the second is', () => {
    let vehicle1 = { ...VehicleDataMock.VehicleData };
    let vehicle2 = { ...VehicleDataMock.VehicleData };
    vehicle1.techRecord.recordCompleteness = 'complete';
    vehicle2.techRecord.recordCompleteness = 'skeleton';
    expect(vehicleService.compareVehicles(vehicle1, vehicle2)).toEqual(-1);
  });

  it('should compare two techRecords and return 1 if the first vehicle is a skeleton but the second is not', () => {
    let vehicle1 = { ...VehicleDataMock.VehicleData };
    let vehicle2 = { ...VehicleDataMock.VehicleData };
    vehicle1.techRecord.recordCompleteness = 'skeleton';
    vehicle2.techRecord.recordCompleteness = 'complete';
    expect(vehicleService.compareVehicles(vehicle1, vehicle2)).toEqual(1);
  });

  it('should compare two techRecords and return -1 if the first vehicle should alphabetically be before the second one', () => {
    let vehicle1 = { ...VehicleDataMock.VehicleData };
    let vehicle2 = { ...VehicleDataMock.VehicleData };
    vehicle1.techRecord.chassisMake = 'T';
    vehicle2.techRecord.chassisMake = 'W';
    expect(vehicleService.compareVehicles(vehicle1, vehicle2)).toEqual(-1);
  });

  it('should test displayCategoryVehicleKey', () => {
    expect(vehicleService.displayVehicleCategoryKey('n1')).toEqual('n1');
    expect(vehicleService.displayVehicleCategoryKey('l1e-a')).toEqual('l1e-A');
  });
});
