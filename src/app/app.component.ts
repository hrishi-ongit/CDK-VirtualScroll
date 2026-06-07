import { Component } from '@angular/core';

import { MaterialTableDemoComponent } from './material-table-demo/material-table-demo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MaterialTableDemoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
