import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { sha256 } from 'js-sha256';

type AOA = any[][];

@Component({
  selector: 'app-sheet-rw-main',
  templateUrl: './sheet-rw-main.component.html',
  styleUrls: ['./sheet-rw-main.component.scss']
})
export class SheetRwMainComponent implements OnInit {

  constructor() { }

  flProdRegexes: RegExp[] = [new RegExp('^[0-9a-z]{16}-listing-ui-gro'), new RegExp('^[0-9]{13}_default')];

  ngOnInit() {
  }

  probableFile(sheetNames: string[]): string {
    switch (sheetNames.length) {
      case 2: 

      return 'FL-PROD';
      case 7: return 'FL-ORDER';
    }
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);

    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }

    const reader: FileReader = new FileReader();

    reader.onload = this.readerOnLoad;
    reader.readAsBinaryString(target.files[0]);
  }

  readerOnLoad(e : any) {
    const bstr: string = e.target.result;
    const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});


    const wsname: string = wb.SheetNames[0];
    console.log(this.probableFile(wb.SheetNames));
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    const data: AOA = <AOA>(XLSX.utils.sheet_to_json(ws));
    console.log(data);
  }

}
