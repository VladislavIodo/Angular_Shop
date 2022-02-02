import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.less']
})
export class DeleteProductComponent implements OnInit {

  public deleteButton = {
    yes: "Да!",
    no: "Нет"
  }

  constructor() { }

  ngOnInit(): void {
  }

}
