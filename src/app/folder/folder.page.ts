import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ELocalNotificationTriggerUnit, LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
import { Contact } from '../contacts/shared/contact';
import { ContactService } from '../contacts/shared/contact.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  contact: Contact;
  cpf = "11111111111";

  isValid:boolean = false;
  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";
  password: string;
  pureResult: any;
  message: string;
  maskedId: any;
  cpf_cnpj = '';
  val: any;
  v: any;

  scheduled = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private platform: Platform,
    private localNotifications: LocalNotifications,
    private alertController: AlertController
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
    this.contact = new Contact();
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  format(valString) {
    if (!valString) {
        return '';
    }
    let val = valString.toString();
    const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
    this.pureResult = parts;
    if(parts[0].length <= 11){
      this.maskedId = this.cpf_mask(parts[0]);
      return this.maskedId;
    }else{
      this.maskedId = this.cnpj(parts[0]);
      return this.maskedId;
    }
  };

unFormat(val) {
    if (!val) {
      return '';
    }
    val = val.replace(/\D/g, '');

    if (this.GROUP_SEPARATOR === ',') {
        return val.replace(/,/g, '');
    } else {
        return val.replace(/\./g, '');
    }
  };

  cpf_mask(v) {
    v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
    v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
    //de novo (para o segundo bloco de números)
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); //Coloca um hífen entre o terceiro e o quarto dígitos
    return v;
}

 cnpj(v) {
    v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
    v = v.replace(/^(\d{2})(\d)/, '$1.$2'); //Coloca ponto entre o segundo e o terceiro dígitos
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3'); //Coloca ponto entre o quinto e o sexto dígitos
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2'); //Coloca uma barra entre o oitavo e o nono dígitos
    v = v.replace(/(\d{4})(\d)/, '$1-$2'); //Coloca um hífen depois do bloco de quatro dígitos
    return v;
}

validateCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf == '') return false;
  // Elimina CPFs invalidos conhecidos    
  if (cpf.length != 11 ||
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999")
      return false;
  // Valida 1o digito 
  var add = 0;
  for (var i = 0; i < 9; i++)
      add += parseInt(cpf.charAt(i)) * (10 - i);
  var rev = 11 - (add % 11);
  if (rev == 10 || rev == 11)
      rev = 0;
  if (rev != parseInt(cpf.charAt(9)))
      return false;
  // Valida 2o digito 
  add = 0;
  for (var i = 0; i < 10; i++)
      add += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11)
      rev = 0;
  if (rev != parseInt(cpf.charAt(10)))
      return false;
  return true;
}

  login() {
    //this.cpf = "123";
    console.log("cpf: ", this.cpf);
    //this.contact.cpf = "456";
    console.log("contact.cpf: ", this.contact.cpf);
    localStorage.setItem("cpf",this.cpf);
    localStorage.setItem("contact",this.contact.cpf);

    console.log('cpf_cnpj: ', this.cpf_cnpj);
    this.isValid = this.validateCPF(this.cpf_cnpj);
    console.log('pureResult: ', this.pureResult);
    console.log('isValid: ', this.isValid);
    if(this.isValid==true){
      this.message = 'Válido!';
      console.log('message: ', this.message);
    }else{
      this.message = 'Inválido!';
      console.log('message: ', this.message);
    }

  }

  scheduleNotification() {
    this.localNotifications.schedule({
      id: 1,
      title: 'Attention',
      text: 'Simons Notification',
      data: { mydata: 'My hidden message this is' },
      trigger: { in: 5, unit: ELocalNotificationTriggerUnit.SECOND },
      // foreground: true
    });

    //this.localNotifications.schedule({
    //  id: 1,
    //  title: 'Attention',
    //  text: 'Simons Notification',
    //  data: { page: 'My hidden message this is'},
    //  trigger: { at: new Date(new Date().getTime() + 5 * 1000)}
    //});
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
