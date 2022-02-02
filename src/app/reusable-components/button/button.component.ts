import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.less']
})
export class ButtonComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  @Input() title: string = '';
  @Input() type: "mainButton" | "deleteButton" = "mainButton";
  @Input() disabled: boolean = false;
}
