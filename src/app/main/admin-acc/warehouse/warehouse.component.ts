import {Component, OnInit} from '@angular/core';
import {ChartConfiguration, ChartType} from "chart.js";
import DataLabelsPlugin from "chartjs-plugin-datalabels";
import {tap} from "rxjs/operators";
import {Observable} from "rxjs";
import {OffersService} from "../../../services/offers.service";
import {Offer} from "../../../models/Offer";

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.less']
})
export class WarehouseComponent implements OnInit {
  offers?: Observable<Offer[]>;

  dataWarehouse: number[] = [];
  labelsWarehouse: string[] = [];

  options: {} = {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  chartPlugins = [
    DataLabelsPlugin
  ];

  barChartType: ChartType = 'bar';

  constructor(private offersService: OffersService) {
  }

  public warehouseData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: this.dataWarehouse,
        label: `Количество товара на складе  на ${new Date().toLocaleDateString('ru', this.options)}`,
      }
    ],
    labels: this.labelsWarehouse
  };

  getDataForWarehouse(dataSource: any[]) {
    const groupCategory = dataSource.reduce((prevVal, currVal) => {
      prevVal[currVal.category] = prevVal[currVal.category] || [];
      prevVal[currVal.category].push(currVal.availability);
      return prevVal;
    }, {});

    for (const [key, value] of Object.entries<[number]>(groupCategory)) {
      let totalAvailability = value.reduce((prevVal, currVal) => prevVal + currVal);
      this.labelsWarehouse.push(key);
      this.dataWarehouse.push(totalAvailability);
    }
  }

  ngOnInit() {
    this.offers = this.offersService.getOffers().pipe(
      tap((data) => {
        this.getDataForWarehouse(data);
      })
    );
  }
}
