import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-example',
  templateUrl: './select-example.component.html',
  styleUrls: ['./select-example.component.scss']
})
export class SelectExampleComponent implements OnInit {

  public itemValue = "2";
  public Items: OptionItem[];
  public ItemObject!: OptionItem[];
  public itemId!: string;
  public itemList!: any[];
  public city: any;
  public state: any;
  public partLocations!: any[];
  public partToLocationModel!: any[];
  public labelValue: string | undefined;
  public objectValue: any | undefined;
  
  constructor(private cd: ChangeDetectorRef) {

    this.ItemObject = [
      {
        ID: 11,
        Name: 'Value 11'
      },
      {
        ID: 12,
        Name: 'Value 12'
      },
      {
        ID: 13,
        Name: 'Value 13'
      }
    ];

    this.Items = [
      {
        ID: 1,
        Name: 'Value 1'
      },
      {
        ID: 2,
        Name: 'Value 2'
      },
      {
        ID: 3,
        Name: 'Value 3'
      }
    ];

    this.city = [
      {
        ID: 1,
        Name: 'Pune'
      },
      {
        ID: 2,
        Name: 'Nashik'
      },
      {
        ID: 3,
        Name: 'Vadodara'
      },
      {
        ID: 4,
        Name: 'Surat'
      }
    ]

    this.state = [
      {
        ID: 1,
        Name: 'Maharashtra'
      },
      {
        ID: 2,
        Name: 'Gujarat'
      },
      {
        ID: 3,
        Name: 'Karnatak'
      }
    ]

    this.getPartData();
  }

  ngOnInit(): void {

    this.itemList = [
      { label: "City", options: this.city.map((m: { ID: string; Name: any; }) => { return { ID: "City" + m.ID, Name: m.Name, city: m } }) },
      { label: "State", options: this.state.map((m: { ID: string; Name: any; }) => { return { ID: "State" + m.ID, Name: m.Name, state: m } }) },
    ];

  }

  public getPartData() {
    this.partToLocationModel = [];

    let part = {
      ID: 1,
      Name: 'Test Part 1',
      Number: 'Part Number 1',
      NumberDescription: 'Number-Description1',
      Description: 'Description1',
      LocationID: 100,
    }

    let location = {
      ID: 100,
      Name: 'Location1'
    };

    let partToLocation = {
      ID: 21,
      Name: 'Test Part 11',
      PartID: 1,
      Quantity: 5,
      Part: part,
      Location: location,
      PartToLocationID: 201
    }
    this.partToLocationModel.push(partToLocation);

    let part2 = {
      ID: 2,
      Name: 'Test Part 2',
      Number: 'Part Number 2',
      NumberDescription: 'Number-Description2',
      Description: 'Description2',
      LocationID: 101,
    }

    let location2 = {
      ID: 101,
      Name: 'Location2'
    };

    let partToLocation2 = {
      ID: 22,
      Name: 'Test Part 12',
      PartID: 2,
      Quantity: 6,
      Part: part,
      Location: location,
      PartToLocationID: 202
    }
    this.partToLocationModel.push(partToLocation2);

    this.partLocations = this.partToLocationModel;

  }

  public partFilter(search: string, partSelect: any) {
    if (!search || search.length == 0) {
      this.partLocations = [];
      this.cd.detectChanges();
      this.partLocations = this.partToLocationModel;
      return true;
    } else {
      search = search.toLowerCase();
      this.partLocations = [];
      this.cd.detectChanges();
      this.partLocations = partSelect.searchCallback(search, this.partToLocationModel, 'arrayObject');
      return false;
    }
  }

  public eventChange(event: any) {
    this.labelValue = "change event occur on value " + event;
  }

  public objectEventChange(event: any) {
    this.objectValue = "change event occur on value " + JSON.stringify(event);
  }
}

export class OptionItem {
  public ID?: any;
  public Name?: string;
}
