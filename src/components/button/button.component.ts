import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ybutton',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {

  @Input("id") public id!: string;
  @Input("type") public type: any;
  @Input("text") public text: string | undefined;
  @Input("disabled") public disabled: boolean | undefined;

  @Input("url") public url: string | undefined;
  @Input("urlTarget") public urlTarget = "_self" ;

  @Input("icon") public icon!: string;
  @Input("iconPos") public iconPos!: string;
  @Input("iconColor") public iconColor!: string;

  @Input("badge") public badge: string | undefined;
  @Input("badgeClassName") public badgeClassName: string | undefined;

  @Input() mode!: string;
  @Input() title!: string;
  @Input() ariaLabel!: string;

  @Output("onClick") public onClick: EventEmitter<any> = new EventEmitter();


  public get classes(): string {
    let modeClass = this.mode ? `y-btn-${this.mode}` : '';
    if (this.url) {
      // show the button as link button
      modeClass = modeClass + "-link";
      return [
        'y-btn',
        modeClass,
      ].filter(cl => cl.length).join(' ');
    }
    else if (this.disabled) {
      // show button in disable mode
      modeClass = modeClass + "-disabled";
      return [
        'y-btn',
        modeClass,
      ].filter(cl => cl.length).join(' ');
    }
    else {
      // show simple text button
      return [
        'y-btn',
        modeClass,
      ].filter(cl => cl.length).join(' ');
    }
  }

  public buttonClicked(): any {
    if (this.url) {
      window.open(this.url, this.urlTarget);
    } else {
      this.onClick.emit(true);
    }
  }

}
