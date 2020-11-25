import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SignaturePadPage } from './signature-pad';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [SignaturePadPage],
  imports: [SignaturePadModule, IonicPageModule.forChild(SignaturePadPage)]
})
export class SignaturePadPageModule {}
