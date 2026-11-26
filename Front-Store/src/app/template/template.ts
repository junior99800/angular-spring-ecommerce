import { Component } from '@angular/core';
// 1. Importe o RouterLink e RouterLinkActive
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-template',
  // 2. Coloque-os dentro do array de imports
  imports: [RouterLink, RouterLinkActive], 
  templateUrl: './template.html',
  styleUrl: './template.scss',
})
export class Template {}