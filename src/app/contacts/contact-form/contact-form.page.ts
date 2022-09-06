import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController, NavController  } from '@ionic/angular';
import { Contact } from '../shared/contact';
import { ContactService } from '../shared/contact.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.page.html',
  styleUrls: ['./contact-form.page.scss'],
})
export class ContactFormPage implements OnInit {

  title: string = 'Novo contato';
  contact: Contact;

  maxDate: any = new Date().toISOString();

  birthMinDate: any = new Date(new Date().setFullYear(new Date().getFullYear() - 50)).toISOString();
  birthAverageDate: any = new Date((new Date(this.birthMinDate).getTime() + new Date(this.maxDate).getTime()) / 2).toISOString();

  pregnancyMinDate: any = new Date(new Date(this.maxDate).getTime() - 23652000000).toISOString(); //Data atual menos 9 meses
  pregnancyAverageDate: any = new Date((new Date(this.pregnancyMinDate).getTime() + new Date(this.maxDate).getTime()) / 2).toISOString();

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute, //Pegar a rota ativa do angula
    private toastCtrl: ToastController) { }

  async ngOnInit() {
    this.contact = new Contact();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      //console.log("----- 1");
      this.title = 'Editar contato';
      await this.loadContact(parseInt(idParam));
    } else {
      //console.log("----- 2");
    }
    console.log(this.contact);
  }

  async loadContact(id: number) {
    this.contact = await this.contactService.getById(id);
  }

  async onSubmit() {
    try {
      const result = await this.contactService.save(this.contact);
      this.contact.id = result.insertId;

      const toast = await this.toastCtrl.create({
        header: 'Sucesso',
        message: 'Contato salvo com sucesso.',
        color: 'success',
        position: 'bottom',
        duration: 3000
      });

      toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        header: 'Erro',
        message: 'Ocorreu um erro ao tentar salvar o Contato.',
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });

      toast.present();
    }
  }

  atribuiTrimestres() {
    this.contact.terminoPrimeiroTrimestre = new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + 7884000000);
    this.contact.terminoSegundoTrimestre = new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + 15768000000);
    this.contact.terminoTerceiroTrimestre = new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + 23652000000);
  /*
    if (new Date().getTime() <= new Date(this.contact.terminoPrimeiroTrimestre).getTime()) {
      this.contact.estahGravida = "1º Trimestre";
    } else if (new Date().getTime() <= new Date(this.contact.terminoSegundoTrimestre).getTime()) {
      this.contact.estahGravida = "2º Trimestre";
    } else if (new Date().getTime() <= new Date(this.contact.terminoTerceiroTrimestre).getTime()) {
      this.contact.estahGravida = "3º Trimestre";
    }
    */
  }

}
