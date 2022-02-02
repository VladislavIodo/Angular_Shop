import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.less']
})
export class LogoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input() logoName:string = '';
  @Input() color:string = '';
}

