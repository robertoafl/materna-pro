import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ELocalNotificationTriggerUnit, LocalNotifications } from '@ionic-native/local-notifications/ngx';
// import { ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
// import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
import { DatabaseService } from '../core/service/database.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  scheduled = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private platform: Platform,
    private localNotifications: LocalNotifications,
    private alertController: AlertController,
    private db: DatabaseService
  ) {
    this.platform.ready().then(() => {
      this.localNotifications.on('click').subscribe(res => {
        console.log('click: ', res);
        let msg = res.data ? res.data.mydata : '';
        this.showAlert(res.tittle, res.text, msg);
      });

      this.localNotifications.on('trigger').subscribe(res => {
        console.log('trigger: ', res);
        let msg = res.data ? res.data.mydata : '';
        this.showAlert(res.tittle, res.text, msg);
      });
    });
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  destroyDatabase(){
    this.db.destroyDatabase();
  }
  // create a one mit notification
  createOneMinNotification() {
    console.log('3 secs');
    this.localNotifications.schedule({
      id: 111,
      text: 'Delayed ILocalNotification',
      trigger: {at: new Date(new Date().getTime() + 3000)},
      led: 'FF0000',
      sound: null
   });
  }

  async cancelOneMinNotification() {
    // this.localNotifications.cancel(111);
    const notifications = await this.localNotifications.getIds();
    console.log('notifications: ', notifications);
  };

  scheduleNotification() {
    // this.localNotifications.schedule({
    //   id: 1,
    //   title: 'Attention',
    //   text: 'Simons Notification',
    //   data: { mydata: 'My hidden message this is' },
    //   trigger: { in: 5, unit: ELocalNotificationTriggerUnit.SECOND },
    //   // foreground: true
    // });

    this.localNotifications.schedule({
     id: 1,
     title: 'Attention',
     text: 'Simons Notification',
     data: { page: 'My hidden message this is'},
     trigger: { at: new Date(new Date().getTime() + 5 * 1000)}
    });
  }

  recurringNotification() {
    this.localNotifications.schedule({
      id: 22,
      title: 'Recurring',
      text: 'Simons Recurring Notification',
      trigger: { every: ELocalNotificationTriggerUnit.MINUTE }
    });
   }

  repeatingDaily() {
    this.localNotifications.schedule({
      id: 42,
      title: 'Good Morning',
      text: 'Code vsomething epic today',
      trigger: { every: {hour: 11, minute:50} }
    });
   }

  getAll() {
    this.localNotifications.getAll().then(res => {
      this.scheduled = res;
    })
   }

   clearAll() {
    this.localNotifications.cancelAll().then(res => {
      this.scheduled = res;
    })
   }

  showAlert(header, sub, msg) {
    this.alertController.create({
      header: header,
      subHeader: sub,
      message: msg,
      buttons: ["Ok"]
    }).then(alert => alert.present());
  }
}
