import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },

  { path: 'contacts', loadChildren: './contacts/contact-list/contact-list.module#ContactListPageModule' },
  { path: 'contacts/new', loadChildren: './contacts/contact-form/contact-form.module#ContactFormPageModule' },
  { path: 'contacts/edit/:id', loadChildren: './contacts/contact-form/contact-form.module#ContactFormPageModule' },

  { path: 'consultas', loadChildren: './consultas/consulta-list/consulta-list.module#ConsultaListPageModule' },
  { path: 'consultas/new', loadChildren: './consultas/consulta-form/consulta-form.module#ConsultaFormPageModule' },
  { path: 'consultas/edit/:id', loadChildren: './consultas/consulta-form/consulta-form.module#ConsultaFormPageModule' },

  { path: 'tarefas', loadChildren: './tarefas/tarefa-list/tarefa-list.module#TarefaListPageModule' },
  { path: 'tarefas/new', loadChildren: './tarefas/tarefa-form/tarefa-form.module#TarefaFormPageModule' },
  { path: 'tarefas/edit/:id', loadChildren: './tarefas/tarefa-form/tarefa-form.module#TarefaFormPageModule' },
  
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'contact-form',
    loadChildren: () => import('./contacts/contact-form/contact-form.module').then( m => m.ContactFormPageModule)
  },
  {
    path: 'contact-list',
    loadChildren: () => import('./contacts/contact-list/contact-list.module').then( m => m.ContactListPageModule)
  },
  {
    path: 'consulta-form',
    loadChildren: () => import('./consultas/consulta-form/consulta-form.module').then( m => m.ConsultaFormPageModule)
  },
  {
    path: 'consulta-list',
    loadChildren: () => import('./consultas/consulta-list/consulta-list.module').then( m => m.ConsultaListPageModule)
  },
  {
    path: 'tarefa-form',
    loadChildren: () => import('./tarefas/tarefa-form/tarefa-form.module').then( m => m.TarefaFormPageModule)
  },
  {
    path: 'tarefa-list',
    loadChildren: () => import('./tarefas/tarefa-list/tarefa-list.module').then( m => m.TarefaListPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
