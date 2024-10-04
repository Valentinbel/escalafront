import { Component } from '@angular/core';
import { SnackBarService } from './snack-bar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.css'
})
export class SnackBarComponent {
  constructor(public snackBarService: SnackBarService){}

  removeSnackBar(i: number) {
    this.snackBarService.remove(i);
  }
}
