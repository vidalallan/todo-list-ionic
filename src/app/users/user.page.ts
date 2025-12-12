import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline, addOutline, personCircleOutline } from 'ionicons/icons';

interface Usuario {
  id: string;
  name: string;
  email: string;
  picture: string;
  deleted: boolean;
}

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class UserPage implements OnInit {

  private readonly API_URL = 'http://localhost:8000';

  usuarios: Usuario[] = [];
  isLoading: boolean = true;

  name = '';
  email = '';
  passwordForm = '';
  confirmPasswordForm = '';
  picture = '';

  isEditing = false;
  isSaving = false;
  editingId: string | null = null;

  constructor(private http: HttpClient) {
    addIcons({ createOutline, trashOutline, addOutline, personCircleOutline });
  }

  ngOnInit() {
    this.loadUsers();
  }

  
  //Lista de usuários
  loadUsers() {
    this.isLoading = true;

    this.http.get<Usuario[]>(`${this.API_URL}/user`).subscribe({
      next: data => {
        this.usuarios = data.filter(u => !u.deleted);
        this.isLoading = false;
      },
      error: err => {        
        this.isLoading = false;
      }
    });
  }

  //Inserção e alteração de usuários
  adicionarOuAlterarUsuario() {

    if (!this.name || !this.email) {
      alert('Os campos Nome e email são de preenchimento obrigatório.');
      return;
    }

    if (!this.isEditing && this.passwordForm !== this.confirmPasswordForm) {
      alert('As senhas digitadas devem ser iguais.');
      return;
    }

    const data = {
      name: this.name,
      email: this.email,
      password: this.passwordForm,
      picture: this.picture
    };

    this.isSaving = true;

    //Inserção
    if (!this.isEditing) {
      this.http.post(`${this.API_URL}/user`, data).subscribe({
        next: () => {
          alert('Usuário cadastrado com sucesso!');
          this.resetForm();
          this.loadUsers();
          this.isSaving = false;
        },
        error: err => {          
          alert('Erro ao inserir o usuário.');
          this.isSaving = false;
        }
      });

      return;
    }

    //Alteração
    const id = this.editingId;

    this.http.put(`${this.API_URL}/user/${id}`, data).subscribe({
      next: () => {
        alert('Usuário alterado com sucesso!');
        this.resetForm();
        this.loadUsers();
        this.isSaving = false;
      },
      error: err => {        
        alert('Erro ao alterar o usuário.');
        this.isSaving = false;
      }
    });
  }

  editUser(u: Usuario) {
    this.isEditing = true;
    this.name = u.name;
    this.email = u.email;
    this.picture = u.picture;
    this.editingId = u.id;

    this.passwordForm = '';
    this.confirmPasswordForm = '';
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.passwordForm = '';
    this.confirmPasswordForm = '';
    this.picture = '';
    this.isEditing = false;
    this.editingId = null;
    this.isSaving = false;
  }

  //Exclusão
  deleteUser(id: string) {
    if (!confirm('Deseja excluir este usuário?')) return;

    this.http.delete(`${this.API_URL}/user/deleted/${id}`).subscribe({
      next: () => {
        alert('Usuário excluído com sucesso!');
        this.loadUsers();
      },
      error: err => {
      
        alert('Erro ao ecluir o usuário.');
      }
    });
  }
}
