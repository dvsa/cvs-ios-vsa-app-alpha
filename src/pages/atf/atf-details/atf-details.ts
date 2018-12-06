import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {AtfReferenceDataModel} from '../../../models/reference-data-models/atf.model';

@IonicPage()
@Component({
  selector: 'page-atf-details',
  templateUrl: 'atf-details.html'
})
export class ATFDetailsPage implements OnInit {
  atf: AtfReferenceDataModel;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams) {
    this.atf = navParams.get('atf');
  }

  ngOnInit() {
    let pointer = {lat: this.atf.atfLatitude, lng: this.atf.atfLongitude};
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: pointer
      }
    );
    let marker = new google.maps.Marker({
      position: pointer,
      map: map
    });
  }

  startVisit(): void {
    let confirm = this.alertCtrl.create({
      title: 'Complete a site check',
      message: 'Have you checked that the ATF is suitable for you to begin testing?',
      buttons: [
        {
          text: 'No',
        }, {
          text: 'Yes',
          handler: () => {
            this.navCtrl.push('VisitTimelinePage', {atf: this.atf});
          }
        }
      ]
    });
    confirm.present();
  }
}
