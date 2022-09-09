import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Contact } from 'src/app/contacts/shared/contact';
import { ContactService } from 'src/app/contacts/shared/contact.service';
import { Consulta } from '../shared/consulta';
import { ConsultaService } from '../shared/consulta.service';

@Component({
  selector: 'app-consulta-form',
  templateUrl: './consulta-form.page.html',
  styleUrls: ['./consulta-form.page.scss'],
})
export class ConsultaFormPage implements OnInit {

  title: string = 'Nova consulta';
  consulta: Consulta;
  contact: Contact;

  ocultaPrimeiroTrimestre: boolean = false;
  ocultaSegundoTrimestre: boolean = true;
  ocultaTerceiroTrimestre: boolean = true;

  constructor(
    private consultaService: ConsultaService,
    private contactService: ContactService,
    private route: ActivatedRoute, //Pegar a rota ativa do angula
    private toastCtrl: ToastController) { }

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

  async onSubmit() {
    try {
      const result = await this.consultaService.save(this.consulta);
      this.consulta.id = result.insertId;

      const toast = await this.toastCtrl.create({
        header: 'Sucesso',
        message: 'Consulta salva com sucesso.',
        color: 'success',
        position: 'bottom',
        duration: 3000
      });

      toast.present();
    } catch (error) {
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

  atribuiNotificacao() {

    console.log('Caso exista notificacao anterior: cancelar');
    console.log('Lança notificacao para a consulta');
    console.log('Atribuir id para notificação: dtconsulta');

  }

}
