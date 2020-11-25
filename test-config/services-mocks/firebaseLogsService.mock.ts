// import { FirebaseLogsService } from "../../src/providers/firebase-logs/firebase-logs.service";

export class FirebaseLogsServiceMock {
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
    add_defect_time_taken: <string>null
  };

  add_test_type_time = {
    add_test_type_start_time: 0,
    add_test_type_end_time: 0,
    add_test_type_time_taken: 0
  };

  constructor() {}

  logEvent(eventName: string, paramName: string, paramValue: any): Promise<any> {
    return Promise.resolve(true);
  }

  setScreenName(screenName: string) {
    return Promise.resolve(true);
  }

  differenceInSeconds(start, end): any {
    // return FirebaseLogsService.prototype.differenceInSeconds(start, end);
  }
}
