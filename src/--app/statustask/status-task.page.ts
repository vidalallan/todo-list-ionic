import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline, addOutline } from 'ionicons/icons'; 
//import { IonMenuButton } from '@ionic/angular/standalone'; // Adicionado para uso no template

// Definição da interface para os dados que vêm da API
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
    FormsModule, // ESSENCIAL para [(ngModel)]
    ReactiveFormsModule,
    HttpClientModule,
   // IonMenuButton // Para que <ion-menu-button> funcione em standalone
  ]
})
export class StatusTaskPage implements OnInit {
  
  private readonly API_URL = 'http://localhost:8000/statustask'; 
  public statusTarefas: StatusTarefa[] = [];
  public isLoading: boolean = true; 
  
  // PROPRIEDADES DE FORMULÁRIO (INSERÇÃO/EDIÇÃO)
  public novoStatusTitle: string = ''; // Vincula ao input do status
  public isSaving: boolean = false;    // Controla o estado de salvamento
  public isEditing: boolean = false;   // 🛑 NOVO: Indica se estamos editando
  public editingId: string | null = null; // 🛑 NOVO: Armazena o ID sendo editado

  constructor(private http: HttpClient) {
    addIcons({ createOutline, trashOutline, addOutline });
  }

  ngOnInit() {
    this.carregarStatus();
  }

  // --- MÉTODOS DE CARREGAMENTO E INSERÇÃO (POST) ---

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
  
  // 🛑 MÉTODO UNIFICADO: CHAMA POST OU PUT
  adicionarStatus() {
    // Se estiver em modo de edição, chama o método PUT
    if (this.isEditing) {
      this.salvarAlteracao();
      return;
    }
    
    // Lógica para NOVO STATUS (POST)
    if (!this.novoStatusTitle || this.novoStatusTitle.trim() === '') {
      console.warn('O título não pode estar vazio.');
      return;
    }

    this.isSaving = true;
    const novoStatusData = { title: this.novoStatusTitle.trim() };

    this.http.post<StatusTarefa>(this.API_URL, novoStatusData)
        .subscribe({
            next: () => {
                this.resetForm(); // Limpa e sai do modo de edição
                this.carregarStatus(); 
            },
            error: (err) => { console.error('Erro ao adicionar status:', err); this.isSaving = false; },
            complete: () => { this.isSaving = false; }
        });
  }
  
  // --- MÉTODOS DE EDIÇÃO (PUT) ---
  
  // 🛑 1. ENTRA NO MODO DE EDIÇÃO E PREENCHE O INPUT
  alterarStatus(id: string) {
    const statusToEdit = this.statusTarefas.find(status => status.id === id);

    if (statusToEdit) {
      this.isEditing = true;
      this.editingId = statusToEdit.id;
      this.novoStatusTitle = statusToEdit.title; // 🛑 Preenche o input
    }
  }

  // 🛑 2. SALVA A ALTERAÇÃO (PUT)
  salvarAlteracao() {
    if (!this.editingId || !this.novoStatusTitle || this.novoStatusTitle.trim() === '') {
      console.warn('Dados de edição inválidos.');
      return;
    }

    this.isSaving = true;
    
    // JSON com o novo título
    const updateData = {
      title: this.novoStatusTitle.trim() 
    };

    const url = `${this.API_URL}/${this.editingId}`; // Endpoint: /statustask/{id}

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
  
  // 🛑 MÉTODO DE AUXILIAR: LIMPA FORMULÁRIO E SAI DO MODO DE EDIÇÃO
  resetForm() {
    this.novoStatusTitle = '';
    this.isEditing = false;
    this.editingId = null;
  }
  
  // --- MÉTODO DE EXCLUSÃO LÓGICA (DELETE) ---

  excluirStatus(id: string) {
    const url = `${this.API_URL}/deleted/${id}`;

    this.http.delete<any>(url) 
      .subscribe({
          next: () => {
              this.carregarStatus(); 
          },
          error: (err) => {
              console.error(`Erro ao tentar marcar status ${id} como excluído (URL: ${url}):`, err);
          }
      });
  }
}