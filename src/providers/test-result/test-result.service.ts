import { TestResultModel } from "../../models/tests/test-result.model";
import { VehicleModel } from "../../models/vehicle/vehicle.model";
import { HTTPService } from "../global/http.service";
import { Injectable } from "@angular/core";
import { LEC_CERTIFICATE_NUMBER_PREFIXES, TEST_TYPE_RESULTS, VEHICLE_TYPE } from "../../app/app.enums";
import { CommonFunctionsService } from "../utils/common-functions";
import { TestTypeService } from "../test-type/test-type.service";
import { AuthService } from "../global/auth.service";
import { RoadworthinessTestTypesData } from "../../assets/app-data/test-types-data/roadworthiness-test-types.data";
import { TestTypeModel } from "../../models/tests/test-type.model";
import { FirstTestTypesData } from '../../assets/app-data/test-types-data/first-test-types.data';
import { AdrTestTypesData } from "../../assets/app-data/test-types-data/adr-test-types.data";

@Injectable()
export class TestResultService {

  constructor(
    public authService: AuthService,
    private httpService: HTTPService,
    private commFunc: CommonFunctionsService,
    private testTypeService: TestTypeService) {
  }

  createTestResult(visit, test, vehicle: VehicleModel): TestResultModel {
    let newTestResult = {} as TestResultModel;

    newTestResult.testResultId = test.testResultId;
    /* VISIT */
    newTestResult.testStationName = visit.testStationName;
    newTestResult.testStationPNumber = visit.testStationPNumber;
    newTestResult.testStationType = visit.testStationType;
    newTestResult.testerName = this.authService.testerDetails.testerName;
    newTestResult.testerStaffId = this.authService.testerDetails.testerId;
    newTestResult.testerEmailAddress = this.authService.testerDetails.testerEmail;
    /* TEST */
    newTestResult.testStartTimestamp = test.startTime;
    newTestResult.testEndTimestamp = test.endTime;
    newTestResult.testStatus = test.status;
    newTestResult.reasonForCancellation = test.reasonForCancellation;
    /* VEHICLE */
    if (vehicle.vrm) newTestResult.vrm = vehicle.vrm;
    if (vehicle.trailerId) {
      newTestResult.trailerId = vehicle.trailerId;
    } else {
      newTestResult.odometerReading = vehicle.odometerReading ? parseInt(vehicle.odometerReading) : null;
      newTestResult.odometerReadingUnits = vehicle.odometerMetric ? vehicle.odometerMetric : null;
    }
    if (this.vehicleContainsFirstTests(vehicle)) {
      if (vehicle.techRecord.vehicleType === VEHICLE_TYPE.HGV) newTestResult.regnDate = vehicle.techRecord.regnDate;
      else newTestResult.firstUseDate = vehicle.techRecord.firstUseDate;
    }
    newTestResult.vin = vehicle.vin;
    newTestResult.vehicleClass = vehicle.techRecord.vehicleClass;
    newTestResult.vehicleType = vehicle.techRecord.vehicleType;
    newTestResult.vehicleConfiguration = vehicle.techRecord.vehicleConfiguration;
    newTestResult.preparerId = vehicle.preparerId;
    newTestResult.preparerName = vehicle.preparerName;
    newTestResult.euVehicleCategory = vehicle.euVehicleCategory;
    newTestResult.countryOfRegistration = vehicle.countryOfRegistration;
    newTestResult.noOfAxles = vehicle.techRecord.noOfAxles;
    if (vehicle.techRecord.vehicleSize) newTestResult.vehicleSize = vehicle.techRecord.vehicleSize;
    if (vehicle.techRecord.vehicleType === VEHICLE_TYPE.PSV) newTestResult.numberOfSeats = vehicle.techRecord.seatsLowerDeck + vehicle.techRecord.seatsUpperDeck;
    newTestResult.testTypes = vehicle.testTypes;

    return newTestResult;
  }

  private vehicleContainsFirstTests(vehicle: VehicleModel): boolean {
    return vehicle.testTypes.filter(this.isFirstTest).length > 0;
  }

  private isFirstTest(testType: TestTypeModel): boolean {
    return FirstTestTypesData.FirstTestTypesDataIds.some(id => id === testType.testTypeId);
  }

  concatenateReasonsArray(reasons: string[]) {
    let str = '';
    if (reasons.length > 1) {
      for (let i = 0; i < reasons.length - 1; i++) {
        str += reasons[i] + '. ';
      }
    }
    str += reasons[reasons.length - 1] + '.';

    return str;
  }

  formatCertificateNumber(testType: TestTypeModel) {
    if (testType.certificateNumber && RoadworthinessTestTypesData.RoadworthinessTestTypesIds.indexOf(testType.testTypeId) === -1 && AdrTestTypesData.AdrTestTypesDataIds.indexOf(testType.testTypeId) === -1) {
      return testType.testResult === TEST_TYPE_RESULTS.PASS ? LEC_CERTIFICATE_NUMBER_PREFIXES.LP + testType.certificateNumber : LEC_CERTIFICATE_NUMBER_PREFIXES.LF + testType.certificateNumber;
    } else {
      return testType.certificateNumber;
    }
  }

  submitTestResult(testResult: TestResultModel) {
    let newTestResult = this.commFunc.cloneObject(testResult);

    if (newTestResult.testTypes.length) {
      for (let testType of newTestResult.testTypes) {
        if (testType.hasOwnProperty('linkedIds')) delete testType.linkedIds;
        if (testType.hasOwnProperty('reasons')) {
          if (testType.reasons.length) {
            testType.reasonForAbandoning = this.concatenateReasonsArray(testType.reasons);
          }
          delete testType.reasons;
        }
        testType.certificateNumber = this.formatCertificateNumber(testType);
        delete testType.completionStatus;
        delete testType.testTypeCategoryName;
        if (testType.numberOfSeatbeltsFitted) testType.numberOfSeatbeltsFitted = parseInt(testType.numberOfSeatbeltsFitted);
        this.testTypeService.endTestType(testType);

        if (testType.defects.length) {
          for (let defect of testType.defects) {
            if (defect.hasOwnProperty('metadata')) delete defect.metadata;
          }
        }
      }
    }

    return this.httpService.postTestResult(newTestResult);
  }
}
