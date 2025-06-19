import { Component } from '@angular/core';
import { PRIMENG_MODULES } from '../../shared-primeng-imports';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  imports: [PRIMENG_MODULES, HttpClientModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

}
