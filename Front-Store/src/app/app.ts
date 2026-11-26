import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { Template } from './template/template'; <-- Pode apagar esta linha

@Component({
  selector: 'app-root',
  imports: [RouterOutlet], // <-- Deixe apenas o RouterOutlet
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Front-Store');
}