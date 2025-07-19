import React, { useState, useCallback } from 'react';
import { SpreadsheetContext } from '../contexts/SpreadsheetContext';
import { CellData, SpreadsheetContextType, ChartData } from '../types/spreadsheet';
import { FormulaEngine } from '../utils/formulaEngine';
import { CSVUtils } from '../utils/csvUtils';
import { ChartUtils } from '../utils/chartUtils';

export const SpreadsheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cells, setCells] = useState<{ [key: string]: CellData }>({});
  const [selectedCell, setSelectedCell] = useState<string | null>('A1');
  const [selectedRange, setSelectedRange] = useState<string[] | null>(null);
  const [clipboard, setClipboard] = useState<{ cells: { [key: string]: CellData }; type: 'copy' | 'cut' } | null>(null);
  const [charts, setCharts] = useState<ChartData[]>([]);

  const setCellValue = useCallback((cellId: string, value: string, formula?: string) => {
    setCells(prev => {
      const newCells = {
        ...prev,
        [cellId]: {
          ...prev[cellId],
          value,
          formula
        }
      };

      // If it's a formula, evaluate it
      if (formula && formula.startsWith('=')) {
        const engine = new FormulaEngine(newCells);
        const result = engine.evaluateFormula(formula);
        newCells[cellId].value = result.toString();
      }

      return newCells;
    });
  }, []);

  const setCellStyle = useCallback((cellId: string, style: Partial<CellData['style']>) => {
    setCells(prev => ({
      ...prev,
      [cellId]: {
        ...prev[cellId],
        style: {
          ...prev[cellId]?.style,
          ...style
        }
      }
    }));
  }, []);

  const copyCells = useCallback((cellIds: string[]) => {
    const cellsToCopy: { [key: string]: CellData } = {};
    cellIds.forEach(cellId => {
      if (cells[cellId]) {
        cellsToCopy[cellId] = { ...cells[cellId] };
      }
    });
    setClipboard({ cells: cellsToCopy, type: 'copy' });
  }, [cells]);

  const cutCells = useCallback((cellIds: string[]) => {
    const cellsToCut: { [key: string]: CellData } = {};
    cellIds.forEach(cellId => {
      if (cells[cellId]) {
        cellsToCut[cellId] = { ...cells[cellId] };
      }
    });
    setClipboard({ cells: cellsToCut, type: 'cut' });
    
    // Clear the cut cells
    setCells(prev => {
      const newCells = { ...prev };
      cellIds.forEach(cellId => {
        delete newCells[cellId];
      });
      return newCells;
    });
  }, [cells]);

  const pasteCells = useCallback((targetCell: string) => {
    if (!clipboard) return;

    const targetMatch = targetCell.match(/^([A-Z]+)(\d+)$/);
    if (!targetMatch) return;

    const targetCol = targetMatch[1];
    const targetRow = parseInt(targetMatch[2]);

    // Get the first cell from clipboard to calculate offset
    const clipboardCells = Object.keys(clipboard.cells);
    if (clipboardCells.length === 0) return;

    const firstCell = clipboardCells[0];
    const firstMatch = firstCell.match(/^([A-Z]+)(\d+)$/);
    if (!firstMatch) return;

    const firstCol = firstMatch[1];
    const firstRow = parseInt(firstMatch[2]);

    // Calculate column offset
    const getColIndex = (col: string) => {
      let index = 0;
      for (let i = 0; i < col.length; i++) {
        index = index * 26 + (col.charCodeAt(i) - 64);
      }
      return index - 1;
    };

    const getColFromIndex = (index: number) => {
      let result = '';
      while (index >= 0) {
        result = String.fromCharCode(65 + (index % 26)) + result;
        index = Math.floor(index / 26) - 1;
      }
      return result;
    };

    const colOffset = getColIndex(targetCol) - getColIndex(firstCol);
    const rowOffset = targetRow - firstRow;

    setCells(prev => {
      const newCells = { ...prev };
      
      Object.entries(clipboard.cells).forEach(([cellId, cellData]) => {
        const match = cellId.match(/^([A-Z]+)(\d+)$/);
        if (!match) return;

        const col = match[1];
        const row = parseInt(match[2]);
        
        const newColIndex = getColIndex(col) + colOffset;
        const newRow = row + rowOffset;
        
        if (newColIndex >= 0 && newRow > 0) {
          const newCol = getColFromIndex(newColIndex);
          const newCellId = `${newCol}${newRow}`;
          newCells[newCellId] = { ...cellData };
        }
      });

      return newCells;
    });

    // Clear clipboard if it was a cut operation
    if (clipboard.type === 'cut') {
      setClipboard(null);
    }
  }, [clipboard]);

  const evaluateFormula = useCallback((formula: string) => {
    const engine = new FormulaEngine(cells);
    return engine.evaluateFormula(formula);
  }, [cells]);

  const applyBold = useCallback((cellIds: string[]) => {
    cellIds.forEach(cellId => {
      setCellStyle(cellId, { bold: !cells[cellId]?.style?.bold });
    });
  }, [cells, setCellStyle]);

  const applyItalic = useCallback((cellIds: string[]) => {
    cellIds.forEach(cellId => {
      setCellStyle(cellId, { italic: !cells[cellId]?.style?.italic });
    });
  }, [cells, setCellStyle]);

  const applyUnderline = useCallback((cellIds: string[]) => {
    cellIds.forEach(cellId => {
      setCellStyle(cellId, { underline: !cells[cellId]?.style?.underline });
    });
  }, [cells, setCellStyle]);

  const applyBackgroundColor = useCallback((cellIds: string[], color: string) => {
    cellIds.forEach(cellId => {
      setCellStyle(cellId, { backgroundColor: color });
    });
  }, [setCellStyle]);

  const applyTextColor = useCallback((cellIds: string[], color: string) => {
    cellIds.forEach(cellId => {
      setCellStyle(cellId, { textColor: color });
    });
  }, [setCellStyle]);

  const applyFontSize = useCallback((cellIds: string[], size: number) => {
    cellIds.forEach(cellId => {
      setCellStyle(cellId, { fontSize: size });
    });
  }, [setCellStyle]);

  // Chart operations
  const addChart = useCallback((type: ChartData['type'], dataRange: string, title?: string) => {
    const chartData = ChartUtils.extractDataFromRange(cells, dataRange);
    const newChart: ChartData = {
      id: ChartUtils.generateChartId(),
      type,
      title: title || `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      dataRange,
      position: { x: 100, y: 100 },
      size: { width: 400, height: 300 },
      data: chartData
    };
    
    setCharts(prev => [...prev, newChart]);
  }, [cells]);

  const removeChart = useCallback((chartId: string) => {
    setCharts(prev => prev.filter(chart => chart.id !== chartId));
  }, []);

  const updateChart = useCallback((chartId: string, updates: Partial<ChartData>) => {
    setCharts(prev => prev.map(chart => 
      chart.id === chartId ? { ...chart, ...updates } : chart
    ));
  }, []);

  // CSV operations
  const exportToCSV = useCallback(() => {
    const csvData = CSVUtils.exportToCSV(cells);
    CSVUtils.downloadCSV(csvData, 'spreadsheet.csv');
  }, [cells]);

  const importFromCSV = useCallback((csvData: string) => {
    const importedCells = CSVUtils.parseCSV(csvData);
    setCells(prev => ({ ...prev, ...importedCells }));
  }, []);

  const value: SpreadsheetContextType = {
    cells,
    selectedCell,
    selectedRange,
    clipboard,
    charts,
    setCellValue,
    setCellStyle,
    setSelectedCell,
    setSelectedRange,
    copyCells,
    cutCells,
    pasteCells,
    evaluateFormula,
    applyBold,
    applyItalic,
    applyUnderline,
    applyBackgroundColor,
    applyTextColor,
    applyFontSize,
    addChart,
    removeChart,
    updateChart,
    exportToCSV,
    importFromCSV
  };

  return (
    <SpreadsheetContext.Provider value={value}>
      {children}
    </SpreadsheetContext.Provider>
  );
};