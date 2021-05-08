import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsultaListPageRoutingModule } from './consulta-list-routing.module';

import { ConsultaListPage } from './consulta-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaListPageRoutingModule
  ],
  declarations: [ConsultaListPage]
})
export class ConsultaListPageModule {}
