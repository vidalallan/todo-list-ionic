import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-type-task',
  standalone: true,
  templateUrl: './type-task.page.html',
  styleUrls: ['./type-task.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TypeTaskPage implements OnInit {

  form!: FormGroup;
  formPesquisa!: FormGroup; 

  constructor(private fb: FormBuilder) {}

  ngOnInit() {

    this.formPesquisa = this.fb.group({
      Pesquisar: ['']
    });
    
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      descricao: [''],
      prioridade: ['media', Validators.required],
      concluida: [false]
    });
  }

  salvar() {
    if (this.form.valid) {      
      alert('Tarefa salva com sucesso!');
      this.form.reset({ prioridade: 'media', concluida: false });
    } else {
      alert('Preencha os campos obrigatórios!');
    }
  }  
}