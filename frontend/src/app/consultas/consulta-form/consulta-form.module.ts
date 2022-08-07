import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsultaFormPageRoutingModule } from './consulta-form-routing.module';

import { ConsultaFormPage } from './consulta-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaFormPageRoutingModule
  ],
  declarations: [ConsultaFormPage]
})
export class ConsultaFormPageModule {}
