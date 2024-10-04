import { Injectable } from '@angular/core';
import { SnackBarComponent } from './snack-bar.component';
@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  snackBar: { message: string; duration: number; type: 'success' | 'error' }[] = [];

  add(message: string, duration: number = 3000, type: 'success' | 'error' = 'success') {
    type === 'success' ? 
      message = "quel succès! " + message.toUpperCase() 
      : message = "Error on the following field: "+ message.toUpperCase();
    
    this.snackBar.push({ message, duration, type });
    setTimeout(() => this.remove(0), duration);
  }

  remove(index: number) {
    this.snackBar.splice(index,1);
  }
}
