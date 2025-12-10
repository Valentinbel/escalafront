import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  snackBar: { message: string; duration: number; type: 'success' | 'error' }[] = [];

  add(message: string, duration: number = 3000, type: 'success' | 'error' = 'success') {
    
    this.snackBar.push({ message, duration, type });
    setTimeout(() => this.remove(0), duration);
  }

  remove(index: number): void {
    this.snackBar.splice(index,1);
  }
}
