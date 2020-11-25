import { Injectable } from '@angular/core';
// import { Firebase } from '@ionic-native/firebase';

@Injectable()
export class FirebaseLogsService {
  search_vehicle_time = {
    search_vehicle_start_time: 0,
    search_vehicle_end_time: 0,
    search_vehicle_time_taken: 0
  };

  confirm_vehicle_time = {
    confirm_vehicle_start_time: 0,
    confirm_vehicle_end_time: 0,
    confirm_vehicle_time_taken: 0
  };

  confirm_preparer_time = {
    confirm_preparer_start_time: 0,
    confirm_preparer_end_time: 0,
    confirm_preparer_time_taken: 0
  };

  add_odometer_reading_time = {
    add_odometer_reading_start_time: 0,
    add_odometer_reading_end_time: 0,
    add_odometer_reading_time_taken: 0
  };

  add_defect_time_taken = {
    add_defect_start_time: <number>null,
    add_defect_end_time: <number>null,
    add_defect_time_taken: <number>null
  };

  add_test_type_time = {
    add_test_type_start_time: 0,
    add_test_type_end_time: 0,
    add_test_type_time_taken: 0
  };

  constructor(private firebase: any) {}

  logEvent(
    eventName: string,
    paramName1?: string,
    paramValue1?: any,
    paramName2?: string,
    paramValue2?: any,
    paramName3?: string,
    paramValue3?: any,
    paramName4?: string,
    paramValue4?: any
  ): Promise<any> {
    let data = {};
    if (paramName1) data[paramName1] = paramValue1 || '';
    if (paramName2) data[paramName2] = paramValue2;
    if (paramName3) data[paramName3] = paramValue3;
    if (paramName4) data[paramName4] = paramValue4;

    return data[paramName1]
      ? this.firebase.logEvent(eventName, data)
      : this.firebase.logEvent(eventName, {});
  }

  setScreenName(screenName: string) {
    return this.firebase.setScreenName(screenName);
  }

  differenceInSeconds(start, end): number {
    return Math.round((end - start) / 1000);
  }
}
