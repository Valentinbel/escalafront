import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-search',
    imports: [RouterModule, CommonModule, TranslateModule],
    templateUrl: './search.component.html',
    styleUrl: './search.component.css'
})
export class SearchComponent { //implements onInit

}
