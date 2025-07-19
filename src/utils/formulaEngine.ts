// Formula calculation engine for LEVERAGE SHEETS
import { CellData } from '../types/spreadsheet';

export class FormulaEngine {
  private cells: { [key: string]: CellData } = {};

  constructor(cells: { [key: string]: CellData }) {
    this.cells = cells;
  }

  // Parse cell reference (e.g., "A1" -> {col: 0, row: 0})
  private parseCellRef(ref: string): { col: number; row: number } | null {
    const match = ref.match(/^([A-Z]+)(\d+)$/);
    if (!match) return null;
    
    const colStr = match[1];
    const rowStr = match[2];
    
    let col = 0;
    for (let i = 0; i < colStr.length; i++) {
      col = col * 26 + (colStr.charCodeAt(i) - 64);
    }
    col -= 1; // Convert to 0-based
    
    const row = parseInt(rowStr) - 1; // Convert to 0-based
    
    return { col, row };
  }

  // Convert column index to letter (0 -> A, 1 -> B, etc.)
  private getColumnHeader(index: number): string {
    let result = '';
    while (index >= 0) {
      result = String.fromCharCode(65 + (index % 26)) + result;
      index = Math.floor(index / 26) - 1;
    }
    return result;
  }

  // Get cell reference from coordinates
  private getCellRef(col: number, row: number): string {
    return `${this.getColumnHeader(col)}${row + 1}`;
  }

  // Get cell value (numeric if possible, string otherwise)
  private getCellValue(ref: string): number | string {
    const cell = this.cells[ref];
    if (!cell || !cell.value) return 0;
    
    const numValue = parseFloat(cell.value);
    return isNaN(numValue) ? cell.value : numValue;
  }

  // Parse range (e.g., "A1:B3" -> array of cell references)
  private parseRange(range: string): string[] {
    const [start, end] = range.split(':');
    if (!end) return [start];
    
    const startRef = this.parseCellRef(start);
    const endRef = this.parseCellRef(end);
    
    if (!startRef || !endRef) return [];
    
    const cells: string[] = [];
    for (let row = startRef.row; row <= endRef.row; row++) {
      for (let col = startRef.col; col <= endRef.col; col++) {
        cells.push(this.getCellRef(col, row));
      }
    }
    
    return cells;
  }

  // Built-in functions
  private functions: { [key: string]: (...args: any[]) => number | string } = {
    SUM: (...args: any[]) => {
      let total = 0;
      for (const arg of args) {
        if (typeof arg === 'string' && arg.includes(':')) {
          // Range
          const cells = this.parseRange(arg);
          for (const cellRef of cells) {
            const value = this.getCellValue(cellRef);
            if (typeof value === 'number') total += value;
          }
        } else if (typeof arg === 'string') {
          // Single cell reference
          const value = this.getCellValue(arg);
          if (typeof value === 'number') total += value;
        } else if (typeof arg === 'number') {
          total += arg;
        }
      }
      return total;
    },

    AVERAGE: (...args: any[]) => {
      let total = 0;
      let count = 0;
      for (const arg of args) {
        if (typeof arg === 'string' && arg.includes(':')) {
          const cells = this.parseRange(arg);
          for (const cellRef of cells) {
            const value = this.getCellValue(cellRef);
            if (typeof value === 'number') {
              total += value;
              count++;
            }
          }
        } else if (typeof arg === 'string') {
          const value = this.getCellValue(arg);
          if (typeof value === 'number') {
            total += value;
            count++;
          }
        } else if (typeof arg === 'number') {
          total += arg;
          count++;
        }
      }
      return count > 0 ? total / count : 0;
    },

    COUNT: (...args: any[]) => {
      let count = 0;
      for (const arg of args) {
        if (typeof arg === 'string' && arg.includes(':')) {
          const cells = this.parseRange(arg);
          for (const cellRef of cells) {
            const value = this.getCellValue(cellRef);
            if (typeof value === 'number') count++;
          }
        } else if (typeof arg === 'string') {
          const value = this.getCellValue(arg);
          if (typeof value === 'number') count++;
        } else if (typeof arg === 'number') {
          count++;
        }
      }
      return count;
    },

    MAX: (...args: any[]) => {
      let max = -Infinity;
      for (const arg of args) {
        if (typeof arg === 'string' && arg.includes(':')) {
          const cells = this.parseRange(arg);
          for (const cellRef of cells) {
            const value = this.getCellValue(cellRef);
            if (typeof value === 'number') max = Math.max(max, value);
          }
        } else if (typeof arg === 'string') {
          const value = this.getCellValue(arg);
          if (typeof value === 'number') max = Math.max(max, value);
        } else if (typeof arg === 'number') {
          max = Math.max(max, arg);
        }
      }
      return max === -Infinity ? 0 : max;
    },

    MIN: (...args: any[]) => {
      let min = Infinity;
      for (const arg of args) {
        if (typeof arg === 'string' && arg.includes(':')) {
          const cells = this.parseRange(arg);
          for (const cellRef of cells) {
            const value = this.getCellValue(cellRef);
            if (typeof value === 'number') min = Math.min(min, value);
          }
        } else if (typeof arg === 'string') {
          const value = this.getCellValue(arg);
          if (typeof value === 'number') min = Math.min(min, value);
        } else if (typeof arg === 'number') {
          min = Math.min(min, arg);
        }
      }
      return min === Infinity ? 0 : min;
    },

    CONCATENATE: (...args: any[]) => {
      return args.map(arg => {
        if (typeof arg === 'string' && this.parseCellRef(arg)) {
          return this.getCellValue(arg).toString();
        }
        return arg.toString();
      }).join('');
    },

    IF: (condition: any, trueValue: any, falseValue: any) => {
      const conditionResult = typeof condition === 'number' ? condition !== 0 : Boolean(condition);
      return conditionResult ? trueValue : falseValue;
    }
  };

  // Evaluate a formula
  evaluateFormula(formula: string): string | number {
    try {
      // Remove leading =
      if (formula.startsWith('=')) {
        formula = formula.substring(1);
      }

      // Replace cell references with values
      formula = formula.replace(/[A-Z]+\d+/g, (match) => {
        const value = this.getCellValue(match);
        return typeof value === 'number' ? value.toString() : `"${value}"`;
      });

      // Replace function calls
      formula = formula.replace(/([A-Z]+)\(([^)]*)\)/g, (match, funcName, args) => {
        const func = this.functions[funcName];
        if (!func) return match;

        // Parse arguments
        const argList = args.split(',').map((arg: string) => {
          arg = arg.trim();
          if (arg.startsWith('"') && arg.endsWith('"')) {
            return arg.slice(1, -1); // String literal
          }
          if (arg.includes(':')) {
            return arg; // Range
          }
          if (this.parseCellRef(arg)) {
            return arg; // Cell reference
          }
          const num = parseFloat(arg);
          return isNaN(num) ? arg : num;
        });

        const result = func(...argList);
        return typeof result === 'number' ? result.toString() : `"${result}"`;
      });

      // Evaluate mathematical expressions
      const result = Function(`"use strict"; return (${formula})`)();
      return result;
    } catch (error) {
      return '#ERROR!';
    }
  }
}