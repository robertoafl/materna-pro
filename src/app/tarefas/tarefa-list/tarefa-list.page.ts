import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Tarefa } from '../shared/tarefa';
import { TarefaService } from '../shared/tarefa.service';

@Component({
  selector: 'app-tarefa-list',
  templateUrl: './tarefa-list.page.html',
  styleUrls: ['./tarefa-list.page.scss'],
})
export class TarefaListPage implements OnInit {

  tarefas: Tarefa[] = [];

  constructor(
    private tarefaService: TarefaService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) { }

  ngOnInit() { } //Roda apenas uma vez, qnd o componente aparece na tela mas qnd voltar do cadastro ele nao seria chamado

  ionViewWillEnter() { //É carregado sempre que entra na tela
    this.loadTarefas();
  }

  async loadTarefas() {
    this.tarefas = await this.tarefaService.getAll();
  }

  doSerchClear() {
    this.loadTarefas();
  }

  async doSerchBarChange($event: any) {
    const value = $event.target.value;
    if (value && value.length >= 2) {
      this.tarefas = await this.tarefaService.filter(value);
    }
  }

  async delete(tarefa: Tarefa) {
    const alert = await this.alertCtrl.create({
      header: 'Deletar?',
      message: `Deseja excluir a tarefa: ${tarefa.name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: () => {
            this.executeDelete(tarefa);
          }
        }
      ]
    });

    alert.present();
  }

  async executeDelete(tarefa: Tarefa) {
    try {
      // Removendo do banco de dados
      await this.tarefaService.delete(tarefa.id);

      // Removendo do array
      const index = this.tarefas.indexOf(tarefa);
      this.tarefas.splice(index, 1);

      const toast = await this.toastCtrl.create({
        header: 'Sucesso',
        message: 'Tarefa excluída com sucesso.',
        color: 'success',
        position: 'bottom',
        duration: 3000
      });

      toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        header: 'Erro',
        message: 'Ocorreu um erro ao tentar excluir a tarefa.',
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });

      toast.present();
    }
  }
}
