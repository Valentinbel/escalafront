import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { Observable } from 'rxjs';


@Component({
    selector: 'avatar',
    imports: [CommonModule, MatDialogModule],
    templateUrl: './avatar.component.html',
    styleUrl: './avatar.component.css'
})
export class AvatarComponent {
  // TODO Icon vient de https://phosphoricons.com/. Banque importée dans index.html
  // On peut lui mettre une color. + size.+ 

  
  constructor(public dialog: MatDialog) {}

  file: string = '';

  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      const _file = URL.createObjectURL(files[0]);
      console.log(_file);
      this.resetInput();
      this.openAvatarEditor(_file).subscribe((result) => {
        if(result){
          console.log('resultopenAvatarEditor: ' ,result);
          this.file = result;
        }
      }); 
    }
  }

  resetInput(){
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if(input){
      input.value = "";
    }
  }

  openAvatarEditor(image: string): Observable<any> {
    const dialogRef = this.dialog.open(ImageCropperComponent, { 
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: image
    });
    return dialogRef.afterClosed();
  }
}
//https://codepen.io/denic/pen/ZEbKgPp
//https://codepen.io/timothylong/pen/AJxrPR