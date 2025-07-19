export interface CellData {
  value: string;
  formula?: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    backgroundColor?: string;
    textColor?: string;
    fontSize?: number;
    fontFamily?: string;
  };
}

export interface ChartData {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  dataRange: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  data: Array<{ name: string; value: number }>;
}

export interface SpreadsheetContextType {
  cells: { [key: string]: CellData };
  selectedCell: string | null;
  selectedRange: string[] | null;
  clipboard: { cells: { [key: string]: CellData }; type: 'copy' | 'cut' } | null;
  charts: ChartData[];
  
  // Cell operations
  setCellValue: (cellId: string, value: string, formula?: string) => void;
  setCellStyle: (cellId: string, style: Partial<CellData['style']>) => void;
  setSelectedCell: (cellId: string | null) => void;
  setSelectedRange: (range: string[] | null) => void;
  
  // Clipboard operations
  copyCells: (cellIds: string[]) => void;
  cutCells: (cellIds: string[]) => void;
  pasteCells: (targetCell: string) => void;
  
  // Formula evaluation
  evaluateFormula: (formula: string) => string | number;
  
  // Formatting operations
  applyBold: (cellIds: string[]) => void;
  applyItalic: (cellIds: string[]) => void;
  applyUnderline: (cellIds: string[]) => void;
  applyBackgroundColor: (cellIds: string[], color: string) => void;
  applyTextColor: (cellIds: string[], color: string) => void;
  applyFontSize: (cellIds: string[], size: number) => void;
  
  // Chart operations
  addChart: (type: ChartData['type'], dataRange: string) => void;
  removeChart: (chartId: string) => void;
  updateChart: (chartId: string, updates: Partial<ChartData>) => void;
  
  // Import/Export operations
  exportToCSV: () => void;
  importFromCSV: (csvData: string) => void;
}