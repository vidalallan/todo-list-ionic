import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task',
  standalone: true,
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class TaskPage implements OnInit {  

  //Campos do formulário
  title: string = '';
  description: string = '';
  startTask: string = '';
  endTask: string = '';
  userId: string = '3587c49b-06b7-4086-a53b-d59300555796';

  typeTaskList: any[] = [];
  tasks: any[] = [];
  statusList: any[] = [];

  
  selectedTypeTaskId: string = '';
  selectedStatusId: string = '';

  editingTaskId: string | null = null;
  
  private readonly API_URL = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  ngOnInit() {    
    this.loadType();
    this.loadStatus();
    this.loadTasks();
  }

  loadType() {
    this.http.get<any[]>(`${this.API_URL}/typetask`)
      .subscribe({
        next: (data) => {
          this.typeTaskList = data.filter(t => !t.deleted);
        },
        error: (err) => console.error("Erro ao carregar os tipos:", err)
      });
  }

  loadStatus() {
    this.http.get<any[]>(`${this.API_URL}/statustask`)
      .subscribe({
        next: (data) => {
          this.statusList = data.filter(s => !s.deleted);
          console.log("Status:", this.statusList);
        },
        error: (err) => console.error("Erro ao carregar os status:", err)
      });
  }

  loadTasks() {
    this.http.get<any[]>(`${this.API_URL}/task`)
      .subscribe({
        next: (data) => {
          this.tasks = data;
          console.log("Tasks carregadas:", this.tasks);
        },
        error: (err) => console.error("Erro ao carregar tasks:", err)
      });
  }
  
  clearForm() {
      this.title = "";
      this.description = "";
      this.startTask = "";
      this.endTask = "";
      this.selectedStatusId = "";
      this.selectedTypeTaskId = "";
      this.editingTaskId = null;
  }

  cancelEdit() {
    this.clearForm();
  }

  //Inserção
  createTask() {
    const newTask = {
      title: this.title,
      description: this.description,
      startTask: this.startTask,
      endTask: this.endTask,
      statusTaskId: this.selectedStatusId,
      userId: this.userId,
      typeTaskId: this.selectedTypeTaskId
    };

    this.http.post(`${this.API_URL}/task`, newTask)
      .subscribe({
        next: (response) => {
          console.log("Tarefa criada:", response);
          alert("Tarefa criada com sucesso!");
          this.clearForm();
          this.loadTasks();
        },
        error: (err) => {
          alert("Erro ao criar tarefa. Verifique o console.");
        }
      });
  }


  //Exclusão
  deleteTask(id: string) {
    if (!confirm("Deseja excluir esta tarefa?")) return;

    this.http.delete(`${this.API_URL}/task/deleted/${id}`)
      .subscribe({
        next: () => {
          alert("Tarefa excluída com sucesso!");
          this.loadTasks();
        },
        error: err => {          
          alert("Erro ao excluir tarefa.");
        }
      });
  }

  editTask(t: any) {
    
    this.title = t.title;
    this.description = t.description;    
    
    this.startTask = t.startTask ? t.startTask.substring(0, 16) : '';
    this.endTask = t.endTask ? t.endTask.substring(0, 16) : '';
    
    this.selectedStatusId = t.statusTaskId; 
    this.selectedTypeTaskId = t.typeTaskId; 
    
    this.editingTaskId = t.id;    
  }
  
  //Alteração
  updateTask() {
    if (!this.editingTaskId) {
      alert("Nenhuma tarefa selecionada para edição!");
      return;
    }

    const updatedTask = {
      title: this.title,
      description: this.description,
      startTask: this.startTask,
      endTask: this.endTask,
      statusTaskId: this.selectedStatusId,
      userId: this.userId,
      typeTaskId: this.selectedTypeTaskId
    };

    this.http.put(
        `${this.API_URL}/task/${this.editingTaskId}`,
        updatedTask
      )
      .subscribe({
        next: () => {
          alert("Tarefa alterada com sucesso!");
          this.clearForm();
          this.loadTasks();
        },
        error: err => {          
          alert("Erro ao atualizar tarefa");
        }
      });
  }

}