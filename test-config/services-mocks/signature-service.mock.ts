import { Observable } from 'rxjs';
import { NavController } from 'ionic-angular';
import { of } from 'rxjs/observable/of';

export class SignatureServiceMock {
  signatureString: string;
  isError: boolean;

  constructor() {}

  saveSignature(): Observable<any> {
    if (this.isError) {
      return Observable.throw({});
    }
    return of({});
  }

  goToRootPage(navCtrl: NavController): void {
    return;
  }

  saveToStorage(): Promise<any> {
    if (this.isError) return Promise.reject();
    return Promise.resolve();
  }

  presentSuccessToast() {
    return;
  }
}
