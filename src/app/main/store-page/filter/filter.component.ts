import {Component, OnInit} from '@angular/core';
import {Category} from "../../../models/Category";
import {OffersService} from "../../../services/offers.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less']
})

export class FilterComponent implements OnInit {

  public category: string[] = [];
  public filteredCategories?: Object;
  public price: {} = {};
  public minValue = 0;
  public maxValue = 5000;
  public reset: boolean = false;
  public itemsFilter: Category[] = [
    {
      id: "Столы",
      typesFurniture: "Столы",
      isChecked: false
    },
    {
      id: "Стулья",
      typesFurniture: "Стулья",
      isChecked: false
    },
    {
      id: "Кровати",
      typesFurniture: "Кровати",
      isChecked: false
    },
    {
      id: "Диваны",
      typesFurniture: "Диваны",
      isChecked: false
    },
    {
      id: "Шкафы",
      typesFurniture: "Шкафы",
      isChecked: false
    },
    {
      id: "Тумбочки",
      typesFurniture: "Тумбочки",
      isChecked: false
    }
  ];

  constructor(private offersService: OffersService,
              private _snackBar: MatSnackBar) {
  }

  getCategory(elem: Category) {
    if (!elem.isChecked) {
      this.category.push(elem.id);

      this.itemsFilter.forEach(item => {
        if (item.id === elem.id) {
          item.isChecked = true;
          localStorage.setItem('filter', JSON.stringify(this.category));
          this.price = this.getOfferByPrice();
          this.filteredCategories = Object.assign({}, this.price, this.category);
          if (Object.keys(this.filteredCategories).length > 0) {
            this.reset = true;
          }
          this.getOffers(this.filteredCategories);
        }
      });
    } else {
      this.itemsFilter.forEach(item => {
        this.category = this.category.filter(item => item !== elem.id);
        if (item.id === elem.id) {
          item.isChecked = false;
          localStorage.setItem("filter", JSON.stringify(this.category));
          this.price = this.getOfferByPrice();
          this.filteredCategories = Object.assign({}, this.price, this.category);
          this.reset = !(this.minValue == 0 && this.maxValue == 5000 && !JSON.parse(<string>localStorage.getItem("filter")).length);
          this.getOffers(this.filteredCategories);
        }
      });
    }
  }

  getOfferByPrice() {
    this.price = {
      minPrice: this.minValue,
      maxPrice: this.maxValue,
    };
    this.reset = !(this.minValue == 0 && this.maxValue == 5000 && !JSON.parse(<string>localStorage.getItem("filter")).length);
    this.filteredCategories = Object.assign({}, this.price, this.category);
    this.offersService.getOffers(this.filteredCategories).subscribe(
      {
        next: (data) => {
          if (data.length >= 0) {
            this._snackBar.open(`Найдено ${data.length} товаров удовлетворяющих поиску.`, "Закрыть", {
              duration: 5000
            });
          }
        },
        error: (error) => {
          if (error.status === 403) {
            this._snackBar.open("Товар удовлетворяющий данной цене отсутствует, показан последний найденный.", "Закрыть", {
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

    return this.price = {
      minPrice: this.minValue,
      maxPrice: this.maxValue,
    };
  }

  ngOnInit() {
    this.price = {
      minPrice: this.minValue,
      maxPrice: this.maxValue,
    };

    const filterName = JSON.parse(<string>localStorage.getItem("filter"));
    this.itemsFilter.forEach(item => {
      for (const itemKey of filterName) {

        if (item.id === itemKey) {
          item.isChecked = true;
          this.reset = true;
          this.category.push(item.id);
          localStorage.setItem('filter', JSON.stringify(this.category));

          this.filteredCategories = Object.assign({}, this.price, this.category);
          this.getOffers(this.filteredCategories);
        }
      }
      return this.category;
    });
  }

  getOffers(filteredCategories: Object) {
    this.offersService.getOffers(filteredCategories).subscribe(
      {
        next: (data) => {
          if (data.length >= 0) {
            this._snackBar.open(`Найдено ${data.length} товаров удовлетворяющих поиску.`, "Закрыть", {
              duration: 5000
            });
          }
        },
        error: (error) => {
          if (error.status === 403) {
            this._snackBar.open("Товар удовлетворяющий данной категории отсутствует, показан последний найденный.", "Закрыть", {
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

  resetFilter() {
    this.minValue = 0;
    this.maxValue = 5000;
    this.reset = false;
    this.category = [];
    localStorage.setItem('filter', JSON.stringify(this.category));
    this.offersService.getOffers().subscribe({
      next: (data) => {
        if (data.length >= 0) {
          this._snackBar.open('Фильтр сброшен.', "Закрыть", {
            duration: 5000
          });
        }
      }
    });
    this.itemsFilter.forEach(i => {
      return i.isChecked = false;
    });
  }
}
