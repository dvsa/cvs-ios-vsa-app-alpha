import { TestBed } from '@angular/core/testing';
import { TestResultService } from './test-result.service';
import { VisitDataMock } from '../../assets/data-mocks/visit-data.mock';
import { VehicleDataMock } from '../../assets/data-mocks/vehicle-data.mock';
import { HTTPService } from '../global/http.service';
import { CommonFunctionsService } from '../utils/common-functions';
import { TestTypeService } from '../test-type/test-type.service';
import { TestTypeServiceMock } from '../../../test-config/services-mocks/test-type-service.mock';
import { TestTypeDataModelMock } from '../../assets/data-mocks/data-model/test-type-data-model.mock';
import { DefectDetailsDataMock } from '../../assets/data-mocks/defect-details-data.mock';
import { TEST_TYPES_IDS, SPEC_VALUES, VEHICLE_TYPE } from '../../app/app.enums';
import { SpecialistCustomDefectModel } from '../../models/defects/defect-details.model';
import { AuthenticationService } from '../auth/authentication/authentication.service';
import { AuthenticationServiceMock } from '../../../test-config/services-mocks/authentication-service.mock';

describe('Provider: TestResultService', () => {
  let testResultService: TestResultService;
  let authenticationService: AuthenticationService;
  let httpService: HTTPService;
  let httpServiceSpy: any;

  const VISIT = VisitDataMock.VisitData;
  const TEST = VisitDataMock.VisitTestData;
  const VEHICLE = VehicleDataMock.VehicleData;

  const REASONS: string[] = [
    'The vehicle was not submitted for test at the appointed time',
    'The relevant test fee has not been paid',
    'Current Health and Safety legislation cannot be met in testing the vehicle'
  ];

  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj('HTTPService', ['postTestResult']);

    TestBed.configureTestingModule({
      providers: [
        TestResultService,
        CommonFunctionsService,
        { provide: AuthenticationService, useClass: AuthenticationServiceMock },
        { provide: TestTypeService, useClass: TestTypeServiceMock },
        { provide: HTTPService, useValue: httpServiceSpy }
      ]
    });

    authenticationService = TestBed.get(AuthenticationService);
    testResultService = TestBed.get(TestResultService);
    httpService = TestBed.get(HTTPService);
  });

  afterEach(() => {
    testResultService = null;
    httpService = null;
    authenticationService = null;
  });

  it('should create a test result', () => {
    let testResult;
    expect(testResult).toBeUndefined();
    testResult = testResultService.createTestResult(VISIT, TEST, VEHICLE);
    expect(testResult).toBeDefined();
  });

  it('should concatenate the reasons array into one string', function() {
    let resultedString = '';
    expect(resultedString.length).toEqual(0);
    resultedString = testResultService.concatenateReasonsArray(REASONS);
    expect(resultedString.length).toBeGreaterThan(1);
  });

  it('should concatenate the reasons array into one string', function() {
    let resultedString = '';
    let reasons: string[] = [];
    expect(resultedString.length).toEqual(0);
    resultedString = testResultService.concatenateReasonsArray(reasons);
    expect(resultedString.length).toBeGreaterThan(1);
  });

  it('should submit a test result(no testTypes) calling httpService.postTestResult', () => {
    let testResult = testResultService.createTestResult(VISIT, TEST, VEHICLE);
    testResultService.submitTestResult(testResult);
    expect(httpService.postTestResult).toHaveBeenCalled();
  });

  it('should submit a test result(with testTypes) calling httpService.postTestResult', () => {
    let testResult = testResultService.createTestResult(VISIT, TEST, VEHICLE);
    testResult.testTypes.push(TestTypeDataModelMock.TestTypeData);
    testResultService.submitTestResult(testResult);
    expect(httpService.postTestResult).toHaveBeenCalled();
  });

  it('should submit a test result(with testTypes + reasons.length > 1; certificateNumber) calling httpService.postTestResult', () => {
    let testResult = testResultService.createTestResult(VISIT, TEST, VEHICLE);
    testResult.testTypes.push(TestTypeDataModelMock.TestTypeData);
    testResult.testTypes[0].reasons = REASONS;
    testResult.testTypes[0].certificateNumber = 'g34g3g34g3';
    testResultService.submitTestResult(testResult);
    expect(httpService.postTestResult).toHaveBeenCalled();
  });

  it('should submit a test result(with testTypes + no reasons + numberOfSeatbeltsFitted + defects added with/no metadata) calling httpService.postTestResult', () => {
    let testResult = testResultService.createTestResult(VISIT, TEST, VEHICLE);
    testResult.testTypes.push(TestTypeDataModelMock.TestTypeData);
    delete testResult.testTypes[0].reasons;
    testResult.testTypes[0].certificateNumber = 'g34g3g34g3';
    testResult.testTypes[0].testResult = 'g34g3g34g3';
    testResult.testTypes[0].numberOfSeatbeltsFitted = 2;
    let defect1 = DefectDetailsDataMock.DefectData;
    let defect2 = DefectDetailsDataMock.DefectData;
    delete defect2.metadata;
    testResult.testTypes[0].defects.push(defect1);
    testResult.testTypes[0].defects.push(defect2);

    testResultService.submitTestResult(testResult);
    expect(httpService.postTestResult).toHaveBeenCalled();
  });

  it('should return the correct format of the certificateNumber depending on whether it is tir or not', () => {
    let testType = TestTypeDataModelMock.TestTypeData;
    expect(testResultService.formatCertificateNumber(testType, 'psv')).toEqual(null);
    testType.certificateNumber = SPEC_VALUES.CERTIFICATE_NUMBER;
    expect(testResultService.formatCertificateNumber(testType, 'psv')).toEqual(
      SPEC_VALUES.CERTIFICATE_NUMBER
    );
    testType.testTypeId = TEST_TYPES_IDS._49;
    expect(testResultService.formatCertificateNumber(testType, 'hgv')).toEqual(
      SPEC_VALUES.TIR_CERTIFICATE_NUMBER
    );
  });

  it('should create a test result containing the correct firstUseDate if the test contains a trailer with a first test or annual test', () => {
    let trailer = VehicleDataMock.VehicleData;
    trailer.techRecord.vehicleType = VEHICLE_TYPE.TRL;
    trailer.techRecord.firstUseDate = '2019-06-24';
    let firstTest = TestTypeDataModelMock.TestTypeData;
    firstTest.testTypeId = '95';
    trailer.testTypes.push(firstTest);
    let testResult = testResultService.createTestResult(VISIT, TEST, trailer);

    expect(testResult.firstUseDate).toBeTruthy();
    expect(testResult.firstUseDate).toBe(trailer.techRecord.firstUseDate);

    let annualTest = TestTypeDataModelMock.TestTypeData;
    annualTest.testTypeId = '94';
    trailer.testTypes = [];
    trailer.testTypes.push(annualTest);
    testResult = testResultService.createTestResult(VISIT, TEST, trailer);

    expect(testResult.firstUseDate).toBeTruthy();
    expect(testResult.firstUseDate).toBe(trailer.techRecord.firstUseDate);
  });

  it('should create a test result not containing firstUseDate if the test has a trailer with without a first test or annual test', () => {
    let trailer = VehicleDataMock.VehicleData;
    trailer.techRecord.vehicleType = VEHICLE_TYPE.TRL;
    trailer.techRecord.firstUseDate = '2019-06-24';
    let test = TestTypeDataModelMock.TestTypeData;
    trailer.testTypes.push(test);
    let testResult = testResultService.createTestResult(VISIT, TEST, trailer);

    expect(testResult.firstUseDate).toBeFalsy();
  });

  it('should create a test result containing the correct regnDate if the test contains an HGV with a first test or annual test', () => {
    let hgv = VehicleDataMock.VehicleData;
    hgv.techRecord.vehicleType = VEHICLE_TYPE.HGV;
    hgv.techRecord.regnDate = '2019-06-24';
    let firstTest = TestTypeDataModelMock.TestTypeData;
    firstTest.testTypeId = '65';
    hgv.testTypes.push(firstTest);
    let testResult = testResultService.createTestResult(VISIT, TEST, hgv);

    expect(testResult.regnDate).toBeTruthy();
    expect(testResult.regnDate).toBe(hgv.techRecord.regnDate);

    let annualTest = TestTypeDataModelMock.TestTypeData;
    annualTest.testTypeId = '40';
    hgv.testTypes = [];
    hgv.testTypes.push(annualTest);
    testResult = testResultService.createTestResult(VISIT, TEST, hgv);

    expect(testResult.regnDate).toBeTruthy();
    expect(testResult.regnDate).toBe(hgv.techRecord.regnDate);
  });

  it('should create a test result not containing regnDate if the test has an HGV with without a first test or annual test', () => {
    let hgv = VehicleDataMock.VehicleData;
    hgv.techRecord.vehicleType = VEHICLE_TYPE.HGV;
    hgv.techRecord.regnDate = '2019-06-24';
    let test = TestTypeDataModelMock.TestTypeData;
    hgv.testTypes.push(test);
    let testResult = testResultService.createTestResult(VISIT, TEST, hgv);

    expect(testResult.regnDate).toBeFalsy();
  });

  it('should create a test result containing the correct regnDate if the test contains an PSV with an annual test that generates certificate', () => {
    let psv = { ...VehicleDataMock.VehicleData };
    psv.techRecord.vehicleType = VEHICLE_TYPE.PSV;
    psv.techRecord.regnDate = '2019-06-24';
    let annualTest = { ...TestTypeDataModelMock.TestTypeData };
    annualTest.testTypeId = '28';
    psv.testTypes.push(annualTest);
    let testResult = testResultService.createTestResult(VISIT, TEST, psv);

    expect(testResult.regnDate).toBeTruthy();
    expect(testResult.regnDate).toBe(psv.techRecord.regnDate);
  });

  it('should create a test result not containing regnDate if the test has an PSV without an annual test that generates certificate', () => {
    let psv = { ...VehicleDataMock.VehicleData };
    psv.techRecord.vehicleType = VEHICLE_TYPE.PSV;
    psv.techRecord.regnDate = '2019-06-24';
    let test = { ...TestTypeDataModelMock.TestTypeData };
    test.testTypeId = '56';
    psv.testTypes.push(test);
    let testResult = testResultService.createTestResult(VISIT, TEST, psv);

    expect(testResult.regnDate).toBeFalsy();
  });

  it('should create a test result not containing vehicle subclass if the vehicle is a car or a lgv', () => {
    let testResult;
    let psv = { ...VehicleDataMock.VehicleData };
    psv.techRecord.vehicleType = VEHICLE_TYPE.PSV;
    testResult = testResultService.createTestResult(VISIT, TEST, psv);
    expect(testResult.vehicleSubclass).toBe(undefined);

    let car = { ...VehicleDataMock.VehicleData };
    car.techRecord.vehicleType = VEHICLE_TYPE.CAR;
    testResult = testResultService.createTestResult(VISIT, TEST, car);
    expect(testResult.vehicleSubclass).not.toBe(undefined);
  });

  it('should move Coif Certificate Numbers To Secondary Certificate Number Field', () => {
    let testType = { ...TestTypeDataModelMock.TestTypeData };
    testType.testTypeId = '142';
    testType.certificateNumber = 'certNo';
    expect(testType.secondaryCertificateNumber).toBe(null);
    testResultService.moveCoifCertificateNumbersToSecondaryCertificateNumberField(testType);
    expect(testType.secondaryCertificateNumber).toEqual('certNo');
    expect(testType.certificateNumber).toBe(null);
  });

  it('should format the custom defects before submitting the testResult', () => {
    let testType = { ...TestTypeDataModelMock.TestTypeData };
    testType.testTypeId = '125';
    testType.customDefects.push({} as SpecialistCustomDefectModel);
    testType.customDefects[0].referenceNumber = 'fs34';
    testType.customDefects[0].defectName = 'name';
    testType.customDefects[0].hasAllMandatoryFields = true;
    expect(testType.customDefects[0].defectNotes).toBe(undefined);
    testResultService.formatCustomDefects(testType);
    expect(testType.customDefects[0].defectNotes).toBe(null);
    expect(testType.customDefects[0].hasAllMandatoryFields).toBe(undefined);
  });
});
