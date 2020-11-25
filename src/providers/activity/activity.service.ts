import { Injectable } from '@angular/core';
import { StorageService } from '../natives/storage.service';
import { STORAGE, VISIT } from '../../app/app.enums';
import { AppService } from '../global/app.service';
import { VisitModel } from '../../models/visit/visit.model';
import { ActivityModel } from '../../models/visit/activity.model';
import { AuthenticationService } from '../auth/authentication/authentication.service';
import { HTTPService } from '../global/http.service';
import { TestResultModel } from '../../models/tests/test-result.model';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class ActivityService {
  activities: ActivityModel[] = [];
  waitTimeStarted: boolean = false;
  waitTimer: number;
  counterTime: number = 5;

  constructor(
    private storageService: StorageService,
    private appService: AppService,
    private authenticationService: AuthenticationService,
    private httpService: HTTPService
  ) {}

  createActivity(
    visit: VisitModel,
    activityType?: string,
    pushToActivities?: boolean,
    updateActivities?: boolean
  ): ActivityModel {
    let activity: ActivityModel = {
      activityType: activityType ? activityType : VISIT.ACTIVITY_TYPE_UNACCOUNTABLE_TIME,
      testStationName: visit.testStationName,
      testStationPNumber: visit.testStationPNumber,
      testStationEmail: visit.testStationEmail,
      testStationType: visit.testStationType,
      testerName: this.authenticationService.tokenInfo.testerName,
      testerStaffId: this.authenticationService.tokenInfo.testerId,
      startTime: null,
      endTime: null,
      waitReason: [],
      notes: '',
      parentId: visit.id
    };
    if (pushToActivities) this.activities.push(activity);
    if (updateActivities) this.updateActivities();
    return activity;
  }

  getActivities(): ActivityModel[] {
    return this.activities;
  }

  addActivity(activity: ActivityModel) {
    this.activities.push(activity);
  }

  isVisitStillOpen(): Observable<HttpResponse<boolean>> {
    return this.httpService.getOpenVisitCheck(this.authenticationService.tokenInfo.testerId);
  }

  /**
   * @deprecated stop using in favour of equivalent method taken a @param activities as parameter
   */
  updateActivities() {
    if (this.appService.caching) this.storageService.update(STORAGE.ACTIVITIES, this.activities);
  }

  /**
   * @description use by passing in @param activities
   */
  updateActiviesArgs(activities: ActivityModel[]) {
    if (this.appService.caching) {
      this.storageService.update(STORAGE.ACTIVITIES, activities);
    }
  }

  submitActivity(activity: ActivityModel) {
    return this.httpService.postActivity(activity);
  }

  updateActivityReasons(activities) {
    return this.httpService.updateActivity(activities);
  }

  createActivityBodyForCall(visit, testResult?: TestResultModel, timeline?) {
    let activity = {} as ActivityModel;
    let timeNotTesting = 0;

    if (testResult) {
      let indexTestResult = visit.tests
        .map((elem) => elem.startTime)
        .indexOf(testResult.testStartTimestamp);
      if (indexTestResult === 0) {
        timeNotTesting =
          (Date.parse(testResult.testStartTimestamp) - Date.parse(visit.startTime)) / 1000 / 60;
        timeNotTesting < this.counterTime
          ? (activity = this.createActivity(visit, null, false, false))
          : (activity = this.createActivity(visit, VISIT.ACTIVITY_TYPE_WAIT, false, false));
        activity.startTime = visit.startTime;
        activity.endTime = testResult.testStartTimestamp;
      } else {
        timeNotTesting =
          (Date.parse(testResult.testStartTimestamp) -
            Date.parse(visit.tests[indexTestResult - 1].endTime)) /
          1000 /
          60;
        timeNotTesting < this.counterTime
          ? (activity = this.createActivity(visit, null, false, false))
          : (activity = this.createActivity(visit, VISIT.ACTIVITY_TYPE_WAIT, false, false));
        activity.startTime = visit.tests[indexTestResult - 1].endTime;
        activity.endTime = testResult.testStartTimestamp;
      }
    } else {
      if (timeline.length === 0) {
        timeNotTesting =
          (Date.parse(new Date().toISOString()) - Date.parse(visit.startTime)) / 1000 / 60;
        timeNotTesting < this.counterTime
          ? (activity = this.createActivity(visit, null, false, false))
          : (activity = this.createActivity(visit, VISIT.ACTIVITY_TYPE_WAIT, false, false));
        activity.startTime = visit.startTime;
      } else {
        if (timeline[timeline.length - 1].status) {
          timeNotTesting =
            (Date.parse(new Date().toISOString()) -
              Date.parse(timeline[timeline.length - 1].endTime)) /
            1000 /
            60;
          timeNotTesting < this.counterTime
            ? (activity = this.createActivity(visit, null, false, false))
            : (activity = this.createActivity(visit, VISIT.ACTIVITY_TYPE_WAIT, false, false));
          activity.startTime = timeline[timeline.length - 1].endTime;
        } else {
          timeNotTesting =
            (Date.parse(new Date().toISOString()) -
              Date.parse(timeline[timeline.length - 1].startTime)) /
            1000 /
            60;
          timeNotTesting < this.counterTime
            ? (activity = this.createActivity(visit, null, false, false))
            : (activity = this.createActivity(visit, VISIT.ACTIVITY_TYPE_WAIT, false, false));
          activity.startTime = timeline[timeline.length - 1].startTime;
        }
      }
      activity.endTime = new Date().toISOString();
    }
    activity.notes = null;
    return activity;
  }

  createActivitiesForUpdateCall(activitiesArr: ActivityModel[]) {
    let activitiesForUpdate = [];
    for (let activity of activitiesArr) {
      let updActivity = {
        id: activity.id,
        waitReason: activity.waitReason,
        notes: activity.notes ? activity.notes : null
      };
      activitiesForUpdate.push(updActivity);
    }
    return activitiesForUpdate;
  }
}
