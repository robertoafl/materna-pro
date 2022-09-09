import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Contact } from 'src/app/contacts/shared/contact';
import { ContactService } from 'src/app/contacts/shared/contact.service';
import { Tarefa } from '../shared/tarefa';
import { TarefaService } from '../shared/tarefa.service';

@Component({
  selector: 'app-tarefa-form',
  templateUrl: './tarefa-form.page.html',
  styleUrls: ['./tarefa-form.page.scss'],
})
export class TarefaFormPage implements OnInit {

  title: string = 'Nova tarefa';
  tarefa: Tarefa;
  contact: Contact;

  trimestre: any;
  ocultaPrimeiroTrimestre: boolean = false;
  ocultaSegundoTrimestre: boolean = true;
  ocultaTerceiroTrimestre: boolean = true;

  constructor(
    private tarefaService: TarefaService,
    private contactService: ContactService,
    private route: ActivatedRoute, //Pegar a rota ativa do angula
    private toastCtrl: ToastController) { }

  async ngOnInit() {
    this.tarefa = new Tarefa();
    this.contact = new Contact();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.title = 'Editar tarefa';
      this.loadTarefa(parseInt(idParam));
      await this.loadContact(parseInt(idParam));
    }

    if (new Date().getTime() <= new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + 7884000000).getTime()) {
      this.trimestre = "1";
      this.ocultaPrimeiroTrimestre = false;
      this.ocultaSegundoTrimestre = true;
      this.ocultaTerceiroTrimestre = true;
    } else if (new Date().getTime() <= new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + 15768000000).getTime()) {
      this.trimestre = "2";
      this.ocultaPrimeiroTrimestre = true;
      this.ocultaSegundoTrimestre = false;
      this.ocultaTerceiroTrimestre = true;
    } else if (new Date().getTime() <= new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + 23652000000).getTime()) {
      this.trimestre = "3";
      this.ocultaPrimeiroTrimestre = true;
      this.ocultaSegundoTrimestre = true;
      this.ocultaTerceiroTrimestre = false;
    } else {
      this.trimestre = "1";
    }
  }

  async loadTarefa(id: number) {
    this.tarefa = await this.tarefaService.getById(id);
  }

  async loadContact(id: number) {
    this.contact = await this.contactService.getById(id);
  }

  async onSubmit() {
    try {
      const result = await this.tarefaService.save(this.tarefa);
      this.tarefa.id = result.insertId;

      const toast = await this.toastCtrl.create({
        header: 'Sucesso',
        message: 'Tarefa salva com sucesso.',
        color: 'success',
        position: 'bottom',
        duration: 3000
      });

      toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        header: 'Erro',
        message: 'Ocorreu um erro ao tentar salvar a tarefa.',
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });

      toast.present();
    }
  }

}
