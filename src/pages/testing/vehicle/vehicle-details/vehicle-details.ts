import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

import { TestModel } from '../../../../models/tests/test.model';
import { VehicleModel } from '../../../../models/vehicle/vehicle.model';
import { CommonFunctionsService } from '../../../../providers/utils/common-functions';
import {
  APP_STRINGS,
  DATE_FORMAT,
  PAGE_NAMES,
  STORAGE,
  TECH_RECORD_STATUS,
  VEHICLE_TYPE
} from '../../../../app/app.enums';
import { StorageService } from '../../../../providers/natives/storage.service';
import { default as AppConfig } from '../../../../../config/application.hybrid';
// import { FirebaseLogsService } from '../../../../providers/firebase-logs/firebase-logs.service';
import { AppService } from '../../../../providers/global/app.service';

@IonicPage()
@Component({
  selector: 'page-vehicle-details',
  templateUrl: 'vehicle-details.html'
})
export class VehicleDetailsPage {
  VEHICLE_TYPE: typeof VEHICLE_TYPE = VEHICLE_TYPE;
  SPECIAL_VEHICLE_TYPES: VEHICLE_TYPE[] = [
    VEHICLE_TYPE.MOTORCYCLE,
    VEHICLE_TYPE.CAR,
    VEHICLE_TYPE.LGV
  ];
  TECH_RECORD_STATUS: typeof TECH_RECORD_STATUS = TECH_RECORD_STATUS;
  APP_STRINGS: typeof APP_STRINGS = APP_STRINGS;
  vehicleData: VehicleModel;
  testData: TestModel;
  dateFormat: string = DATE_FORMAT.DD_MM_YYYY;
  changeOpacity: boolean = false;
  previousPageName: string;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public storageService: StorageService,
    public commonFunc: CommonFunctionsService,
    private callNumber: CallNumber,
    // private firebaseLogsService: FirebaseLogsService,
    public appService: AppService
  ) {
    this.vehicleData = navParams.get('vehicle');
    this.testData = navParams.get('test');
    this.previousPageName = this.navCtrl.last().name;
  }

  ionViewWillEnter() {
    this.viewCtrl.setBackButtonText(this.getBackButtonText());
  }

  ionViewDidEnter() {
    // this.firebaseLogsService.setScreenName(FIREBASE_SCREEN_NAMES.VEHICLE_DETAILS);
    // this.firebaseLogsService.search_vehicle_time.search_vehicle_end_time = Date.now();
    // this.firebaseLogsService.search_vehicle_time.search_vehicle_time_taken = this.firebaseLogsService.differenceInSeconds(
    //   this.firebaseLogsService.search_vehicle_time.search_vehicle_start_time,
    //   this.firebaseLogsService.search_vehicle_time.search_vehicle_end_time
    // );
    // this.firebaseLogsService.logEvent(
    //   FIREBASE.SEARCH_VEHICLE_TIME_TAKEN,
    //   FIREBASE.SEARCH_VEHICLE_START_TIME,
    //   this.firebaseLogsService.search_vehicle_time.search_vehicle_start_time.toString(),
    //   FIREBASE.SEARCH_VEHICLE_END_TIME,
    //   this.firebaseLogsService.search_vehicle_time.search_vehicle_end_time.toString(),
    //   FIREBASE.SEARCH_VEHICLE_TIME_TAKEN,
    //   this.firebaseLogsService.search_vehicle_time.search_vehicle_time_taken
    // );
    // this.firebaseLogsService.confirm_vehicle_time.confirm_vehicle_start_time = Date.now();
  }

  goToPreparerPage(): void {
    this.changeOpacity = true;
    let confirm = this.alertCtrl.create({
      title: APP_STRINGS.CONFIRM_VEHICLE,
      message: APP_STRINGS.CONFIRM_VEHICLE_MSG,
      buttons: [
        {
          text: APP_STRINGS.CANCEL
        },
        {
          text: APP_STRINGS.CONFIRM,
          handler: () => {
            this.loggingInAlertHandler();

            this.navCtrl
              .push(PAGE_NAMES.ADD_PREPARER_PAGE, {
                vehicle: this.vehicleData,
                test: this.testData
              })
              .then((resp) => {
                if (!resp) {
                  const alert = this.alertCtrl.create({
                    title: APP_STRINGS.UNAUTHORISED,
                    message: APP_STRINGS.UNAUTHORISED_TEST_MSG,
                    buttons: [
                      {
                        text: APP_STRINGS.CANCEL,
                        role: 'cancel'
                      },
                      {
                        text: APP_STRINGS.CALL,
                        handler: () => {
                          this.callNumber.callNumber(AppConfig.app.KEY_PHONE_NUMBER, true).then(
                            (data) => console.log(data),
                            (err) => console.log(err)
                          );
                          return false;
                        }
                      }
                    ]
                  });
                  alert.present();
                }
              });
          }
        }
      ]
    });
    confirm.present();
    confirm.onDidDismiss(() => (this.changeOpacity = false));
  }

  showMoreDetails(pageName: string): void {
    this.navCtrl.push(pageName, {
      vehicleData: this.vehicleData
    });
  }

  goToVehicleTestResultsHistory() {
    this.storageService
      .read(STORAGE.TEST_HISTORY + this.vehicleData.systemNumber)
      .then((data) => {
        this.navCtrl.push(PAGE_NAMES.VEHICLE_HISTORY_PAGE, {
          vehicleData: this.vehicleData,
          testResultsHistory: data ? data : []
        });
      });
  }

  loggingInAlertHandler() {
    // this.firebaseLogsService.confirm_vehicle_time.confirm_vehicle_end_time = Date.now();
    // this.firebaseLogsService.confirm_vehicle_time.confirm_vehicle_time_taken = this.firebaseLogsService.differenceInSeconds(
    //   this.firebaseLogsService.confirm_vehicle_time.confirm_vehicle_start_time,
    //   this.firebaseLogsService.confirm_vehicle_time.confirm_vehicle_end_time
    // );
    // this.firebaseLogsService.logEvent(
    //   FIREBASE.CONFIRM_VEHICLE_TIME_TAKEN,
    //   FIREBASE.CONFIRM_VEHICLE_START_TIME,
    //   this.firebaseLogsService.confirm_vehicle_time.confirm_vehicle_start_time.toString(),
    //   FIREBASE.CONFIRM_VEHICLE_END_TIME,
    //   this.firebaseLogsService.confirm_vehicle_time.confirm_vehicle_end_time.toString(),
    //   FIREBASE.CONFIRM_VEHICLE_TIME_TAKEN,
    //   this.firebaseLogsService.confirm_vehicle_time.confirm_vehicle_time_taken
    // );
    // this.firebaseLogsService.confirm_preparer_time.confirm_preparer_start_time = Date.now();
  }

  private getBackButtonText(): string {
    switch (this.previousPageName) {
      case PAGE_NAMES.TEST_CREATE_PAGE:
        return APP_STRINGS.TEST;
      case PAGE_NAMES.MULTIPLE_TECH_RECORDS_SELECTION:
        return APP_STRINGS.SELECT_VEHICLE;
      case PAGE_NAMES.VEHICLE_LOOKUP_PAGE:
        return APP_STRINGS.IDENTIFY_VEHICLE;
      default:
        return 'Back';
    }
  }
}
