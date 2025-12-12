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
  formPesquisa!: FormGroup;  // <-- ADICIONADO

  constructor(private fb: FormBuilder) {}

  ngOnInit() {

    // 🔍 Formulário de pesquisa
    this.formPesquisa = this.fb.group({
      Pesquisar: ['']
    });

    // 📝 Formulário principal
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
      console.log('Dados do formulário:', this.form.value);
      alert('Tarefa salva com sucesso!');
      this.form.reset({ prioridade: 'media', concluida: false });
    } else {
      alert('Preencha os campos obrigatórios!');
    }
  }

  pesquisar() {
    console.log('Busca:', this.formPesquisa.value.Pesquisar);
  }
}
