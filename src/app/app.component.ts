import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx-js-style';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '@angular/common';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx'; import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DataModel, DataModelRaw, ExportDataModel, WaterDataModel } from './models/DataModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  db: AngularFireDatabase;
  constructor(db: AngularFireDatabase) {
    this.db = db;
  }




  async GetFirebaseData(type: string, limit: number) {

    var dataList = await new Promise<any>(resolve => {
      this.db.list<DataModel>('/' + type, ref => ref.limitToLast(limit)).valueChanges().subscribe(s => {
        var _data = [];
        s.forEach(f => _data.push(new DataModelRaw(f, type)));
        resolve(_data);
      });
    });

    var _exxportDataModel = new ExportDataModel();
    _exxportDataModel.Type = type;
    _exxportDataModel.Data = dataList;

    //console.log("_exxportDataModel", _exxportDataModel)
    return _exxportDataModel;
  }

  async ExportData() {

    var limit = 1000000;
    var waterDataModel = [];
    var o2Data = await this.GetFirebaseData('O2', limit);
    var phData = await this.GetFirebaseData('PH', limit);
    var orpData = await this.GetFirebaseData('ORP', limit);
    var tdsData = await this.GetFirebaseData('TDS', limit);
    var waterLevelData = await this.GetFirebaseData('WaterLevel', limit);


    const groupBy = (array, key) => {
      return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
          currentValue
        );
        return result;
      }, {});
    };

    var _dateModelList: DataModelRaw[] = [].concat(o2Data.Data, phData.Data, orpData.Data, tdsData.Data, waterLevelData.Data);

    var _d = groupBy(_dateModelList, 'Timestamp');
    var _keys: string[] = [];
    for (var _key of Object.keys(_d))
      _keys.push(_key)
    _keys.sort();

    for (var i = (_keys.length - 1); i >= 0; i--) {
      var _dataModel = _d[_keys[i]];

      var startData = _dataModel[0].DateTime;
      var _data = new WaterDataModel();
      _data.Date = formatDate(startData, 'dd/MM/yyyy', 'en');
      _data.Time = formatDate(startData, 'HH:mm:ss', 'en');

      var _o2DataTime = _dataModel.find(d => d.Name == 'O2');
      var _phDataTime = _dataModel.find(d => d.Name == 'PH');
      var _orpDataTime = _dataModel.find(d => d.Name == 'ORP');
      var _tdsDataTime = _dataModel.find(d => d.Name == 'TDS');
      var _waterLevelDataTime = _dataModel.find(d => d.Name == 'WaterLevel');

      _data.o2Data = _o2DataTime != undefined ? _o2DataTime.Value.toFixed(2) : " ";
      _data.phData = _phDataTime != undefined ? _phDataTime.Value.toFixed(2) : " ";
      _data.orpData = _orpDataTime != undefined ? _orpDataTime.Value.toFixed(2) : " ";
      _data.tdsData = _tdsDataTime != undefined ? _tdsDataTime.Value.toFixed(2) : " ";
      _data.waterLevelData = _waterLevelDataTime != undefined ? _waterLevelDataTime.Value.toFixed(2) : " ";

      waterDataModel.push(_data);
    }

    /*
      var lengthData = [o2Data.Data.length, phData.Data.length, orpData.Data.length, tdsData.Data.length, waterLevelData.Data.length];
      var minTimeLength = [o2Data.Data[0].DateTime, phData.Data[0].DateTime, orpData.Data[0].DateTime, tdsData.Data[0].DateTime, waterLevelData.Data[0].DateTime];
      var minTime = Math.min.apply(Math, minTimeLength);
      var maxlength = Math.max.apply(Math, lengthData);
      var startData = new Date(minTime);

      for (var i = 0; i < maxlength; i++) {
        var _data = new WaterDataModel();

        var _time = formatDate(startData, 'dd/MM/yyyy HH', 'en');
        _data.Date = formatDate(startData, 'dd/MM/yyyy', 'en');
        _data.Time = formatDate(startData, 'HH:mm', 'en');


        var _o2DataTime = o2Data.Data.find(d => (formatDate(d.DateTime, 'dd/MM/yyyy HH', 'en') == _time));
        var _phDataTime = phData.Data.find(d => (formatDate(d.DateTime, 'dd/MM/yyyy HH', 'en') == _time));
        var _orpDataTime = orpData.Data.find(d => (formatDate(d.DateTime, 'dd/MM/yyyy HH', 'en') == _time));
        var _tdsDataTime = tdsData.Data.find(d => (formatDate(d.DateTime, 'dd/MM/yyyy HH', 'en') == _time));
        var _waterLevelDataTime = waterLevelData.Data.find(d => (formatDate(d.DateTime, 'dd/MM/yyyy HH', 'en') == _time));

        _data.o2Data = _o2DataTime != undefined ? _o2DataTime.Value.toFixed(2) : " ";
        _data.phData = _phDataTime != undefined ? _phDataTime.Value.toFixed(2) : " ";
        _data.orpData = _orpDataTime != undefined ? _orpDataTime.Value.toFixed(2) : " ";
        _data.tdsData = _tdsDataTime != undefined ? _tdsDataTime.Value.toFixed(2) : " ";
        _data.waterLevelData = _waterLevelDataTime != undefined ? _waterLevelDataTime.Value.toFixed(2) : " ";

        waterDataModel.push(_data);

        startData.setTime(startData.getTime() + (1 * 60 * 60 * 1000));
      }
  */
    return waterDataModel;
  }


  getColor(type, value) {
    var green = "36B560";
    var orange = "FD8E50";
    var red = "FD695C";
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

    return "FFFFFF";

  }



  RemoveData() {
    const itemRefO2 = this.db.list('O2').remove()
    const itemRefPH = this.db.list('PH').remove()
    const itemReforp = this.db.list('ORP').remove()
    const itemReftds = this.db.list('TDS').remove()
    const itemRefww = this.db.list('WaterLevel').remove()
  }

  addData() {

    var now = new Date();
    var time = now.getTime();

    var o2 = Math.random() * (2 - 1) + 1;
    const itemRefO2 = this.db.list('O2');
    itemRefO2.push({ raw: o2, timestamp: time, value: o2 });

    var ph = Math.random() * (14 - 4) + 4;
    const itemRefPH = this.db.list('PH');
    itemRefPH.push({ raw: ph, timestamp: time, value: ph });

    var orp = Math.random() * (700 - 400) + 400;
    const itemReforp = this.db.list('ORP');
    itemReforp.push({ raw: orp, timestamp: time, value: orp });

    var tds = Math.random() * (1 - 0) + 0;
    const itemReftds = this.db.list('TDS');
    itemReftds.push({ raw: tds, timestamp: time, value: tds });

    var water = Math.random() * (10 - 3) + 3;
    const itemRefww = this.db.list('WaterLevel');
    itemRefww.push({ raw: water, timestamp: time, value: water });
  }

  typeDataO2 = 'O2'
  typeDataPh = 'PH'
  typeDataORP = 'ORP'
  typeDataWaterLevel = 'WaterLevel'
  typeDataTDS = 'TDS'

  title = 'ระบบตรวจวัดคุณภาพบ่อบำบัดน้ำเสีย';
  head = [['วัน/เดือน/ปี', ' เวลา ', 'ค่าความเป็นกรด-ด่าง', 'ค่าปริมาณออกซิเจน', 'ค่าปริมาณตะกอน', 'ค่าปริมาณคลอรีน', 'ปริมาณระดับน้ำ']]
  data: any = [];
  dataPdf = []

  async downloadExcel() {

    let header = [{
      A: "วัน/เดือน/ปี",
      B: "เวลา",
      C: "ค่าความเป็นกรด-ด่าง",
      D: "ค่าปริมาณออกซิเจน",
      E: "ค่าปริมาณตะกอน",
      F: "ค่าปริมาณคลอรีน",
      G: "ปริมาณระดับน้ำ"
    }];

    this.data = [];
    var _data = await this.ExportData();
    _data.forEach(_d => {
      this.data.push({ A: _d.Date, B: _d.Time, C: _d.phData, D: _d.o2Data, E: _d.tdsData, F: _d.orpData, G: _d.waterLevelData });
    });


    this.exportAsExcelFile(this.data, header, 'สรุปผลการตรวจวัดคุณภาพน้ำเสีย');
  }

  exportAsExcelFile(json: any[], headerText: any[], excelFileName: string): void {

    var worksheet = XLSX.utils.json_to_sheet(headerText, { header: [], skipHeader: true });

    XLSX.utils.sheet_add_json(worksheet, json, { skipHeader: true, origin: "A2" });
    for (var _d in worksheet) {
      if (worksheet[_d].v != null) {
        if (_d.length == 2 && _d.substring(2, _d.length - 1) == "1") continue;
        var type = ""
        if (_d[0] == "C") type = "PH";
        else if (_d[0] == "D") type = "O2";
        else if (_d[0] == "E") type = "TDS";
        else if (_d[0] == "F") type = "ORP";
        else continue;
        var color = this.getColor(type, worksheet[_d].v);

        worksheet[_d].s = {
          fill: {
            patternType: "solid",
            fgColor: { rgb: color }
          }
        }
      }
    }

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  async createPdf() {
    this.dataPdf = []

    var _data = await this.ExportData();
    _data.forEach(_d => {
      this.dataPdf.push([_d.Date, _d.Time, _d.phData, _d.o2Data, _d.tdsData, _d.orpData, _d.waterLevelData]);
    });

    var doc = new jsPDF();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.addFont("/assets/fonts/THSarabunNew/THSarabunNew.ttf", "THSarabunNew", "normal");
    doc.addFont("/assets/fonts/THSarabunNew/THSarabunNew Bold.ttf", "THSarabunNew", "bold");
    doc.setFont("THSarabunNew", "bold");
    doc.text('สรุปผลการตรวจวัดคุณภาพน้ำเสีย', pageWidth / 2, 8, { align: 'center' });
    doc.setFont("THSarabunNew", "normal");
    doc.setDrawColor(0);
    doc.setFillColor(54, 181, 96);
    doc.rect(15, 14, 5, 5, 'F');
    doc.text('ค่ามาตรฐาน', 23, 18, { align: 'left' });

    doc.setDrawColor(0);
    doc.setFillColor(253, 142, 80);
    doc.rect(pageWidth / 2 - 15, 14, 5, 5, 'F');
    doc.text('ค่ากึ่งกลาง', pageWidth / 2, 18, { align: 'center' });

    doc.setDrawColor(0);
    doc.setFillColor(253, 105, 92);
    doc.rect(pageWidth - 45, 14, 5, 5, 'F');
    doc.text('ค่าไม่ได้มาตรฐาน', pageWidth - 13, 18, { align: 'right' });


    (doc as any).autoTable({
      head: this.head,
      body: this.dataPdf,
      startY: 23,
      styles: { font: 'THSarabunNew', fontSize: 14, fillColor: '#FFFFFF', textColor: '#000000', lineColor: '#000000', lineWidth: 0.5, halign: 'center' },
      headStyles: { fontStyle: 'bold' },
      theme: 'grid',
      createdCell: function (cell, opts) {
        if (cell.section == 'body') {

          var type = ""
          if (cell.column.index == "2") type = "PH";
          else if (cell.column.index == "3") type = "O2";
          else if (cell.column.index == "4") type = "TDS";
          else if (cell.column.index == "5") type = "ORP";

          var value = cell.cell.text[0];
          var color = "FFFFFF";

          var green = "36B560";
          var orange = "FD8E50";
          var red = "FD695C";
          if (type == 'PH') {
            if (value >= 5 && value <= 9) color = green;
            else if ((value > 4.5 && value < 5) || (value > 9 && value < 10)) color = orange;
            else color = red;
          }

          if (type == 'O2') {
            if (value >= 1.2 && value <= 2) color = green;
            else if (value > 2) color = orange;
            else color = red;
          }

          if (type == 'ORP') { //ปริมาณปริมาณคลอรีนในน้ำ
            if (value >= 0.5 && value <= 1) color = green;
            else if (value >= 0.3 && value <= 0.7) color = orange;
            else color = red;
          }

          if (type == 'TDS') { //ปริมาณตะกอนในน้ำ
            if (value < 500) color = green;
            else if (value >= 500 && value <= 600) color = orange;
            else color = red;
          }

          if (type != "") {
            cell.cell.styles.fillColor = color;
          }
          console.log(cell.cell.text[0] + " col : " + cell.column.index, "Row : " + cell.row.index);
        }

      }
    })
    doc.output('dataurlnewwindow')
    doc.save('สรุปผลการตรวจวัดคุณภาพน้ำเสีย.pdf');
  }
}
