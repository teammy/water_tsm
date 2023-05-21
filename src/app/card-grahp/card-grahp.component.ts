import { Component, OnInit, Input } from '@angular/core';
import { DateTypeModel, LastDataModel, ColorTextModel } from '../models/DataModel';

@Component({
  selector: 'app-card-grahp',
  templateUrl: './card-grahp.component.html',
  styleUrls: ['./card-grahp.component.css']
})
export class CardGrahpComponent implements OnInit {

  constructor() { }

  @Input() typeData = '';

  phText: ColorTextModel[] = [new ColorTextModel("#36B560","pH 5.0 - 9.0","ค่ามาตราฐาน"),new ColorTextModel("#FD8E50","pH 4.5 - 5.0 หรือ pH 9.0 - 10.0","ค่ากึ่งกลาง"),new ColorTextModel("#FD695C","pH < 5.0 หรือ pH> 10.0","ค่าไม่ได้มาตราฐาน")]
  o2Text: ColorTextModel[] = [new ColorTextModel("#36B560","1.2 - 2.0 มล./ล.","ค่ามาตราฐาน"),new ColorTextModel("#FD8E50","> 2.0 มล./ล.","ค่ากึ่งกลาง"),new ColorTextModel("#FD695C","< 1.0 มล./ล.","ค่าไม่ได้มาตราฐาน")]
  TDSText: ColorTextModel[] = [new ColorTextModel("#36B560","< 500 มล./ล.","ค่ามาตราฐาน"),new ColorTextModel("#FD8E50","< 600 มล./ล. และ > 500 มล./ล.","ค่ากึ่งกลาง"),new ColorTextModel("#FD695C","> 600 มล./ล.","ค่าไม่ได้มาตราฐาน")]
  ORPText: ColorTextModel[] = [new ColorTextModel("#36B560","0.5 - 1.0 มล./ล.","ค่ามาตราฐาน"),new ColorTextModel("#FD8E50","0.3 - 0.7 มล./ล.","ค่ากึ่งกลาง"),new ColorTextModel("#FD695C","< 0.5 หรือ > 1.0 มล./ล.","ค่าไม่ได้มาตราฐาน")]
  WaterLevelText: ColorTextModel[] = []

  typeDataList: { key: string, value: DateTypeModel }[] = [
    { key: 'PH', value: new DateTypeModel("ความเป็นกรด - ด่าง", "pH", "../assets/logo/ph.png", this.phText) },
    { key: 'TDS', value: new DateTypeModel("ปริมาณตะกอนในน้ำ", "ม.ล/ล.", "../assets/logo/watering.png", this.TDSText) },
    { key: 'O2', value: new DateTypeModel("ปริมาณออกซิเจนในน้ำ", "ม.ล/ล.", "../assets/logo/o2.png", this.o2Text) },
    { key: 'ORP', value: new DateTypeModel("ปริมาณปริมาณคลอรีนในน้ำ", "ม.ล/ล.", "../assets/logo/chlorine.png",this.ORPText ) },
    { key: 'WaterLevel', value: new DateTypeModel("ปริมาณระดับน้ำ", "%", "../assets/logo/water-level.png", this.WaterLevelText) }
  ];


  color : string ;
  title: string;
  lastValue: number;
  lastTime: string;
  unit: string;
  iconUrl: string;
  colorText: ColorTextModel[];

  ngOnInit() {
    //console.log("================>", this.typeData);
    var data = this.typeDataList.find(f => f.key == this.typeData).value;
    this.title = data.Name;
    this.unit = data.Unit;
    this.iconUrl = data.IconUrl;
    this.colorText = data.ColorText;
  }


  LastDataEvent(data: LastDataModel) {
    this.lastValue = data.LastValue;
    this.lastTime = data.LastTime;
    this.color = data.Color;
  }

}
