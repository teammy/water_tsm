import { formatDate } from '@angular/common';

export class DataModel {
    raw: number;
    timestamp: number;
    value: number;
}

export class DataModelRaw {
    constructor(data: DataModel, Name: string) {
        this.Raw = data.raw
        this.DateTime = new Date(data.timestamp * 1000)
        this.Value = data.value
        this.Name = Name
        this.Timestamp = formatDate(this.DateTime, 'yyyy/MM/dd HH:mm', 'en')// data.timestamp.toString()
    }
    Name: string;
    Raw: number;
    DateTime: Date;
    Value: number;
    Timestamp: string;
}

export class ExportDataModel {
    TypeName: string;
    Type: string;
    Data: DataModelRaw[];
}

export class ObjModel {
    Type: number;
    Name: string;
    Data: DataModel[];
}

export class DateTypeModel {
    constructor(name: string, unit: string, iconUrl: string, colorText: ColorTextModel[]) {
        this.Name = name;
        this.Unit = unit;
        this.IconUrl = iconUrl;
        this.ColorText = colorText;
    }
    Name: string;
    Unit: string;
    IconUrl: string;
    ColorText: ColorTextModel[];
}

export class LastDataModel {
    constructor(lastTime: string, lastValue: number, color: string) {
        this.LastTime = lastTime;
        this.LastValue = lastValue;
        this.Color = color;
    }
    LastTime: string;
    LastValue: number;
    Color: string;
}

export class ColorTextModel {
    constructor(color: string, text: string,pretext: string) {
        this.Color = color;
        this.Text = text;
        this.preText = pretext;
    }
    Color: string;
    Text: string;
    preText: string;
}

export class WaterDataModel {
    Date: string;
    Time: string;
    o2Data: string;
    phData: string;
    orpData: string;
    tdsData: string;
    waterLevelData: string;
}