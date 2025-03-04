import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @HostBinding('class.scrolled-header') isHeaderScrolled = false;
  
  onHeaderScrolled(isScrolled: boolean) {
    this.isHeaderScrolled = isScrolled;
  }
}
