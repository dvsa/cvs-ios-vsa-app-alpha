import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  IonicPage,
  NavController,
  NavParams,
  TextInput,
  ViewController
} from 'ionic-angular';
import { VehicleModel } from '../../../../models/vehicle/vehicle.model';
import { FIREBASE, ODOMETER_METRIC, REG_EX_PATTERNS } from '../../../../app/app.enums';
import { VisitService } from '../../../../providers/visit/visit.service';
import { VehicleService } from '../../../../providers/vehicle/vehicle.service';
import { FirebaseLogsService } from '../../../../providers/firebase-logs/firebase-logs.service';

@IonicPage()
@Component({
  selector: 'page-odometer-reading',
  templateUrl: 'odometer-reading.html'
})
export class OdometerReadingPage implements OnInit {
  odometerReading: string;
  odometerMetric: string;
  vehicle: VehicleModel;
  errorIncomplete: boolean;
  patterns;

  @ViewChild('valueInput') valueInput: TextInput;

  constructor(
    public visitService: VisitService,
    private actionSheetCtrl: ActionSheetController,
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private vehicleService: VehicleService,
    private cdRef: ChangeDetectorRef,
    private firebaseLogsService: FirebaseLogsService
  ) {
    this.vehicle = this.navParams.get('vehicle');
    this.errorIncomplete = this.navParams.get('errorIncomplete');
  }

  ngOnInit() {
    this.odometerReading =
      this.vehicle.odometerReading && this.vehicle.odometerReading.length
        ? this.vehicle.odometerReading
        : null;
    this.odometerMetric =
      this.vehicle.odometerMetric && this.vehicle.odometerMetric.length
        ? this.vehicle.odometerMetric
        : ODOMETER_METRIC.KILOMETRES;
    this.patterns = REG_EX_PATTERNS;
    if (this.vehicle.odometerReading) this.errorIncomplete = false;
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.valueInput.setFocus();
    }, 150);
  }

  valueInputChange(value) {
    this.cdRef.detectChanges();
    this.odometerReading = value.length > 7 ? value.substring(0, 7) : value;
  }

  displayOdometerMetricCapitalized() {
    return this.odometerMetric.charAt(0).toUpperCase() + this.odometerMetric.slice(1);
  }

  onSave() {
    this.firebaseLogsService.add_odometer_reading_time.add_odometer_reading_end_time = Date.now();

    this.firebaseLogsService.add_odometer_reading_time.add_odometer_reading_time_taken = this.firebaseLogsService.differenceInSeconds(
      this.firebaseLogsService.add_odometer_reading_time.add_odometer_reading_start_time,
      this.firebaseLogsService.add_odometer_reading_time.add_odometer_reading_end_time
    );
    this.firebaseLogsService.logEvent(
      FIREBASE.ADD_ODOMETER_READING_TIME_TAKEN,
      FIREBASE.ADD_ODOMETER_READING_START_TIME,
      this.firebaseLogsService.add_odometer_reading_time.add_odometer_reading_start_time.toString(),
      FIREBASE.ADD_ODOMETER_READING_END_TIME,
      this.firebaseLogsService.add_odometer_reading_time.add_odometer_reading_end_time.toString(),
      FIREBASE.ADD_ODOMETER_READING_TIME_TAKEN,
      this.firebaseLogsService.add_odometer_reading_time.add_odometer_reading_time_taken
    );

    this.vehicle = this.vehicleService.setOdometer(
      this.vehicle,
      this.odometerReading,
      this.odometerMetric
    );
    this.viewCtrl.dismiss();
  }

  onEdit() {
    const actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: 'Kilometres',
          handler: () => {
            this.odometerMetric = ODOMETER_METRIC.KILOMETRES;
          }
        },
        {
          text: 'Miles',
          handler: () => {
            this.odometerMetric = ODOMETER_METRIC.MILES;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
}
