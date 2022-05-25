import { ButtonComponent } from './button.component'

describe('ButtonComponent', () => {
  let fixture: ButtonComponent;

  beforeEach(() => {
    fixture = new ButtonComponent();
  })

  it(`get the basic button style class`, () => {
    fixture.mode = "primary";
    fixture.disabled = false;
    expect(fixture.classes).toEqual('y-btn y-btn-primary');
  })

  it(`get the disabled button style class`, () => {
    fixture.mode = "primary";
    fixture.disabled = true;
    expect(fixture.classes).toEqual('y-btn y-btn-primary-disabled');
  })

  it(`get the link button style class`, () => {
    fixture.mode = "primary";
    fixture.url = "https://www.angularjswiki.com";
    fixture.urlTarget="urlTarget";
    expect(fixture.classes).toEqual('y-btn y-btn-primary-link');
  })

  it(`should have clicked button`,()=>{
    //TODO: window.open not implemented in jest
    fixture.url="www.google.com"
    fixture.buttonClicked();
  })
})
