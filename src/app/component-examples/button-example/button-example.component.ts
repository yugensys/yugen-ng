import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-example',
  templateUrl: './button-example.component.html',
  styleUrls: ['./button-example.component.css']
})
export class ButtonExampleComponent implements OnInit {
  title = 'title';
  constructor() { }

  ngOnInit(): void {
  }

  public buttonEvent(): void {
    this.title = "title changed";
 }
}
