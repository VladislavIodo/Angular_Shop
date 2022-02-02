import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OffersService} from "../../../services/offers.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.less'],
})
export class SearchFormComponent implements OnInit {
  public searchForm: FormGroup | undefined;

  constructor(private offersService: OffersService,
              private _snackBar: MatSnackBar) {
  }

  public get search() {
    return this.searchForm?.get("search");
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      search: new FormControl("", [Validators.required])
    });
  }

  searchProduct() {
    this.offersService.getOffers(this.searchForm?.value).subscribe(
      {
        next: (data) => {
          if (data.length > 0) {
            this._snackBar.open(`Найдено ${data.length} товаров удовлетворяющих поиску`, "Закрыть", {
              duration: 5000
            });
          }
          this.searchForm?.reset();
        },
        error: (error) => {
          this.searchForm?.reset();
          if (error.status === 403) {
            this._snackBar.open("Товар отсутствует!)", "Закрыть", {
              duration: 5000
            });

          } else {
            this._snackBar.open("Возникли непредвиденные неполадки, повторите попытку позже!", "Закрыть", {
              duration: 5000
            });
          }
        }
      }
    );
  }
}
