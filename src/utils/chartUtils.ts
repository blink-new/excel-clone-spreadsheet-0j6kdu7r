import { CellData, ChartData } from '../types/spreadsheet';

export class ChartUtils {
  static extractDataFromRange(
    cells: { [key: string]: CellData },
    range: string
  ): Array<{ name: string; value: number }> {
    const parsedRange = this.parseRange(range);
    if (!parsedRange) return [];
    
    const { startCol, startRow, endCol, endRow } = parsedRange;
    const data: Array<{ name: string; value: number }> = [];
    
    // Determine if we have headers (first row/column contains text)
    const hasHeaders = this.detectHeaders(cells, parsedRange);
    
    if (hasHeaders.hasRowHeaders && hasHeaders.hasColHeaders) {
      // Both row and column headers - use first column as names, first row as series
      for (let row = startRow + 1; row <= endRow; row++) {
        const nameCell = `${this.numberToColumn(startCol)}${row}`;
        const name = cells[nameCell]?.value || `Row ${row}`;
        
        let totalValue = 0;
        for (let col = startCol + 1; col <= endCol; col++) {
          const cellId = `${this.numberToColumn(col)}${row}`;
          const value = parseFloat(cells[cellId]?.value || '0');
          if (!isNaN(value)) {
            totalValue += value;
          }
        }
        
        data.push({ name, value: totalValue });
      }
    } else if (hasHeaders.hasRowHeaders) {
      // Only row headers - first column is names
      for (let row = startRow; row <= endRow; row++) {
        const nameCell = `${this.numberToColumn(startCol)}${row}`;
        const name = cells[nameCell]?.value || `Row ${row}`;
        
        let totalValue = 0;
        for (let col = startCol + 1; col <= endCol; col++) {
          const cellId = `${this.numberToColumn(col)}${row}`;
          const value = parseFloat(cells[cellId]?.value || '0');
          if (!isNaN(value)) {
            totalValue += value;
          }
        }
        
        data.push({ name, value: totalValue });
      }
    } else if (hasHeaders.hasColHeaders) {
      // Only column headers - first row is names
      for (let col = startCol; col <= endCol; col++) {
        const nameCell = `${this.numberToColumn(col)}${startRow}`;
        const name = cells[nameCell]?.value || `Col ${this.numberToColumn(col)}`;
        
        let totalValue = 0;
        for (let row = startRow + 1; row <= endRow; row++) {
          const cellId = `${this.numberToColumn(col)}${row}`;
          const value = parseFloat(cells[cellId]?.value || '0');
          if (!isNaN(value)) {
            totalValue += value;
          }
        }
        
        data.push({ name, value: totalValue });
      }
    } else {
      // No headers - just use cell values
      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          const cellId = `${this.numberToColumn(col)}${row}`;
          const value = parseFloat(cells[cellId]?.value || '0');
          if (!isNaN(value) && value !== 0) {
            data.push({ 
              name: cellId, 
              value 
            });
          }
        }
      }
    }
    
    return data.filter(item => item.value !== 0);
  }
  
  private static parseRange(range: string): {
    startCol: number;
    startRow: number;
    endCol: number;
    endRow: number;
  } | null {
    // Handle ranges like "A1:C5" or single cells like "A1"
    const rangeParts = range.split(':');
    
    if (rangeParts.length === 1) {
      // Single cell
      const match = rangeParts[0].match(/^([A-Z]+)(\d+)$/);
      if (!match) return null;
      
      const col = this.columnToNumber(match[1]);
      const row = parseInt(match[2]);
      
      return {
        startCol: col,
        startRow: row,
        endCol: col,
        endRow: row
      };
    } else if (rangeParts.length === 2) {
      // Range
      const startMatch = rangeParts[0].match(/^([A-Z]+)(\d+)$/);
      const endMatch = rangeParts[1].match(/^([A-Z]+)(\d+)$/);
      
      if (!startMatch || !endMatch) return null;
      
      return {
        startCol: this.columnToNumber(startMatch[1]),
        startRow: parseInt(startMatch[2]),
        endCol: this.columnToNumber(endMatch[1]),
        endRow: parseInt(endMatch[2])
      };
    }
    
    return null;
  }
  
  private static detectHeaders(
    cells: { [key: string]: CellData },
    range: { startCol: number; startRow: number; endCol: number; endRow: number }
  ): { hasRowHeaders: boolean; hasColHeaders: boolean } {
    const { startCol, startRow, endCol, endRow } = range;
    
    // Check if first row contains mostly text (column headers)
    let textInFirstRow = 0;
    let totalInFirstRow = 0;
    for (let col = startCol; col <= endCol; col++) {
      const cellId = `${this.numberToColumn(col)}${startRow}`;
      const value = cells[cellId]?.value;
      if (value) {
        totalInFirstRow++;
        if (isNaN(parseFloat(value))) {
          textInFirstRow++;
        }
      }
    }
    
    // Check if first column contains mostly text (row headers)
    let textInFirstCol = 0;
    let totalInFirstCol = 0;
    for (let row = startRow; row <= endRow; row++) {
      const cellId = `${this.numberToColumn(startCol)}${row}`;
      const value = cells[cellId]?.value;
      if (value) {
        totalInFirstCol++;
        if (isNaN(parseFloat(value))) {
          textInFirstCol++;
        }
      }
    }
    
    return {
      hasColHeaders: totalInFirstRow > 0 && textInFirstRow / totalInFirstRow > 0.5,
      hasRowHeaders: totalInFirstCol > 0 && textInFirstCol / totalInFirstCol > 0.5
    };
  }
  
  private static columnToNumber(column: string): number {
    let result = 0;
    for (let i = 0; i < column.length; i++) {
      result = result * 26 + (column.charCodeAt(i) - 64);
    }
    return result;
  }
  
  private static numberToColumn(num: number): string {
    let result = '';
    while (num > 0) {
      num--;
      result = String.fromCharCode(65 + (num % 26)) + result;
      num = Math.floor(num / 26);
    }
    return result;
  }
  
  static generateChartId(): string {
    return `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}