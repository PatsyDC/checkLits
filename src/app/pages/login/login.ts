import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private router = inject(Router);

  usuario = '';
  clave = '';
  verClave = signal(false);
  error = signal('');

  ingresar() {
    // Prototipo: solo valida que los campos no estén vacíos
    if (!this.usuario.trim() || !this.clave.trim()) {
      this.error.set('Ingresa tu usuario y contraseña.');
      return;
    }
    if (this.clave.length !== 8) {
    this.error.set('La contraseña debe tener exactamente 8 caracteres.');
    return;
    }
    this.error.set('');
    this.router.navigate(['/checklist']);
  }
}
