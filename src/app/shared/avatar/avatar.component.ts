import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AvatarService } from '../../shared/avatar/avatar.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from '../snack-bar/snack-bar.service';
import { DomSanitizer, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { AvatarStorageService } from './avatar-storage.service';
import { NgxImageCompressService } from 'ngx-image-compress';


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
      },
      NgxImageCompressService
    ]
})
export class AvatarComponent implements OnInit, OnDestroy, ControlValueAccessor {

  // TODO Icon vient de https://phosphoricons.com/. Banque importée dans index.html
  // On peut lui mettre une color. + size.+

  avatarUrl: SafeUrl | null = null;
  // Pour background-image, il faut un SafeStyle TODO quoi faire de ce commentaire ?
  avatarBackgroundStyle: SafeStyle | null = null;

  private userId: number;
  private fileConverted: File;
  private avatarId: number;
  private destroy$ = new Subject<void>();
  objectUrl: string | null = null;

  constructor(
    public dialog: MatDialog,
    private readonly avatarService: AvatarService,
    private readonly snackBarService: SnackBarService,
    private readonly translateService: TranslateService,
    private readonly avatarStorageService: AvatarStorageService,
    private sanitizer: DomSanitizer,
    private imageCompress: NgxImageCompressService
  ) {}

  ngOnInit(): void {
    if (history.state.userId) {
      this.userId = history.state.userId;
    if (this.avatarStorageService.getAvatarId())
      this.loadAvatar(this.userId);
   }
  }

  onChange = (fileInfoId: number) => {}; // TODO avatarId ?????

  onTouched = () => {};

 /* disabled: boolean = false;*/

  writeValue(_avatarId: number): void {
    this.avatarId = _avatarId;
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


  private loadAvatar(userId: number): void {
    this.avatarService.getFile(this.userId)
    .pipe(takeUntil(this.destroy$)).subscribe({
      next: (url) => {
        // Nettoyer l'ancienne URL si elle existe
        if (this.objectUrl) {
          URL.revokeObjectURL(this.objectUrl);
        }

        // Stocker l'URL brute
        this.avatarUrl = url;

        // Sanitizer pour background-image
        const backgroundImageValue = `url(${url})`;
        this.avatarBackgroundStyle = this.sanitizer.bypassSecurityTrustStyle(backgroundImageValue);
      },
      error: (err) => {
        console.log("Error on retrieving avatar from server");
        this.displayErrorSnackBar(err.error.message);
      }});
  }

  onFileChange(event: any): void {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      const _file: string = URL.createObjectURL(files[0]);
      console.log('Selected file:', files[0]);
      const fileName = files[0].name;

      this.resetInput();
      this.openAvatarEditor(_file).subscribe({ 
        next: (result) => { 
          this.compressAndUploadfile(result, fileName);
        }, 
        error: (err) => { 
          console.log("Error on avatar editor dialog");
          this.displayErrorSnackBar(err.error.message);
        }
      });
    }
  }

  private compressAndUploadfile(fileBase64: string, fileName: string): void {
    this.objectUrl = fileBase64;

    this.fileConverted = this.convertToFile(fileBase64, fileName);
    console.log('Converted file size:', this.fileConverted.size);
    
    if (this.fileConverted.size > 512000 ) { // 500 KB
      console.log('File too big, compressing...');  
      this.imageCompress.compressFile(fileBase64, -1, 50, 50).then((compressedImage) => {              
        return this.compressAndUploadfile(compressedImage, fileName);
      });
    } 
    else {
      this.saveFile(this.fileConverted);
    }
  }

  private resetInput(): void {
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if(input) {
      input.value = "";
    }
  }

  private openAvatarEditor(image: string): Observable<any> {
    const dialogRef = this.dialog.open(ImageCropperComponent, {
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: image
    });
    return dialogRef.afterClosed();
  }

  private convertToFile(fileBase64: string, originalFileName: string): File {
    // Convertir le base64 en Blob
    const base64Data = fileBase64.split(',')[1]; // Supprime le préfixe "data:image/png;base64,"
    const byteString = window.atob(base64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
      // Déterminer le type MIME (png, jpeg, etc.)
    const mimeMatch = fileBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    const mime = (mimeMatch && mimeMatch.length > 1) ? mimeMatch[1] : 'image/png';

      // Créer un Blob puis un File
    const blob = new Blob([int8Array], { type: mime });
    return new File([blob], originalFileName, { type: mime });
  }

  private saveFile(fileConverted: File): void {
    console.log('Uploading avatar file...');
    this.avatarService.upload(fileConverted, this.userId).subscribe({
      next: (event) => {
        this.avatarId = event;
        this.onChange(this.avatarId);
        this.avatarStorageService.setAvatarId(this.avatarId);
        this.loadAvatar(this.userId);
      },
      error: (err) => {
        this.displayErrorSnackBar(err.error.message);
      }});
  }

  displayErrorSnackBar(errorMessage: string): void {
    console.log(errorMessage);
    let saveError = this.translateService.instant('avatar.saveError');
    this.snackBarService.add(saveError, 8000, 'error');
  }

  ngOnDestroy(): void {
    // clean subscription
    this.destroy$.next();
    this.destroy$.complete();

    // Libération de la mémoire de l'URL objet
    if (this.avatarUrl && typeof this.avatarUrl === 'string') {
      URL.revokeObjectURL(this.avatarUrl);
    }
  }
}