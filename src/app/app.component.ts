import { Component, OnInit } from '@angular/core';
import jsonData from '../assets/json/data.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'tree-structure';
  public data: [] = jsonData;
  formattedData: any[] = [];

  columns = [
    { label: 'Index', value: 'index', selected: false },
    { label: 'Age', value: 'age', selected: false },
    { label: 'Balance', value: 'balance', selected: false },
    { label: 'Company', value: 'company', selected: false },
    { label: 'Eye Color', value: 'eyeColor', selected: false },
    { label: 'Favorite Fruit', value: 'favoriteFruit', selected: false },
    { label: 'Gender', value: 'gender', selected: false },
    { label: 'Active', value: 'isActive', selected: false },
    { label: 'Name', value: 'name', selected: false },
    { label: 'Registered', value: 'registered', selected: false },
  ];

  groupBy: any[] = [];
  groupLevel = 0;

  constructor() { }

  ngOnInit(): void {
    this.formattedData = JSON.parse(JSON.stringify(this.data));
    console.log(this.data);
  }

  addToGroup(col: any) {
    let existIdx = this.groupBy.findIndex(grp => {
      return grp['value'] == col['value'];
    });

    if (existIdx === -1 && !col.selected) {
      col.selected = true;
      this.groupBy.push(col);
    } else {
      col.selected = false;
      this.groupBy.splice(existIdx, 1);
    }
  }

  formatByGroup() {
    this.formattedData = [];

    if (this.groupBy && this.groupBy.length > 0) {
      let finalData: { label: string, value: string, data: any[] }[] = [];

      this.data.forEach(dt => {
        let existIdx = finalData.findIndex(fData => {
          return dt[this.groupBy[0]['value']] === fData['value'];
        });

        if (existIdx === -1) {
          let pushObj: { label: string, value: string, childExist: boolean, data: any[] } = {
            label: this.groupBy[0]['label'],
            value: dt[this.groupBy[0]['value']],
            childExist: false,
            data: []
          };

          this.checkAndAddChild(dt, 1, pushObj);

          finalData.push(pushObj)
        } else {
          this.checkAndUpdateChild(dt, 1, finalData[existIdx]['data']);
        }
      });
      this.groupLevel = this.groupLevel + 1;

      this.formattedData = finalData;

      console.log(finalData);
    } else {
      this.groupLevel = 0;
      this.formattedData = JSON.parse(JSON.stringify(this.data));
    }
  }

  checkAndAddChild(data: any, groupIdx: number, parentObj: any) {
    if ((this.groupBy.length - 1) >= groupIdx) {
      parentObj['childExist'] = true;
      let returnObj: { label: string, value: string, childExist: boolean, data: any[] } = {
        label: this.groupBy[groupIdx]['label'],
        value: data[this.groupBy[groupIdx]['value']],
        childExist: false,
        data: []
      };

      this.checkAndAddChild(data, groupIdx + 1, returnObj);

      parentObj.data.push(returnObj);
    } else {
      parentObj.data.push(data);
    }
  }

  checkAndUpdateChild(data: any, groupIdx: number, parentObj: any[]) {
    if ((this.groupBy.length - 1) >= groupIdx) {
      let existIdx = parentObj.findIndex(pObj => {
        return pObj['value'] === data[this.groupBy[groupIdx]['value']];
      });

      if (existIdx === -1) {
        let returnObj: { label: string, value: string, childExist: boolean, data: any[] } = {
          label: this.groupBy[groupIdx]['label'],
          value: data[this.groupBy[groupIdx]['value']],
          childExist: false,
          data: []
        };

        this.checkAndAddChild(data, groupIdx + 1, returnObj);

        parentObj.push(returnObj);
      } else {
        this.checkAndUpdateChild(data, groupIdx + 1, parentObj[existIdx]['data']);
      }
    } else {
      parentObj.push(data);
    }
  }
}
