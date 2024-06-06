import { Component } from '@angular/core';
import { ItemCardComponent } from '../../components/item-card/item-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ ItemCardComponent ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export default class DashboardComponent {

}
