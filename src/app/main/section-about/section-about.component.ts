import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-section-about',
  templateUrl: './section-about.component.html',
  styleUrls: ['./section-about.component.less']
})
export class SectionAboutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  title = 'О нас';
  style = 'width: 100px; height: 45px; margin: 10px 0 10px 50px;'
}
