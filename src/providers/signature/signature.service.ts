import { Injectable } from '@angular/core';
import { HTTPService } from '../global/http.service';
import { Observable } from 'rxjs';
import { Events, ToastController } from 'ionic-angular';
import { StorageService } from '../natives/storage.service';
import { APP_STRINGS, SIGNATURE_STATUS, STORAGE } from '../../app/app.enums';
import { AuthenticationService } from '../auth/authentication/authentication.service';

@Injectable()
export class SignatureService {
  signatureString: string;
  toast = this.toastCtrl.create({
    message: APP_STRINGS.SIGN_TOAST_MSG,
    duration: 4000,
    position: 'top',
    cssClass: 'sign-toast-css'
  });

  constructor(
    private httpService: HTTPService,
    private events: Events,
    private toastCtrl: ToastController,
    private storageService: StorageService,
    private authenticationService: AuthenticationService
  ) {}

  saveSignature(): Observable<any> {
    return this.httpService.saveSignature(
      this.authenticationService.tokenInfo.testerId,
      this.signatureString.slice(22, this.signatureString.length)
    );
  }

  saveToStorage(): Promise<any> {
    return this.storageService.create(STORAGE.SIGNATURE, this.signatureString);
  }

  presentSuccessToast(): void {
    this.events.unsubscribe(SIGNATURE_STATUS.SAVED);
    this.events.unsubscribe(SIGNATURE_STATUS.ERROR);
    this.toast.present();
  }
}
