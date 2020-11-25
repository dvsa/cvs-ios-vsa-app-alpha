import { Injectable } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { AlertController } from 'ionic-angular';

import { default as AppConfig } from '../../../config/application.hybrid';
import { APP_STRINGS, AUTH } from '../../app/app.enums';

@Injectable()
export class AppAlertService {
  constructor(private alertCtrl: AlertController, private callNumber: CallNumber) {}

  alertUnAuthorise() {
    const alert = this.alertCtrl.create({
      title: APP_STRINGS.UNAUTHORISED,
      message: APP_STRINGS.UNAUTHORISED_MSG,
      buttons: [
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
      ],
      enableBackdropDismiss: false
    });

    alert.present();
  }

  alertInternetRequired() {
    const alert = this.alertCtrl.create({
      title: AUTH.INTERNET_REQUIRED,
      message: APP_STRINGS.NO_INTERNET_CONNECTION,
      buttons: [APP_STRINGS.OK]
    });

    alert.present();
  }

  alertLoginFailed() {
    const alert = this.alertCtrl.create({
      title: AUTH.FAILED,
      message: APP_STRINGS.PLUGIN_FAILURE,
      buttons: [APP_STRINGS.OK]
    });

    alert.present();
  }
}
