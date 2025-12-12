import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline, addOutline } from 'ionicons/icons'; 

interface StatusTarefa {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

@Component({
  selector: 'app-status-task',
  standalone: true,
  templateUrl: './status-task.page.html',
  styleUrls: ['./status-task.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,   
  ]
})
export class StatusTaskPage implements OnInit {
  
  private readonly API_URL = 'http://localhost:8000/statustask'; 
  public statusTarefas: StatusTarefa[] = [];
  public isLoading: boolean = true; 

  public novoStatusTitle: string = '';
  public isSaving: boolean = false;   
  public isEditing: boolean = false;  
  public editingId: string | null = null;

  constructor(private http: HttpClient) {
    addIcons({ createOutline, trashOutline, addOutline });
  }

  ngOnInit() {
    this.carregarStatus();
  }  

  carregarStatus() {
    this.isLoading = true;
    
    this.http.get<StatusTarefa[]>(this.API_URL)
      .subscribe({
        next: (dadosJson: StatusTarefa[]) => {
          this.statusTarefas = dadosJson.filter(status => !status.deleted);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar status de tarefas:', err);
          this.isLoading = false;
        }
      });
  }
  
  //Inserção
  adicionarStatus() {    
    if (this.isEditing) {
      this.salvarAlteracao();
      return;
    }    
    
    if (!this.novoStatusTitle || this.novoStatusTitle.trim() === '') {
      console.warn('O título não pode estar vazio.');
      return;
    }

    this.isSaving = true;
    const novoStatusData = { title: this.novoStatusTitle.trim() };

    this.http.post<StatusTarefa>(this.API_URL, novoStatusData)
        .subscribe({
            next: () => {
                this.resetForm();
                this.carregarStatus(); 
            },
            error: (err) => { console.error('Erro ao adicionar status:', err); this.isSaving = false; },
            complete: () => { this.isSaving = false; }
        });
  }
  
  //Alterção
  alterarStatus(id: string) {
    const statusToEdit = this.statusTarefas.find(status => status.id === id);

    if (statusToEdit) {
      this.isEditing = true;
      this.editingId = statusToEdit.id;
      this.novoStatusTitle = statusToEdit.title;
    }
  }

  
  salvarAlteracao() {
    if (!this.editingId || !this.novoStatusTitle || this.novoStatusTitle.trim() === '') {
      console.warn('Dados de alteração inválidos.');
      return;
    }

    this.isSaving = true;    
   
    const updateData = {
      title: this.novoStatusTitle.trim() 
    };

    const url = `${this.API_URL}/${this.editingId}`;

    this.http.put<StatusTarefa>(url, updateData)
      .subscribe({
        next: () => {
          this.resetForm();
          this.carregarStatus(); 
        },
        error: (err) => {
          console.error('Erro ao salvar alteração:', err);
          this.isSaving = false;
        },
        complete: () => {
          this.isSaving = false;
        }
      });
  }  
  
  resetForm() {
    this.novoStatusTitle = '';
    this.isEditing = false;
    this.editingId = null;
  }
  
  //Exclusão
  excluirStatus(id: string) {
    const url = `${this.API_URL}/deleted/${id}`;

    this.http.delete<any>(url) 
      .subscribe({
          next: () => {
              this.carregarStatus(); 
          },
          error: (err) => {
              console.error(`Erro ao excluir `, err);
          }
      });
  }
}