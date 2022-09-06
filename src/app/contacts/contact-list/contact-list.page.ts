import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Contact } from '../shared/contact';
import { ContactService } from '../shared/contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.page.html',
  styleUrls: ['./contact-list.page.scss'],
})
export class ContactListPage implements OnInit {

  contacts: Contact[] = [];

  constructor(
    private contactService: ContactService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) { }

  ngOnInit() { } //Roda apenas uma vez, qnd o componente aparece na tela mas qnd voltar do cadastro ele nao seria chamado

  ionViewWillEnter() { //É carregado sempre que entra na tela
    this.loadContacts();
  }

  async loadContacts() {
    this.contacts = await this.contactService.getAll();
  }

  doSerchClear() {
    this.loadContacts();
  }

  async doSerchBarChange($event: any) {
    const value = $event.target.value;
    if (value && value.length >= 2) {
      this.contacts = await this.contactService.filter(value);
    }
  }

  async delete(contact: Contact) {
    const alert = await this.alertCtrl.create({
      header: 'Deletar?',
      message: `Deseja excluir o contato: ${contact.nome}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: () => {
            this.executeDelete(contact);
          }
        }
      ]
    });

    alert.present();
  }

  async executeDelete(contact: Contact) {
    try {
      // Removendo do banco de dados
      await this.contactService.delete(contact.id);

      // Removendo do array
      const index = this.contacts.indexOf(contact);
      this.contacts.splice(index, 1);

      const toast = await this.toastCtrl.create({
        header: 'Sucesso',
        message: 'Contato excluído com sucesso.',
        color: 'success',
        position: 'bottom',
        duration: 3000
      });

      toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        header: 'Erro',
        message: 'Ocorreu um erro ao tentar excluir o Contato.',
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });

      toast.present();
    }
  }
}
