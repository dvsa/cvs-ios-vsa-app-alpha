import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StorageService } from '../natives/storage.service';
import { from } from 'rxjs/observable/from';
import {
  DEFICIENCY_CATEGORY,
  STORAGE,
  TEST_TYPE_RESULTS,
  VEHICLE_TYPE
} from '../../app/app.enums';
import { TestTypeModel } from '../../models/tests/test-type.model';
import {
  DefectDetailsModel,
  SpecialistCustomDefectModel
} from '../../models/defects/defect-details.model';
import { VisitService } from '../visit/visit.service';
import { TestTypesReferenceDataModel } from '../../models/reference-data-models/test-types.model';
import { CommonFunctionsService } from '../utils/common-functions';
// import { FirebaseLogsService } from '../firebase-logs/firebase-logs.service';
import { VehicleModel } from '../../models/vehicle/vehicle.model';
import { AdrTestTypesData } from '../../assets/app-data/test-types-data/adr-test-types.data';
import { TirTestTypesData } from '../../assets/app-data/test-types-data/tir-test-types.data';
import { LecTestTypesData } from '../../assets/app-data/test-types-data/lec-test-types.data';
import { SpecialistTestTypesData } from '../../assets/app-data/test-types-data/specialist-test-types.data';
import { NotifiableAlterationTestTypesData } from '../../assets/app-data/test-types-data/notifiable-alteration-test-types.data';

@Injectable()
export class TestTypeService {
  constructor(
    private storageService: StorageService,
    public visitService: VisitService,
    // private firebaseLogsService: FirebaseLogsService
    public commonFunctions: CommonFunctionsService
  ) {}

  createTestType(testType: TestTypesReferenceDataModel, vehicleType: string): TestTypeModel {
    let newTestType = {} as TestTypeModel;
    newTestType.name = testType.name;
    newTestType.testTypeName = testType.testTypeName;
    newTestType.testTypeId = testType.id;
    newTestType.certificateNumber = null;
    newTestType.secondaryCertificateNumber = null;
    newTestType.testTypeStartTimestamp = new Date().toISOString();
    newTestType.testTypeEndTimestamp = null;
    if (vehicleType === VEHICLE_TYPE.PSV) {
      newTestType.numberOfSeatbeltsFitted = null;
      newTestType.lastSeatbeltInstallationCheckDate = null;
      newTestType.seatbeltInstallationCheckDate = null;
    }
    if (vehicleType !== VEHICLE_TYPE.TRL) {
      newTestType.modType = null;
      newTestType.emissionStandard = null;
      newTestType.fuelType = null;
      newTestType.smokeTestKLimitApplied = null;
      newTestType.particulateTrapFitted = null;
      newTestType.particulateTrapSerialNumber = null;
      newTestType.modificationTypeUsed = null;
    }
    newTestType.testExpiryDate = null;
    newTestType.testResult = null;
    newTestType.prohibitionIssued = false;
    newTestType.reasonForAbandoning = null;
    newTestType.reasons = [];
    newTestType.additionalCommentsForAbandon = null;
    newTestType.additionalNotesRecorded = null;
    newTestType.defects = [];
    this.isSpecialistTestType(newTestType.testTypeId)
      ? (newTestType.customDefects = [])
      : (newTestType.customDefects = null);
    newTestType.linkedIds = testType.linkedIds;
    this.visitService.updateVisit();
    return newTestType;
  }

  endTestType(testType: TestTypeModel) {
    testType.testTypeEndTimestamp = new Date().toISOString();
  }

  addDefect(testType: TestTypeModel, defect: DefectDetailsModel) {
    testType.defects.push(defect);
    this.visitService.updateVisit();
    this.logFirebaseAddDefect(defect.deficiencyRef);
  }

  private logFirebaseAddDefect(deficiencyRef: string) {
    // this.firebaseLogsService.logEvent(
    //   FIREBASE_DEFECTS.ADD_DEFECT,
    //   FIREBASE_DEFECTS.DEFICIENCY_REFERENCE,
    //   deficiencyRef
    // );
    // let parameters = this.firebaseLogsService[FIREBASE_DEFECTS.ADD_DEFECT_TIME_TAKEN];
    // parameters[FIREBASE_DEFECTS.ADD_DEFECT_END_TIME] = Date.now();
    // parameters[
    //   FIREBASE_DEFECTS.ADD_DEFECT_TIME_TAKEN
    // ] = this.firebaseLogsService.differenceInSeconds(
    //   parameters[FIREBASE_DEFECTS.ADD_DEFECT_START_TIME],
    //   parameters[FIREBASE_DEFECTS.ADD_DEFECT_END_TIME]
    // );
    // this.firebaseLogsService.logEvent(
    //   FIREBASE_DEFECTS.ADD_DEFECT_TIME_TAKEN,
    //   FIREBASE_DEFECTS.ADD_DEFECT_START_TIME,
    //   parameters[FIREBASE_DEFECTS.ADD_DEFECT_START_TIME],
    //   FIREBASE_DEFECTS.ADD_DEFECT_END_TIME,
    //   parameters[FIREBASE_DEFECTS.ADD_DEFECT_END_TIME],
    //   FIREBASE_DEFECTS.ADD_DEFECT_TIME_TAKEN,
    //   parameters[FIREBASE_DEFECTS.ADD_DEFECT_TIME_TAKEN]
    // );
  }

  removeDefect(testType: TestTypeModel, defect: DefectDetailsModel) {
    let defIdx = testType.defects
      .map((e) => {
        return e.deficiencyRef;
      })
      .indexOf(defect.deficiencyRef);
    testType.defects.splice(defIdx, 1);
    this.visitService.updateVisit();
    this.logFirebaseRemoveDefect(defect.deficiencyRef);
  }

  removeSpecialistCustomDefect(testType: TestTypeModel, index: number) {
    testType.customDefects.splice(index, 1);
    this.visitService.updateVisit();
    this.logFirebaseRemoveDefect(
      testType.customDefects[index] ? testType.customDefects[index].referenceNumber : null
    );
  }

  private logFirebaseRemoveDefect(deficiencyRef: string) {
    // this.firebaseLogsService.logEvent(
    //   FIREBASE_DEFECTS.REMOVE_DEFECT,
    //   FIREBASE_DEFECTS.DEFICIENCY_REFERENCE,
    //   deficiencyRef
    // );
  }

  getTestTypesFromStorage(): Observable<any> {
    return from(this.storageService.read(STORAGE.TESTTYPES));
  }

  setTestResult(testType: TestTypeModel, hasDefects: boolean): string | TEST_TYPE_RESULTS {
    let result = hasDefects ? TEST_TYPE_RESULTS.PASS : testType.testResult;
    let criticalDeficienciesArr: DefectDetailsModel[] = [];
    if (testType.reasons.length) return TEST_TYPE_RESULTS.ABANDONED;
    if (testType.defects.length)
      testType.defects.forEach((defect: DefectDetailsModel) => {
        switch (defect.deficiencyCategory.toLowerCase()) {
          case DEFICIENCY_CATEGORY.MAJOR:
          case DEFICIENCY_CATEGORY.DANGEROUS:
            criticalDeficienciesArr.push(defect);
            break;
          case DEFICIENCY_CATEGORY.MINOR:
          case DEFICIENCY_CATEGORY.ADVISORY:
            result = TEST_TYPE_RESULTS.PASS;
            break;
        }
      });
    if (criticalDeficienciesArr.length) {
      let criticalDefStatus = criticalDeficienciesArr.every((defect) => {
        return defect.prs;
      });
      result = criticalDefStatus ? TEST_TYPE_RESULTS.PRS : TEST_TYPE_RESULTS.FAIL;
    }
    return result;
  }

  updateLinkedTestResults(vehicle: VehicleModel, testType: TestTypeModel): boolean {
    let blockTestResultSelection = false;
    if (AdrTestTypesData.AdrTestTypesDataIds.indexOf(testType.testTypeId) !== -1) {
      // between Annual test and ADR tests for HGVs and TRLs
      for (let vehicleTestType of vehicle.testTypes) {
        if (
          (vehicleTestType.testTypeId === '40' || vehicleTestType.testTypeId === '94') &&
          vehicleTestType.testResult === TEST_TYPE_RESULTS.FAIL
        ) {
          testType.testResult = TEST_TYPE_RESULTS.FAIL;
          testType.certificateNumber = null;
          testType.testExpiryDate = null;
          blockTestResultSelection = true;
        }
      }
    }
    return blockTestResultSelection;
  }

  areSpecialistCustomDefectsCompleted(testType: TestTypeModel): boolean {
    return testType.customDefects.every((defect: SpecialistCustomDefectModel) => {
      return defect.hasAllMandatoryFields;
    });
  }

  orderTestTypesArray(array, key, order?) {
    return array.sort(this.commonFunctions.orderByStringId(key, order));
  }

  isAdrTestType(testTypeId: string): boolean {
    return AdrTestTypesData.AdrTestTypesDataIds.indexOf(testTypeId) !== -1;
  }

  isLecTestType(testTypeId: string): boolean {
    return LecTestTypesData.LecTestTypesDataIds.indexOf(testTypeId) !== -1;
  }

  isTirTestType(testTypeId: string): boolean {
    return TirTestTypesData.TirTestTypesDataIds.indexOf(testTypeId) !== -1;
  }

  isSpecialistTestType(testTypeId: string): boolean {
    return SpecialistTestTypesData.SpecialistTestTypesIds.indexOf(testTypeId) !== -1;
  }

  isSpecialistIvaTestAndRetestTestType(testTypeId: string): boolean {
    return (
      SpecialistTestTypesData.SpecialistIvaTestAndRetestTestTypeIds.indexOf(testTypeId) !== -1
    );
  }

  isSpecialistTestTypesExceptForCoifAndVoluntaryIvaTestAndRetest(testTypeId: string): boolean {
    return (
      SpecialistTestTypesData.SpecialistTestTypesExceptForCoifAndVoluntaryIvaTestAndRetestIds.indexOf(
        testTypeId
      ) !== -1
    );
  }

  isSpecialistPartOfCoifTestTypes(testTypeId: string): boolean {
    return SpecialistTestTypesData.SpecialistPartOfCoifTestTypesIds.indexOf(testTypeId) !== -1;
  }

  isSpecialistCoifWithAnnualTest(testTypeId: string): boolean {
    return SpecialistTestTypesData.SpecialistCoifWithAnnualTestIds.indexOf(testTypeId) !== -1;
  }

  isPsvNotifiableAlterationTestType(testTypeId: string): boolean {
    return (
      NotifiableAlterationTestTypesData.PsvNotifiableAlterationTestTypeDataIds.indexOf(
        testTypeId
      ) !== -1
    );
  }

  isSpecialistWithoutCertificateNumberCapturedIds(testTypeId: string): boolean {
    return (
      SpecialistTestTypesData.SpecialistWithoutCertificateNumberCapturedIds.indexOf(
        testTypeId
      ) !== -1
    );
  }
}
