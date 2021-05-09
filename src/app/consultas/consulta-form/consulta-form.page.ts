import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
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

  constructor(
    private consultaService: ConsultaService,
    private route: ActivatedRoute, //Pegar a rota ativa do angula
    private toastCtrl: ToastController) { }

    ngOnInit() {
      this.consulta = new Consulta();
  
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        this.title = 'Editar consulta';
        this.loadConsulta(parseInt(idParam));
      }
    }
  
    async loadConsulta(id: number) {
      this.consulta = await this.consultaService.getById(id);
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
  
  }
  