import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartConfiguration, ChartType} from 'chart.js';
import {tap} from "rxjs/operators";
import {OrderService} from "../../../services/order.service";
import {Observable} from "rxjs";
import {Order} from "../../../models/Order";
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {BaseChartDirective} from "ng2-charts";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.less']
})
export class StatisticsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(private ordersService: OrderService) {
  }

  orders?: Observable<Order[]>;

  dataSales: number[] = [];
  labelsSales: string[] = [];

  dataStatus: number[] = [];
  labelsStatus: string[] = [];

  lineChartType: ChartType = 'line';
  pieChartType: ChartType = 'pie';

  numberOfIssued: number = 0;
  numberSent: number = 0;
  numberDelivered: number = 0;

  chartPlugins = [
    DataLabelsPlugin
  ];
  options: {} = {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      datalabels: {
        anchor: 'center',
        align: 'end'
      }
    }
  };

  public salesData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: this.dataSales,
        label: `Статистика продаж на ${new Date().toLocaleDateString('ru', this.options)}`,
        yAxisID: 'y-axis-1',
        backgroundColor: 'rgba(255, 163, 67, 0.3)',
        borderColor: '#ffa343',
        fill: 'origin'
      }
    ],
    labels: this.labelsSales
  };

  public statusData: ChartConfiguration['data'] = {
    datasets: [{
      data: this.dataStatus
    }],
    labels: ['Заказ оформлен', 'Заказ отправлен', 'Заказ доставлен']
  };

  private getDataForSales(dataSource: any[]) {
    const groupDate = dataSource.reduce((prevVal, currVal) => {
      let date = new Date(currVal.date);
      prevVal[date.toLocaleDateString()] = prevVal[date.toLocaleDateString()] || [];
      prevVal[date.toLocaleDateString()].push(currVal.totalPrice);
      return prevVal;
    }, {});

    for (const [key, value] of Object.entries<[number]>(groupDate)) {
      let totalAvailability = value.reduce((prevVal, currVal) => prevVal + currVal);
      this.labelsSales.push(key);
      this.dataSales.push(totalAvailability);
    }
    this.chart?.update();
  }

  private getDataForStatus(dataSource: Order[]) {
    this.numberOfIssued = 0;
    this.numberSent = 0;
    this.numberDelivered = 0;
    dataSource.forEach(i => {
      if (i.status === 'Заказ оформлен') {
        this.numberOfIssued += 1;
      } else if (i.status === 'Заказ отправлен') {
        this.numberSent += 1;
      } else if (i.status === 'Заказ доставлен') {
        this.numberDelivered += 1;
      }
    });
    this.dataStatus.push(this.numberOfIssued, this.numberSent, this.numberDelivered);
    this.chart?.update();
  }

  ngOnInit() {
    this.orders = this.ordersService.getOrders().pipe(
      tap((data) => {
        this.getDataForSales(data);
        this.getDataForStatus(data);
      })
    );
  }

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  getOrdersByDate() {
    this.dataSales.length = 0;
    this.labelsSales.length = 0;
    this.dataStatus.length = 0;
    this.labelsStatus.length = 0;
    this.orders = this.ordersService.getOrders(this.range.value).pipe(
      tap((data) => {
        this.getDataForSales(data);
        this.getDataForStatus(data);
      })
    );
  }
}

