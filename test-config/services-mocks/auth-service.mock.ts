import { TesterDetailsModel } from '../../src/models/tester-details.model';
// import { AuthenticationResult } from "@ionic-native/ms-adal";
import { Observable } from 'rxjs';
import { LOCAL_STORAGE } from '../../src/app/app.enums';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { CommonFunctionsService } from '../../src/providers/utils/common-functions';

export class AuthServiceMock {
  testerDetails: TesterDetailsModel;
  jwtToken: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvaWQiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwidXBuIjoidGVzdEBlbWFpbC5jb20iLCJyb2xlcyI6WyJDVlNGdWxsQWNjZXNzIl0sInRpZCI6IjEyMzQ1Njc4OTAifQ.WiuTyp6cSXYb7L94JbjDy3F9Tt_qvrj9MWZq4xvEi6E';
  decodedToken = {
    oid: '1234567890',
    name: 'John Doe',
    upn: 'test@email.com',
    roles: ['CVSFullAccess'],
    tid: '1234567890'
  };
  userRoles: string[] = [];
  tenantId: string;
  authContext: any;

  constructor() {
    this.testerDetails = {} as TesterDetailsModel;
  }

  createAuthContext(): Promise<any> {
    return Promise.resolve();
  }

  resetTokenCache(): Promise<any> {
    return Promise.resolve();
  }

  login(isError: boolean): Observable<string | ErrorObservable> {
    return Observable.from(this.loginSilently(isError));
  }

  private loginSilently(isError): Promise<string> {
    if (isError) return this.loginWithUI();
    return Promise.resolve('success');
  }

  private loginWithUI(): Promise<string> {
    return Promise.resolve(this.jwtToken);
  }

  setJWTToken(token): Promise<any> {
    this.jwtToken = token;
    localStorage.setItem(LOCAL_STORAGE.JWT_TOKEN, this.jwtToken);
    return Promise.resolve();
  }

  getJWTToken() {
    return this.jwtToken;
  }

  getOid() {
    return this.decodedToken.oid;
  }

  isValidToken(token, isError: boolean): boolean {
    return !isError;
  }

  setTesterDetails(authResponse: any): TesterDetailsModel {
    let commonFunc = new CommonFunctionsService();

    let details: TesterDetailsModel = {
      testerName: commonFunc.randomString(9),
      testerId: commonFunc.randomString(9),
      testerEmail: '',
      testerRoles: ['CVSFullAccess']
    };
    details.testerEmail = `${details.testerName}.${details.testerId}@email.com`;

    if (authResponse) {
      let decodedToken = this.decodeJWT(authResponse.accessToken);
      details.testerId = decodedToken['oid'];
      details.testerName = decodedToken['name'];
      details.testerEmail = decodedToken['upn'];
      this.tenantId = decodedToken['tid'];
    }
    this.userRoles = details.testerRoles;
    localStorage.setItem('tester-details', JSON.stringify(details));
    return details;
  }

  private decodeJWT(token) {
    return this.decodedToken;
  }

  hasRights(userRoles: string[], neededRoles: string[]): boolean {
    return userRoles.some((role) => neededRoles.indexOf(role) >= 0);
  }
}
