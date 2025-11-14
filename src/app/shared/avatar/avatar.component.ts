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
export class AvatarComponent implements OnInit, OnDestroy, ControlValueAccessor {

  // TODO Icon vient de https://phosphoricons.com/. Banque importée dans index.html
  // On peut lui mettre une color. + size.+

  avatarUrl: SafeUrl | null = null;
  // Pour background-image, il faut un SafeStyle
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
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
   if (history.state.userId) {
    this.userId = history.state.userId;

    // if(avatarId est présent) {
    this.loadAvatar(this.userId);
    console.log("avatarUrl: ", this.avatarUrl);
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


  loadAvatar(userId: number): void {
    this.avatarService.getFile(this.userId)
    .pipe(takeUntil(this.destroy$)).subscribe({
      next: (url) => {
        console.log("retour getFile: " + url);

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

  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      const _file = URL.createObjectURL(files[0]);
      const fileName = files[0].name;
      this.resetInput();
      this.openAvatarEditor(_file).subscribe((result) => { // TODO un next: error ici
        if(result){
          this.objectUrl = result; //////////////////////////
          this.fileConverted = this.convertToFile(result, fileName);
          this.saveFile(this.fileConverted);
        }
      });
    }
  }

  resetInput(){
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    console.log("INPUT: ", input);
    console.log("INPUT VALUE: ", input.value);
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

  convertToFile(fileBase64: string, originalFileName: string): File {
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

  saveFile(fileConverted: File) {
    this.avatarService.upload(fileConverted, this.userId).subscribe({
      next: (event) => {
        console.log("retour upload avatar. fileInfoId: "+  event);
        this.avatarId = event;
        this.onChange(this.avatarId);

        //TODO: mettre l'avatar dasn un storage (?) 
        // appeler load() ici?
        // ou seulement certains éléments de la methode?
      },
      error: (err) => {
        this.displayErrorSnackBar(err.error.message);
      }});

      // TODO finir ca
    /*const formData: FormData = new FormData();
    formData.append("userId", this.userId.toString());
    formData.append("avatar", this.field['avatar'].value);*/

  }

  displayErrorSnackBar(errorMessage: string): void {
    console.log(errorMessage);
    let saveError = this.translateService.instant('avatar.saveError');
    this.snackBarService.add(saveError, 8000, 'error');
  }

  ngOnDestroy(): void {
    // Nettoyage de la subscription
    this.destroy$.next();
    this.destroy$.complete();

    // Libération de la mémoire de l'URL objet
    if (this.avatarUrl && typeof this.avatarUrl === 'string') {
      URL.revokeObjectURL(this.avatarUrl);
    }
  }
}

//TODO : check
//https://codepen.io/denic/pen/ZEbKgPp
//https://codepen.io/timothylong/pen/AJxrPR