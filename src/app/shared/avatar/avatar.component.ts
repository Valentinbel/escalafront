import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { Observable } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
    selector: 'avatar',
    imports: [CommonModule, MatDialogModule],
    templateUrl: './avatar.component.html',
    styleUrl: './avatar.component.css',
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: AvatarComponent
      }
    ]
})
export class AvatarComponent implements OnInit, ControlValueAccessor {
  
  // TODO Icon vient de https://phosphoricons.com/. Banque importée dans index.html
  // On peut lui mettre une color. + size.+ 
  // Déplacer component dans Profile. 
  
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
   // console.log('AvatarComponent');
  }

  onChange = (fileUrl: string) => {};

  onTouched = () => {};
  
 /* disabled: boolean = false;*/
  
  writeValue(_file: string): void {
    this.file = _file;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  /*setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }*/
  
  file: string = '';

  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      const _file = URL.createObjectURL(files[0]);
      console.log(_file);
      this.resetInput();
      this.openAvatarEditor(_file).subscribe((result) => {
        if(result){
          console.log('result openAvatarEditor: ' ,result);
          this.file = result;
          this.onChange(this.file); 
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