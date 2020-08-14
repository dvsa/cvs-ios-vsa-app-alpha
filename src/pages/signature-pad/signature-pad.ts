import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  Events,
  IonicPage,
  NavController,
  PopoverController
} from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { APP_STRINGS, LOCAL_STORAGE, SIGNATURE_STATUS } from '../../app/app.enums';
import { SignaturePopoverComponent } from '../../components/signature-popover/signature-popover';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { SignatureService } from '../../providers/signature/signature.service';
import { AppService } from '../../providers/global/app.service';
import { CallNumber } from '@ionic-native/call-number';
// import { AppConfig } from '../../../config/app.config';
import { Firebase } from '@ionic-native/firebase';
import { Log, LogsModel } from '../../modules/logs/logs.model';
import * as logsActions from '../../modules/logs/logs.actions';
import { AuthService } from '../../providers/global/auth.service';
import { Store } from '@ngrx/store';

import {default as hybridConfig} from '../../../config/application.hybrid';

@IonicPage()
@Component({
  selector: 'page-signature-pad',
  templateUrl: 'signature-pad.html'
})
export class SignaturePadPage implements OnInit {
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;
  underSignText: string;
  dividerText: string;
  navRef: NavController;
  oid: string;

  public signaturePadOptions: Object = {
    minWidth: 2,
    canvasWidth: 701,
    canvasHeight: 239
  };

  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public events: Events,
    public alertCtrl: AlertController,
    public appService: AppService,
    private screenOrientation: ScreenOrientation,
    private openNativeSettings: OpenNativeSettings,
    private signatureService: SignatureService,
    private firebase: Firebase,
    private authService: AuthService,
    private store$: Store<LogsModel>,
    private callNumber: CallNumber
  ) {
    this.events.subscribe(SIGNATURE_STATUS.ERROR, () => {
      this.showConfirm();
    });
  }

  ngOnInit(): void {
    this.dividerText = APP_STRINGS.SIGNATURE_DIVIDER;
    this.underSignText = APP_STRINGS.SIGNATURE_TEXT;
  }

  ionViewWillEnter() {
    if (this.appService.isCordova)
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY);
  }

  ionViewWillLeave() {
    if (this.appService.isCordova)
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
  }

  ngAfterViewInit() {
    this.signaturePad.clear();
  }

  drawComplete() {
    this.signatureService.signatureString = this.signaturePad.toDataURL('image/png');
  }

  clearSignature() {
    this.signaturePad.clear();
  }

  showConfirm() {
    const CONFIRM_ALERT = this.alertCtrl.create({
      title: APP_STRINGS.SIGN_UNABLE_LOAD_DATA,
      message: '',
      buttons: [
        {
          text: APP_STRINGS.SETTINGS_BTN,
          handler: () => {
            if (this.appService.isCordova) this.openNativeSettings.open('settings');
          }
        },
        {
          text: APP_STRINGS.CALL_SUPP_BTN,
          handler: () => {
            this.callNumber.callNumber(hybridConfig.options.KEY_PHONE_NUMBER, true);
          }
        },
        {
          text: APP_STRINGS.TRY_AGAIN_BTN,
          handler: () => {
            this.oid = this.authService.getOid();
            this.signatureService.saveSignature().subscribe(
              (response) => {
                const log: Log = {
                  type: 'info',
                  message: `${this.oid} - ${response.status} ${response.body.message} for API call to ${response.url}`,
                  timestamp: Date.now()
                };
                this.store$.dispatch(new logsActions.SaveLog(log));
                this.signatureService.presentSuccessToast();
                localStorage.setItem(LOCAL_STORAGE.SIGNATURE, 'true');
                this.appService.isSignatureRegistered = true;
                this.events.unsubscribe(SIGNATURE_STATUS.ERROR);
                this.events.publish(SIGNATURE_STATUS.SAVED_EVENT);
              },
              (error) => {
                const log: Log = {
                  type: 'error',
                  message: `${this.oid} - ${error.status} ${error.message} for API call to ${error.url}`,
                  timestamp: Date.now()
                };
                this.store$.dispatch(new logsActions.SaveLog(log));
                this.firebase.logEvent('test_error', {
                  content_type: 'error',
                  item_id: 'Saving signature failed'
                });
                this.showConfirm();
              }
            );
          }
        }
      ]
    });
    CONFIRM_ALERT.present();
  }

  /**
   * A popover that should look like an alert
   * Alerts do not allow images
   */
  presentPopover() {
    if (!this.signaturePad.isEmpty()) {
      const POPOVER = this.popoverCtrl.create(SignaturePopoverComponent);
      POPOVER.present();
    } else {
      const EMPTY_SIGNATURE = this.alertCtrl.create({
        title: APP_STRINGS.SIGN_NOT_ENTERED,
        message: APP_STRINGS.SIGN_ENTER,
        buttons: [APP_STRINGS.OK]
      });
      EMPTY_SIGNATURE.present();
    }
  }
}
