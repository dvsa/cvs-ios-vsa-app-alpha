import { TestBed } from '@angular/core/testing';
import { StorageService } from '../natives/storage.service';
import { TestTypeService } from './test-type.service';
import { TestTypesReferenceDataModel } from '../../models/reference-data-models/test-types.model';
import { VisitService } from '../visit/visit.service';
import {
  DefectDetailsModel,
  SpecialistCustomDefectModel
} from '../../models/defects/defect-details.model';
import { DefectDetailsDataMock } from '../../assets/data-mocks/defect-details-data.mock';
import { TestTypesReferenceDataMock } from '../../assets/data-mocks/reference-data-mocks/test-types.mock';
import { CommonFunctionsService } from '../utils/common-functions';
import { TestTypeModel } from '../../models/tests/test-type.model';
import { TestTypeDataModelMock } from '../../assets/data-mocks/data-model/test-type-data-model.mock';
import { TEST_TYPE_RESULTS, VEHICLE_TYPE } from '../../app/app.enums';
// import { FirebaseLogsServiceMock } from '../../../test-config/services-mocks/firebaseLogsService.mock';
// import { FirebaseLogsService } from '../firebase-logs/firebase-logs.service';
import { VehicleDataMock } from '../../assets/data-mocks/vehicle-data.mock';

describe('Provider: TestTypeService', () => {
  let testTypeService: TestTypeService;
  let storageService: StorageService;
  let visitService: VisitService;
  // let firebaseLogsService: FirebaseLogsService;

  let visitServiceSpy: any;
  let storageServiceSpy: any;

  const TEST_TYPES: TestTypesReferenceDataModel[] = TestTypesReferenceDataMock.TestTypesData;
  const DEFECT: DefectDetailsModel = DefectDetailsDataMock.DefectData;

  beforeEach(() => {
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      read: new Promise((resolve) => {
        return TEST_TYPES;
      })
    });
    visitServiceSpy = jasmine.createSpyObj('VisitService', ['updateVisit']);

    TestBed.configureTestingModule({
      providers: [
        TestTypeService,
        CommonFunctionsService,
        { provide: VisitService, useValue: visitServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy }
        // { provide: FirebaseLogsService, useClass: FirebaseLogsServiceMock }
      ]
    });

    testTypeService = TestBed.get(TestTypeService);
    storageService = TestBed.get(StorageService);
    visitService = TestBed.get(VisitService);
    // firebaseLogsService = TestBed.get(FirebaseLogsService);
  });

  afterEach(() => {
    testTypeService = null;
    storageService = null;
    visitService = null;
    // firebaseLogsService = null;
  });

  it('create a testType', () => {
    let testType: TestTypesReferenceDataModel = TEST_TYPES[0];
    let newTestType = testTypeService.createTestType(testType, VEHICLE_TYPE.PSV);
    expect(newTestType.testTypeName).toMatch('Annual test');
  });

  it('should put end time on the testType', () => {
    let testType: TestTypeModel = TestTypeDataModelMock.TestTypeData;
    expect(testType.testTypeEndTimestamp).toBeNull();
    testTypeService.endTestType(testType);
    expect(testType.testTypeEndTimestamp).toBeTruthy();
  });

  it('should add a defect in test array', () => {
    let testType: TestTypeModel = TestTypeDataModelMock.TestTypeData;
    expect(testType.defects.length).toEqual(0);
    testTypeService.addDefect(testType, DEFECT);
    expect(testType.defects.length).toEqual(1);
    expect(visitService.updateVisit).toHaveBeenCalled();
  });

  it('should log exactly 2 events to firebase', () => {
    // let testType: TestTypeModel = TestTypeDataModelMock.TestTypeData;
    // spyOn(firebaseLogsService, 'logEvent').and.returnValue(Promise.resolve(true));
    // testTypeService.addDefect(testType, DEFECT);
    // expect(firebaseLogsService.logEvent).toHaveBeenCalledTimes(2);
  });

  it('should remove a defect from test', () => {
    let testType: TestTypeModel = TestTypeDataModelMock.TestTypeData;
    testType.defects = DefectDetailsDataMock.DefectDetails;
    expect(testType.defects.length).toEqual(2);
    testTypeService.removeDefect(testType, DEFECT);
    expect(testType.defects.length).toEqual(1);
  });

  it('should log the remove event to firebase when removing a defect', () => {
    // let testType: TestTypeModel = TestTypeDataModelMock.TestTypeData;
    // testType.defects = DefectDetailsDataMock.DefectDetails;
    // spyOn(firebaseLogsService, 'logEvent').and.returnValue(Promise.resolve(true));
    // testTypeService.removeDefect(testType, DEFECT);
    // expect(firebaseLogsService.logEvent).toHaveBeenCalledTimes(1);
  });

  it('should set test result to FAIL: hasDefects true', () => {
    let testType: TestTypeModel = TestTypeDataModelMock.TestTypeData;
    let hasDefects: boolean = true;
    testType.defects = DefectDetailsDataMock.DefectDetails;
    let result = testTypeService.setTestResult(testType, hasDefects);
    expect(result).toMatch(TEST_TYPE_RESULTS.FAIL);
  });

  it('should set test result to FAIL: hasDefects false', () => {
    let testType: TestTypeModel = TestTypeDataModelMock.TestTypeData;
    let hasDefects: boolean = false;
    testType.defects = DefectDetailsDataMock.DefectDetails;
    let result = testTypeService.setTestResult(testType, hasDefects);
    expect(result).toMatch(TEST_TYPE_RESULTS.FAIL);
  });

  it('should set test result PASS: hasDefects false', () => {
    let testType: TestTypeModel = TestTypeDataModelMock.TestTypeData;
    let hasDefects: boolean = false;
    let result = testTypeService.setTestResult(testType, hasDefects);
    expect(result).toMatch(TEST_TYPE_RESULTS.PASS);
  });

  it('should set test result PRS: hasDefects false', () => {
    let testType: TestTypeModel = TestTypeDataModelMock.TestTypeData;
    let hasDefects: boolean = true;
    testType.defects.push(DefectDetailsDataMock.DefectData);
    testType.defects[0].prs = true;
    let result = testTypeService.setTestResult(testType, hasDefects);
    expect(result).toMatch(TEST_TYPE_RESULTS.PRS);
  });

  it('should set test result: ABANDONED', () => {
    let testType: TestTypeModel = TestTypeDataModelMock.TestTypeData;
    testType.reasons.push('abandon ship');
    let hasDefects: boolean = true;
    let result = testTypeService.setTestResult(testType, hasDefects);
    expect(result).toMatch(TEST_TYPE_RESULTS.ABANDONED);
  });

  it('should ordered testType array', () => {
    let testTypes: TestTypeModel[] = [];
    testTypes.push(TestTypeDataModelMock.TestTypeData);
    testTypes.push(TestTypeDataModelMock.TestTypeData);
    testTypes[0].testTypeId = '2';
    expect(testTypes[0].testTypeId).toMatch('2');
    let orderedTestTypes: TestTypeModel[] = testTypeService.orderTestTypesArray(
      testTypes,
      'testTypeId',
      'asc'
    );
    expect(orderedTestTypes[0].testTypeId).toMatch('1');
  });

  it('should return data from local storage', () => {
    testTypeService.getTestTypesFromStorage().subscribe((data) => {
      expect(data).toBe(<TestTypesReferenceDataModel[]>TEST_TYPES);
    });
  });

  it('should update test types result when completing an adr and an annual test type at the same time', () => {
    let adrTestType, annualTestType;
    adrTestType = { ...TestTypeDataModelMock.TestTypeData };
    annualTestType = { ...TestTypeDataModelMock.TestTypeData };
    let vehicle = VehicleDataMock.VehicleData;
    adrTestType.testTypeId = '50';
    adrTestType.testResult = TEST_TYPE_RESULTS.PASS;
    adrTestType.certificateNumber = '6776322';
    vehicle.testTypes.push(adrTestType);
    annualTestType.testTypeId = '40'; // or 94
    annualTestType.testResult = TEST_TYPE_RESULTS.FAIL;
    vehicle.testTypes.push(annualTestType);
    expect(testTypeService.updateLinkedTestResults(vehicle, adrTestType)).toBeTruthy();
    expect(vehicle.testTypes[0].testResult).toEqual(TEST_TYPE_RESULTS.FAIL);
    expect(vehicle.testTypes[0].certificateNumber).toEqual(null);

    expect(testTypeService.updateLinkedTestResults(vehicle, annualTestType)).toBeFalsy();
  });

  it('should check if testType is ADR or not', () => {
    let testType = { ...TestTypeDataModelMock.TestTypeData };
    testType.testTypeId = '50';
    expect(testTypeService.isAdrTestType(testType.testTypeId)).toBeTruthy();
    testType.testTypeId = '1';
    expect(testTypeService.isAdrTestType(testType.testTypeId)).toBeFalsy();
  });

  it('should check if testType is LEC or not', () => {
    let testType = { ...TestTypeDataModelMock.TestTypeData };
    testType.testTypeId = '39';
    expect(testTypeService.isLecTestType(testType.testTypeId)).toBeTruthy();
    testType.testTypeId = '1';
    expect(testTypeService.isLecTestType(testType.testTypeId)).toBeFalsy();
  });

  it('should check if testType is TIR or not', () => {
    let testType = { ...TestTypeDataModelMock.TestTypeData };
    testType.testTypeId = '49';
    expect(testTypeService.isTirTestType(testType.testTypeId)).toBeTruthy();
    testType.testTypeId = '1';
    expect(testTypeService.isTirTestType(testType.testTypeId)).toBeFalsy();
  });

  it('should check if testType is specialist test or not', () => {
    let testType = { ...TestTypeDataModelMock.TestTypeData };
    testType.testTypeId = '150';
    expect(testTypeService.isSpecialistTestType(testType.testTypeId)).toBeTruthy();
    testType.testTypeId = '1';
    expect(testTypeService.isSpecialistTestType(testType.testTypeId)).toBeFalsy();
  });

  it('should remove a specific specialist custom defect', () => {
    let testType = { ...TestTypeDataModelMock.TestTypeData };
    testType.customDefects.push({} as SpecialistCustomDefectModel);
    expect(testType.customDefects.length).toEqual(1);

    testTypeService.removeSpecialistCustomDefect(testType, 0);
    expect(testType.customDefects.length).toEqual(0);
  });

  it('should check if custom defects are completely captured', () => {
    let testType = { ...TestTypeDataModelMock.TestTypeData };
    testType.customDefects.push({} as SpecialistCustomDefectModel);
    expect(testTypeService.areSpecialistCustomDefectsCompleted(testType)).toBeFalsy();

    testType.customDefects[0].hasAllMandatoryFields = true;
    expect(testTypeService.areSpecialistCustomDefectsCompleted(testType)).toBeTruthy();
  });

  it('should check if test type is IVA test or retest', () => {
    let testType = { ...TestTypeDataModelMock.TestTypeData };
    testType.testTypeId = '125';
    expect(
      testTypeService.isSpecialistIvaTestAndRetestTestType(testType.testTypeId)
    ).toBeTruthy();
  });

  it('should check if test type is Specialist test except for CoifAndVoluntaryIvaTestAndRetest', () => {
    let testType = { ...TestTypeDataModelMock.TestTypeData };
    testType.testTypeId = '125';
    expect(
      testTypeService.isSpecialistTestTypesExceptForCoifAndVoluntaryIvaTestAndRetest(
        testType.testTypeId
      )
    ).toBeTruthy();
  });

  it('should check if test type is Specialist test part of Coif', () => {
    let testType = { ...TestTypeDataModelMock.TestTypeData };
    testType.testTypeId = '142';
    expect(testTypeService.isSpecialistPartOfCoifTestTypes(testType.testTypeId)).toBeTruthy();
  });

  it('should check if test type is PSV Notifiable Alteration test', () => {
    let testType = { ...TestTypeDataModelMock.TestTypeData };
    testType.testTypeId = '38';
    expect(testTypeService.isPsvNotifiableAlterationTestType(testType.testTypeId)).toBeTruthy();
  });

  it('should check if test type Coif with annual test', () => {
    let testType = { ...TestTypeDataModelMock.TestTypeData };
    testType.testTypeId = '175';
    expect(testTypeService.isSpecialistCoifWithAnnualTest(testType.testTypeId)).toBeTruthy();
  });

  it('should check if test type Coif with annual test', () => {
    let testType = { ...TestTypeDataModelMock.TestTypeData };
    testType.testTypeId = '153';
    expect(
      testTypeService.isSpecialistWithoutCertificateNumberCapturedIds(testType.testTypeId)
    ).toBeTruthy();
  });
});
