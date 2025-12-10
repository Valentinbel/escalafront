import { Component } from '@angular/core';
import { SnackBarService } from './snack-bar.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'snack-bar',
    imports: [CommonModule],
    templateUrl: './snack-bar.component.html',
    styleUrl: './snack-bar.component.css'
})
export class SnackBarComponent { //implements onInit
  constructor(public snackBarService: SnackBarService){}

  removeSnackBar(i: number): void {
    this.snackBarService.remove(i);
  }
}
