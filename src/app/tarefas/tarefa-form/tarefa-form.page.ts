import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
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

  constructor(
    private tarefaService: TarefaService,
    private route: ActivatedRoute, //Pegar a rota ativa do angula
    private toastCtrl: ToastController) { }

  ngOnInit() {
    this.tarefa = new Tarefa();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.title = 'Editar tarefa';
      this.loadTarefa(parseInt(idParam));
    }
  }

  async loadTarefa(id: number) {
    this.tarefa = await this.tarefaService.getById(id);
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
