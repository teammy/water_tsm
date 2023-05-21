import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Observable } from 'rxjs';
import { RealtimeDBService } from '../services/realtime-db.service';
import { ObjModel, DataModel, LastDataModel } from '../models/DataModel';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

export class LineChartComponent {

  phData: any[];
  phList: Observable<any>;
  itemRef: AngularFireObject<any>;
  db: AngularFireDatabase;
  constructor(db: AngularFireDatabase) {
    this.db = db;
  }

  @Input() typeData = '';
  @Output() LastDataEvent = new EventEmitter<LastDataModel>();

  lastValue: number;
  lastTime: string;

  ngOnInit() {

    //console.log("------------>>>>", this.typeData);
    var dataPh = [];
    var dataPhLabel = [];
    var dataColor = "";

    var limitData = 35;
    this.db.list<DataModel>(this.typeData, ref => ref.limitToLast(limitData)).valueChanges().subscribe(res => {
      res.forEach(item => {
        var dateObject = new Date(item.timestamp * 1000);
        this.lastValue = Number(item.value.toFixed(2));
        this.lastTime = formatDate(dateObject, 'dd/MM/yyyy HH:mm:ss', 'en');

        dataColor = this.CalColor(this.typeData, this.lastValue);
        this.LastDataEvent.emit(new LastDataModel(this.lastTime, this.lastValue, dataColor));

        this.lineChartColors = [
          {
            borderColor: dataColor,
            pointBackgroundColor: dataColor,
            backgroundColor: '#FFFFFF',
          },
        ];
        dataPh.push(item.value);
        var _time = formatDate(dateObject, 'HH:mm', 'en');
        dataPhLabel.push(_time);
        if (dataPh.length >= limitData) dataPh.shift();
        if (dataPhLabel.length >= limitData) dataPhLabel.shift();
      });
    });

    console.log(dataPhLabel);

    this.lineChartData = [
      { data: dataPh, fill: false },
    ];
    this.lineChartLabels = dataPhLabel;

  }


  CalColor(type: string, value: number): string {

    var green = "#36B560";
    var orange = "#FD8E50";
    var red = "#FD695C";
    if (type == 'PH') {
      if (value >= 5 && value <= 9) return green;
      else if ((value > 4.5 && value < 5) || (value > 9 && value < 10)) return orange;
      else return red;
    }

    if (type == 'O2') {
      if (value >= 1.2 && value <= 2) return green;
      else if (value > 2) return orange;
      else return red;
    }

    if (type == 'ORP') { //ปริมาณปริมาณคลอรีนในน้ำ
      if (value >= 0.5 && value <= 1) return green;
      else if (value >= 0.3 && value <= 0.7) return orange;
      else return red;
    }

    if (type == 'TDS') { //ปริมาณตะกอนในน้ำ
      if (value < 500) return green;
      else if (value >= 500 && value <= 600) return orange;
      else return red;
    }


    return "#36B560";
  }

  lineChartData: ChartDataSets[];

  lineChartLabels: Label[];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[];

  lineChartLegend = false;
  lineChartPlugins = [];
  lineChartType = 'line';

}