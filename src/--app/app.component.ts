import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

import {
  addOutline,
  createOutline,
  listOutline,
  listSharp,
  personOutline,
  personSharp,
  pricetagOutline,
  pricetagSharp,
  alertCircleOutline,
  alertCircleSharp,
  newspaper, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, 
  heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, 
  trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent {
  public appPages = [    
    { title: 'Usuários', url: '/folder/Usuários', icon: 'person' },
    { title: 'Tarefas', url: '/folder/Tarefas', icon: 'list' },
    { title: 'Status das Tarefas', url: '/statusTask', icon: 'alert-circle' },    
    { title: 'Tipos de Tarefas', url: '/typetask', icon: 'pricetag' }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {
    addIcons({addOutline,createOutline,listOutline, listSharp,
      personOutline, personSharp,
      pricetagOutline, pricetagSharp,
      alertCircleOutline, alertCircleSharp,newspaper, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, 
      heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, 
      trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp});
  }
}