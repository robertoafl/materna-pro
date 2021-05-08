import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    //redirectTo: 'folder/Inbox',
    redirectTo: 'contacts',
    pathMatch: 'full'
  },
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
  { path: 'contacts', loadChildren: './contacts/contact-list/contact-list.module#ContactListPageModule' },
  { path: 'contacts/new', loadChildren: './contacts/contact-form/contact-form.module#ContactFormPageModule' },
  { path: 'contacts/edit/:id', loadChildren: './contacts/contact-form/contact-form.module#ContactFormPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
