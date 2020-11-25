import { Injectable } from '@angular/core';
import { HTTPService } from './http.service';
import { catchError, map } from 'rxjs/operators';
import { AlertController, Events, LoadingController } from 'ionic-angular';
import { _throw } from 'rxjs/observable/throw';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { CallNumber } from '@ionic-native/call-number';
import { Observable } from 'rxjs';
// import { Firebase } from '@ionic-native/firebase';
import { AppVersion } from '@ionic-native/app-version';

import { TestStationReferenceDataModel } from '../../models/reference-data-models/test-station.model';
import { APP_STRINGS, APP_UPDATE, STORAGE } from '../../app/app.enums';
import { StorageService } from '../natives/storage.service';
import { default as AppConfig } from '../../../config/application.hybrid';
import { AppService } from './app.service';
import { AuthenticationService } from '../auth/authentication/authentication.service';
import { AppVersionModel } from '../../models/latest-version.model';
import { LogsProvider } from '../../modules/logs/logs.service';
import { VERSION_POPUP_MSG } from '../../app/app.constants';

declare let cordova: any;

@Injectable()
export class SyncService {
  initSyncDone: boolean;
  loading = this.loadingCtrl.create({
    content: 'Loading...'
  });
  loadOrder: Observable<any>[] = [];
  oid: string;

  constructor(
    public events: Events,
    public loadingCtrl: LoadingController,
    public appService: AppService,
    private httpService: HTTPService,
    private storageService: StorageService,
    private alertCtrl: AlertController,
    private openNativeSettings: OpenNativeSettings,
    private callNumber: CallNumber,
    // private firebase: Firebase,
    private authenticationService: AuthenticationService,
    private appVersion: AppVersion,
    private logProvider: LogsProvider
  ) {}

  public async startSync(): Promise<any[]> {
    if (this.appService.isCordova) {
      this.checkForUpdate();
    }

    if (!this.appService.getRefDataSync()) {
      this.loading.present();

      ['Atfs', 'Defects', 'TestTypes', 'Preparers'].forEach((elem) =>
        this.loadOrder.push(this.getDataFromMicroservice(elem))
      );

      return await this.getAllData(this.loadOrder);
    }

    return Promise.resolve([null, true]);
  }

  public async checkForUpdate() {
    let promises = [];
    promises.push(this.appVersion.getVersionNumber());
    promises.push(this.httpService.getApplicationVersion());
    promises.push(this.storageService.read(STORAGE.VISIT));

    try {
      let results = await Promise.all(promises);
      const currentAppVersion: string = results[0];
      const latestAppVersionModel: AppVersionModel = results[1].body['mobile-app'];
      const { version_checking, version: latestVersion } = latestAppVersionModel;
      const visit = results[2];

      if (version_checking === 'true' && currentAppVersion !== latestVersion && !visit) {
        return this.createUpdatePopup({ currentAppVersion, latestVersion }).present();
      }
    } catch (error) {
      console.log('Cannot perform check if app update is required');

      this.logProvider.dispatchLog({
        type: `error - checkForUpdate in sync.service.ts`,
        message: `User ${
          this.authenticationService.tokenInfo.testerId
        } - Cannot perform check if app update is required - ${JSON.stringify(error)}`,
        timestamp: Date.now()
      });
    }
  }

  private createUpdatePopup(params: any) {
    const { currentAppVersion, latestVersion } = params;

    return this.alertCtrl.create({
      title: APP_UPDATE.TITLE,
      message: VERSION_POPUP_MSG(currentAppVersion, latestVersion),
      buttons: [
        {
          text: APP_UPDATE.BUTTON,
          handler: () => {
            cordova.plugins.exit();
          }
        }
      ],
      enableBackdropDismiss: false
    });
  }

  private async getAllData(loadOrder: Observable<any>[]): Promise<any[]> {
    return Observable.forkJoin(loadOrder)
      .toPromise()
      .then((result: any[]) => {
        this.appService.setRefDataSync(true);
        this.loading.dismissAll();
        return [null, result.length === 4]; // ensure we have the exact and successful 4 apis call
      })
      .catch(() => [this.handleError()]);
  }

  getDataFromMicroservice(microservice): Observable<TestStationReferenceDataModel[]> {
    this.oid = this.authenticationService.tokenInfo.testerId;

    return this.httpService['get' + microservice]().pipe(
      map((data: any) => {
        this.storageService.update(STORAGE[microservice.toUpperCase()], data.body);
        return data.body;
      }),
      catchError((error) => {
        this.logProvider.dispatchLog({
          type: `error-${microservice}-getDataFromMicroservice in sync.service.ts`,
          message: `${this.oid} - ${error.status} ${error.message} for API call to ${error.url ||
            microservice + 'microservice'}`,
          timestamp: Date.now()
        });

        // this.firebase.logEvent('test_error', {
        //   content_type: 'error',
        //   item_id: `Error at ${microservice} microservice`
        // });

        return _throw(error);
      })
    );
  }

  handleError(): Observable<any> {
    let alert = this.alertCtrl.create({
      title: 'Unable to load data',
      enableBackdropDismiss: false,
      message: 'Make sure you are connected to the internet and try again',
      buttons: [
        {
          text: APP_STRINGS.SETTINGS_BTN,
          handler: () => {
            this.openNativeSettings.open('settings');
            this.handleError();
          }
        },
        {
          text: 'Call Technical Support',
          handler: () => {
            this.callNumber.callNumber(AppConfig.app.KEY_PHONE_NUMBER, true).then(
              (data) => console.log(data),
              (err) => console.log(err)
            );
            return false;
          }
        },
        {
          text: 'Try again',
          handler: () => {
            this.getAllData(this.loadOrder);
          }
        }
      ]
    });

    alert.present();
    return _throw('Something bad happened; please try again later.');
  }
}
