import { CellData } from '../types/spreadsheet';

export class CSVUtils {
  static exportToCSV(cells: { [key: string]: CellData }): string {
    // Find the maximum row and column
    let maxRow = 0;
    let maxCol = 0;
    
    const cellPositions: Array<{ row: number; col: number; cellId: string }> = [];
    
    Object.keys(cells).forEach(cellId => {
      const match = cellId.match(/^([A-Z]+)(\d+)$/);
      if (match) {
        const col = this.columnToNumber(match[1]);
        const row = parseInt(match[2]);
        maxRow = Math.max(maxRow, row);
        maxCol = Math.max(maxCol, col);
        cellPositions.push({ row, col, cellId });
      }
    });
    
    // Create a 2D array to represent the spreadsheet
    const grid: string[][] = [];
    for (let r = 0; r <= maxRow; r++) {
      grid[r] = new Array(maxCol + 1).fill('');
    }
    
    // Fill the grid with cell values
    cellPositions.forEach(({ row, col, cellId }) => {
      const cell = cells[cellId];
      if (cell && cell.value) {
        grid[row][col] = cell.value;
      }
    });
    
    // Convert grid to CSV
    const csvRows: string[] = [];
    for (let r = 1; r <= maxRow; r++) {
      const row = grid[r] || [];
      const csvRow = row.map(value => {
        // Escape quotes and wrap in quotes if necessary
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
      csvRows.push(csvRow);
    }
    
    return csvRows.join('\n');
  }
  
  static parseCSV(csvData: string): { [key: string]: CellData } {
    const lines = csvData.split('\n');
    const cells: { [key: string]: CellData } = {};
    
    lines.forEach((line, rowIndex) => {
      if (line.trim()) {
        const values = this.parseCSVLine(line);
        values.forEach((value, colIndex) => {
          if (value.trim()) {
            const cellId = `${this.numberToColumn(colIndex + 1)}${rowIndex + 1}`;
            cells[cellId] = {
              value: value.trim(),
              style: {}
            };
          }
        });
      }
    });
    
    return cells;
  }
  
  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < line.length) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }
    
    result.push(current);
    return result;
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
  
  static downloadCSV(csvData: string, filename: string = 'spreadsheet.csv'): void {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}