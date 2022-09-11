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
      console.log('onSubmit');
      
      this.atribuiTrimestres();
      this.atribuiNotificacoes();
      const result = await this.contactService.save(this.contact);
      this.contact.id = result.insertId;

      /*
      await this.loadContact(this.contact.id);
      console.log('this.contact.dataUltimaMenstruacao: ', this.contact.dataUltimaMenstruacao);
      console.log('this.contact.terminoPrimeiroTrimestre: ', this.contact.terminoPrimeiroTrimestre);
      console.log('this.contact.terminoSegundoTrimestre: ', this.contact.terminoSegundoTrimestre);
      console.log('this.contact.terminoTerceiroTrimestre: ', this.contact.terminoTerceiroTrimestre);
      */

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

  informaTempoDeGestacao() {

    console.log('Informar o trimestre e semana no campo a seguir');

    //this.contact.terminoPrimeiroTrimestre = new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + 7884000000);
    //this.contact.terminoSegundoTrimestre = new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + 15768000000);
    //this.contact.terminoTerceiroTrimestre = new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + 23652000000);

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

  atribuiTrimestres() {
    this.contact.terminoPrimeiroTrimestre = new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*12));
    this.contact.terminoSegundoTrimestre = new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*24));
    this.contact.terminoTerceiroTrimestre = new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*36));
  }

  atribuiNotificacoes() {
    //Toda vem que entra aqui, fazer um loop cancelando todas as msg pelo id e refazendo tds
    //O lançamento das notificações serão de acordo com as 42 semanas de gestação
    //mas se a gestante se cadastrou já em semana avançada, deve se...
    //a data da semana X dela é anterior (ou igual) a data atual, se for, não lança a notificação
    console.log('Atribuir notificações');
    for (var i = 1; i <= 42; i++) {
      switch (i.toString()) {
        case '1': //1ª semana de gestação e 1ª semana do 1º trimestre
          console.log('Em ', new Date(this.contact.dataUltimaMenstruacao),' você está na ', i, 'ª semana.');
          console.log('Seja bem vinda ao app Materna PrO. Você está no primeiro trimestre da gestação. Você já agendou seu pré-natal odontológico?');
          break;
        case '3': //3ª semana de gestação e 3ª semana do 1º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*2)),' você está na ', i, 'ª semana.');
          console.log('Lembre-se sempre de realizar a escovação dentária 3x ao dia, com escova de cabeça pequena e cerdas macias. O uso do fio dental também é muito importante.');
          break;
        case '5': //5ª semana de gestação e 5ª semana do 1º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*4)),' você está na ', i, 'ª semana.');
          console.log('Atenção! Não é comum sentir dor de dente na gravidez e seus dentes não ficarão mais fracos porque você está grávida.');
          break;
        case '7': //7ª semana de gestação e 7ª semana do 1º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*6)),' você está na ', i, 'ª semana.');
          console.log('Neste primeiro trimestre é comum que você sinta enjôos frequentes, principalmente na hora de realizar a higiene bucal. Peça orientação ao seu dentista, como deverá proceder após esses episódios.');
          break;
        case '9': //9ª semana de gestação e 9ª semana do 1º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*8)),' você está na ', i, 'ª semana.');
          console.log('Na primeira consulta odontológica o profissional irá te orientar sobre dieta, higiene bucal e sangramento gengival. Sua gengiva sangra?');
          break;
        case '11': //11ª semana de gestação e 11ª semana do 1º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*10)),' você está na ', i, 'ª semana.');
          console.log('É de extrema importância nesta fase, realizar a limpeza dos dentes com o dentista. O profissional vai prevenir e controlar o sangramento gengival, evitando assim a progressão da doença periodontal.');
          break;
        case '13': //13ª semana de gestação e 1ª semana do 2º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*12)),' você está na ', i, 'ª semana.');
          console.log('Você está no segundo trimestre da gestação. Sabia que este é o melhor período para realizar procedimentos odontológicos mais difíceis? Agende sua consulta!');
          break;
        case '15': //15ª semana de gestação e 3ª semana do 2º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*14)),' você está na ', i, 'ª semana.');
          console.log('Atenção com a sua alimentação! Nesta fase o seu embrião está desenvolvendo o paladar. Os alimentos consumidos por você, serão lembrados pela criança após o nascimento.');
          break;
        case '17': //17ª semana de gestação e 5ª semana do 2º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*16)),' você está na ', i, 'ª semana.');
          console.log('É importante fazer a troca da escova de dentes. O cirurgião dentista recomendada a troca de 3 em 3 meses.');
          break;
        case '19': //19ª semana de gestação e 7ª semana do 2º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*18)),' você está na ', i, 'ª semana.');
          console.log('Procure agendar sua consulta odontológicas no período da tarde, para assim evitar episódios de enjôos durante a consulta. E não se esqueça de ir alimentada.');
          break;
        case '21': //21ª semana de gestação e 9ª semana do 2º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*20)),' você está na ', i, 'ª semana.');
          console.log('A doença das gengivas pode ocasionar parto prematuro e nascimento de bebês com baixo peso. Cuide-se!');
          break;
        case '23': //23ª semana de gestação e 11ª semana do 2º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*22)),' você está na ', i, 'ª semana.');
          console.log('');
          break;
        case '25': //25ª semana de gestação e 1ª semana do 3º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*24)),' você está na ', i, 'ª semana.');
          console.log('Você chegou ao último trimestre da gestação! Não deixe para depois. Agende sua consulta odontológica! Não esqueça de perguntar sobre como realizar a higiene bucal do bebê.');
          break;
        case '27': //27ª semana de gestação e 3ª semana do 3º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*26)),' você está na ', i, 'ª semana.');
          console.log('O atendimento odontológico durante a gestação é seguro, previne complicações e melhora a qualidade de vida da gestante.');
          break;
        case '29': //29ª semana de gestação e 5ª semana do 3º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*28)),' você está na ', i, 'ª semana.');
          console.log('Gestantes são pacientes que apresentam alterações físicas, biológicas e hormonais que alteram a cavidade bucal. Por isso é muito importante o acompanhamento odontológico!');
          break;
        case '31': //31ª semana de gestação e 7ª semana do 3º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*30)),' você está na ', i, 'ª semana.');
          console.log('O pré-natal odontológico permite o desenvolvimento de hábitos saudáveis, como por exemplo: o incentivo à amamentação exclusiva, importante para o correto desenvolvimento da boca e face do seu bebê.');
          break;
        case '33': //33ª semana de gestação e 9ª semana do 3º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*32)),' você está na ', i, 'ª semana.');
          console.log('Anote suas dúvidas e se informe nas consultas do pré-natal odontológico. O cirurgião dentista está capacitado para responder todas as suas dúvidas de saúde bucal.');
          break;
        case '35': //35ª semana de gestação e 11ª semana do 3º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*34)),' você está na ', i, 'ª semana.');
          console.log('');
          break;
        case '37': //37ª semana de gestação e 1ª semana do 4º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*36)),' você está na ', i, 'ª semana.');
          console.log('');
          break;
        case '39': //39ª semana de gestação e 2ª semana do 4º trimestre
          console.log('Em ', new Date(new Date(this.contact.dataUltimaMenstruacao).getTime() + (86400000*7*38)),' você está na ', i, 'ª semana.');
          console.log('');
          break;
      }
    }
   
  }

}
