import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor() {}

  exportToPDF(headers: string[], data: any[], fileName: string): void {
    const doc = new jsPDF();
    doc.text(`${fileName}`, 14, 16);
    
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 20,
    });
    
    doc.save(`${fileName}.pdf`);
  }

  async exportToExcel(
    headers: string[],
    data: any[],
    fileName: string
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.columns = headers.map((header) => ({ header, key: header }));
    data.forEach((row) => {
      const rowData: any = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      worksheet.addRow(rowData);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    this.saveAsExcelFile(buffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, `${fileName}.xlsx`);
  }
}
