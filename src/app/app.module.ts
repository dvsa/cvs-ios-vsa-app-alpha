import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Camera } from '@ionic-native/camera';
import { CallNumber } from '@ionic-native/call-number';
import { MyApp } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { StorageService } from '../providers/natives/storage.service';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { WheelSelector } from '@ionic-native/wheel-selector';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { PreparerService } from '../providers/preparer/preparer.service';
import { VisitService } from '../providers/visit/visit.service';
import { CommonFunctionsService } from '../providers/utils/common-functions';
import { Keyboard } from '@ionic-native/keyboard';
import { SignaturePadModule } from 'angular2-signaturepad';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SignaturePopoverComponent } from '../components/signature-popover/signature-popover';
import { SignatureService } from '../providers/signature/signature.service';
import { ActivityService } from '../providers/activity/activity.service';
// import { Firebase } from '@ionic-native/firebase';
import { LogsModule } from '../modules/logs/logs.module';
import { DataStoreProvider } from '../modules/logs/data-store.service';
import { Network } from '@ionic-native/network';
import { NetworkStateProvider } from '../modules/logs/network-state.service';
import { LogsProvider } from '../modules/logs/logs.service';
import { SecureStorage } from '@ionic-native/secure-storage';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// import { FirebaseLogsService } from '../providers/firebase-logs/firebase-logs.service';
import { AppVersion } from '@ionic-native/app-version';
import { SentryIonicErrorHandler } from './sentry-ionic-errorhandler';
import {
  AppAlertService,
  AppService,
  StateReformingService,
  SyncService,
  HTTPService
} from '../providers/global';

import {
  AuthenticationService,
  VaultService,
  BrowserAuthPlugin,
  BrowserAuthService,
  AuthInterceptorService,
  UnauthInterceptor,
  RetryInterceptor
} from '../providers/auth';

const IONIC_PROVIDERS = [StatusBar, SplashScreen];

const CUSTOM_PROVIDERS = [
  AppService,
  AppAlertService,
  SyncService,
  HTTPService,
  StorageService,
  AuthenticationService,
  VaultService,
  BrowserAuthPlugin,
  BrowserAuthService,
  PreparerService,
  VisitService,
  ActivityService,
  StateReformingService,
  CommonFunctionsService,
  SignatureService
  // FirebaseLogsService
];

const IONIC_NATIVE_PROVIDERS = [
  SocialSharing,
  InAppBrowser,
  Camera,
  CallNumber,
  OpenNativeSettings,
  WheelSelector,
  MobileAccessibility,
  AppVersion,
  Keyboard,
  ScreenOrientation,
  // Firebase,
  DataStoreProvider,
  Network,
  NetworkStateProvider,
  LogsProvider,
  SecureStorage
];

const INTERCEPTOR_PROVIDERS = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: UnauthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: RetryInterceptor, multi: true }
];

@NgModule({
  declarations: [MyApp, SignaturePopoverComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, { statusbarPadding: true, swipeBackEnabled: false }),
    IonicStorageModule.forRoot({
      driverOrder: ['sqlite', 'websql', 'indexeddb']
    }),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    SignaturePadModule,
    LogsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, SignaturePopoverComponent],
  providers: [
    ...INTERCEPTOR_PROVIDERS,
    ...IONIC_PROVIDERS,
    ...CUSTOM_PROVIDERS,
    ...IONIC_NATIVE_PROVIDERS,
    // { provide: ErrorHandler, useClass: IonicErrorHandler }
    { provide: ErrorHandler, useClass: SentryIonicErrorHandler }
  ]
})
export class AppModule {}
