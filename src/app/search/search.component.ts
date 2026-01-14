import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
	selector: 'app-search',
	imports: [RouterModule, CommonModule, TranslateModule],
	templateUrl: './search.component.html',
	styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

	constructor(private readonly router: Router) { }

	ngOnInit(): void {
		console.log("history.state in SearchComponent: ", history.state);
	}

	openAddEditSearch(): void {
		this.router.navigate(['/add-edit-search'], { state: {} });
	}

}
