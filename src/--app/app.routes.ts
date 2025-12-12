import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/inbox',
    pathMatch: 'full',
  },

  {
    path: 'typetask',
    loadComponent: () =>
    import('./typetask/type-task.page').then(m => m.TypeTaskPage)
  },

  {
    path: 'statusTask',
    loadComponent: () =>
    import('./statustask/status-task.page').then(m => m.StatusTaskPage)
  },

  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },
];
