import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Contact } from 'src/app/contacts/shared/contact';
import { ContactService } from 'src/app/contacts/shared/contact.service';
import { Consulta } from '../shared/consulta';
import { ConsultaService } from '../shared/consulta.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-consulta-form',
  templateUrl: './consulta-form.page.html',
  styleUrls: ['./consulta-form.page.scss'],
})
export class ConsultaFormPage implements OnInit {

  title: string = 'Nova consulta';
  consulta: Consulta;
  contact: Contact;
  minDate: any = new Date(new Date().setFullYear(new Date().getFullYear())).toISOString();
  maxDate: any = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();
  ocultaPrimeiroTrimestre: boolean = false;
  ocultaSegundoTrimestre: boolean = true;
  ocultaTerceiroTrimestre: boolean = true;

  constructor(
    private consultaService: ConsultaService,
    private contactService: ContactService,
    private route: ActivatedRoute, //Pegar a rota ativa do angula
    private toastCtrl: ToastController,
    private localNotifications: LocalNotifications,
    private alertController: AlertController,
    ) { 
      this.localNotifications.on('trigger').subscribe(res => {
        console.log('trigger: ', res);
        let msg = res.data ? res.data.mydata : '';
        this.showAlert(res.tittle, res.text, msg);
      });
    }

  async ngOnInit() {
    this.consulta = new Consulta();
    this.contact = new Contact();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.title = 'Editar consulta';
      console.log(idParam);
      this.loadConsulta(parseInt(idParam));
      await this.loadContact(parseInt(idParam));
    }

    if (new Date().getTime() <= new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + 7884000000).getTime()) {
      this.ocultaPrimeiroTrimestre = false;
      this.ocultaSegundoTrimestre = true;
      this.ocultaTerceiroTrimestre = true;
    } else if (new Date().getTime() <= new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + 15768000000).getTime()) {
      this.ocultaPrimeiroTrimestre = true;
      this.ocultaSegundoTrimestre = false;
      this.ocultaTerceiroTrimestre = true;
    } else if (new Date().getTime() <= new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + 23652000000).getTime()) {
      this.ocultaPrimeiroTrimestre = true;
      this.ocultaSegundoTrimestre = true;
      this.ocultaTerceiroTrimestre = false;
    }
  }

  async loadConsulta(id: number) {
    this.consulta = await this.consultaService.getById(id);
  }

  async loadContact(id: number) {
    this.contact = await this.contactService.getById(id);
  }

  async atribuiNotificacao(value: string) {
    const data = new Date(value);

    if (value) {
      data.setHours(7, 0, 0, 0);
      this.localNotifications.schedule({
        id: 111,
        text: 'Bom dia, não se esqueça da sua consulta!',
        trigger: {at: data},
        led: 'FF0000',
        sound: null
      });
      // console.log('Caso exista notificacao anterior: cancelar');
      // console.log('Lança notificacao para a consulta');
      // console.log('Atribuir id para notificação: dtconsulta');
    }
  }


  async onSubmit() {
    try {
      const result = await this.consultaService.save(this.consulta);
      this.consulta.id = result.insertId;
      await this.atribuiNotificacao(this.consulta.dataConsulta);

      const toast = await this.toastCtrl.create({
        header: 'Sucesso',
        message: 'Consulta salva com sucesso.',
        color: 'success',
        position: 'bottom',
        duration: 3000
      });

      toast.present();
    } catch (error) {
      console.log(error);
      const toast = await this.toastCtrl.create({
        header: 'Erro',
        message: 'Ocorreu um erro ao tentar salvar a consulta.',
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });

      toast.present();
    }
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
