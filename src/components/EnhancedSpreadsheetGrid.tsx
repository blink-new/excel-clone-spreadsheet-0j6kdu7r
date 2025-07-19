import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSpreadsheet } from '../hooks/useSpreadsheet';
import Chart from './Chart';

const EnhancedSpreadsheetGrid: React.FC = () => {
  const {
    cells,
    selectedCell,
    setSelectedCell,
    setCellValue,
    pasteCells,
    charts,
    removeChart,
    updateChart
  } = useSpreadsheet();
  
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Generate column headers (A, B, C, ..., Z, AA, AB, ...)
  const getColumnHeader = (index: number): string => {
    let result = '';
    while (index >= 0) {
      result = String.fromCharCode(65 + (index % 26)) + result;
      index = Math.floor(index / 26) - 1;
    }
    return result;
  };
  
  // Generate grid data
  const rows = 50;
  const cols = 26;
  
  const handleCellClick = (cellId: string) => {
    setSelectedCell(cellId);
    setEditingCell(null);
  };
  
  const handleCellDoubleClick = useCallback((cellId: string) => {
    setEditingCell(cellId);
    const cellData = cells[cellId];
    setEditValue(cellData?.formula || cellData?.value || '');
  }, [cells]);
  
  const handleCellEdit = useCallback((cellId: string, value: string) => {
    const isFormula = value.startsWith('=');
    setCellValue(cellId, value, isFormula ? value : undefined);
    setEditingCell(null);
  }, [setCellValue]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent, cellId: string) => {
    if (e.key === 'Enter') {
      handleCellEdit(cellId, editValue);
      // Move to next row
      const match = cellId.match(/^([A-Z]+)(\d+)$/);
      if (match) {
        const col = match[1];
        const row = parseInt(match[2]);
        const nextCell = `${col}${row + 1}`;
        setSelectedCell(nextCell);
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleCellEdit(cellId, editValue);
      // Move to next column
      const match = cellId.match(/^([A-Z]+)(\d+)$/);
      if (match) {
        const colIndex = match[1].charCodeAt(0) - 65;
        const row = match[2];
        const nextCol = getColumnHeader(colIndex + 1);
        const nextCell = `${nextCol}${row}`;
        setSelectedCell(nextCell);
      }
    }
  }, [editValue, setSelectedCell, handleCellEdit]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      // Ctrl+V for paste
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        pasteCells(selectedCell);
      }
      
      // Arrow key navigation
      if (!editingCell) {
        const match = selectedCell.match(/^([A-Z]+)(\d+)$/);
        if (!match) return;

        const col = match[1];
        const row = parseInt(match[2]);
        const colIndex = col.charCodeAt(0) - 65;

        let newCell = selectedCell;
        
        switch (e.key) {
          case 'ArrowUp':
            if (row > 1) newCell = `${col}${row - 1}`;
            break;
          case 'ArrowDown':
            if (row < rows) newCell = `${col}${row + 1}`;
            break;
          case 'ArrowLeft':
            if (colIndex > 0) newCell = `${getColumnHeader(colIndex - 1)}${row}`;
            break;
          case 'ArrowRight':
            if (colIndex < cols - 1) newCell = `${getColumnHeader(colIndex + 1)}${row}`;
            break;
          case 'Enter':
            if (row < rows) newCell = `${col}${row + 1}`;
            break;
          case 'Tab':
            e.preventDefault();
            if (colIndex < cols - 1) newCell = `${getColumnHeader(colIndex + 1)}${row}`;
            break;
          case 'F2':
            e.preventDefault();
            handleCellDoubleClick(selectedCell);
            return;
        }
        
        if (newCell !== selectedCell) {
          e.preventDefault();
          setSelectedCell(newCell);
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [selectedCell, editingCell, pasteCells, setSelectedCell, handleCellDoubleClick]);
  
  return (
    <div className="flex h-full bg-white relative">
      {/* Charts Layer */}
      {charts.map((chart) => (
        <Chart
          key={chart.id}
          chart={chart}
          onRemove={removeChart}
          onUpdate={updateChart}
        />
      ))}
      
      {/* Row Headers */}
      <div className="w-12 bg-excel-gray-100 border-r border-excel-gray-300 flex-shrink-0">
        {/* Corner cell */}
        <div className="h-6 border-b border-excel-gray-300 bg-excel-gray-200"></div>
        
        {/* Row numbers */}
        {Array.from({ length: rows }, (_, i) => (
          <div
            key={i}
            className="h-5 border-b border-excel-gray-300 flex items-center justify-center text-xs text-excel-gray-700 bg-excel-gray-100 hover:bg-excel-gray-200 cursor-pointer"
          >
            {i + 1}
          </div>
        ))}
      </div>
      
      {/* Main Grid Area */}
      <div className="flex-1 overflow-auto" ref={gridRef}>
        <div className="min-w-max">
          {/* Column Headers */}
          <div className="flex h-6 bg-excel-gray-100 border-b border-excel-gray-300 sticky top-0 z-10">
            {Array.from({ length: cols }, (_, i) => (
              <div
                key={i}
                className="w-20 border-r border-excel-gray-300 flex items-center justify-center text-xs text-excel-gray-700 bg-excel-gray-100 hover:bg-excel-gray-200 cursor-pointer"
              >
                {getColumnHeader(i)}
              </div>
            ))}
          </div>
          
          {/* Grid Cells */}
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="flex">
              {Array.from({ length: cols }, (_, colIndex) => {
                const cellId = `${getColumnHeader(colIndex)}${rowIndex + 1}`;
                const isSelected = selectedCell === cellId;
                const isEditing = editingCell === cellId;
                const cellData = cells[cellId];
                
                // Apply cell styling
                const cellStyle: React.CSSProperties = {
                  fontWeight: cellData?.style?.bold ? 'bold' : 'normal',
                  fontStyle: cellData?.style?.italic ? 'italic' : 'normal',
                  textDecoration: cellData?.style?.underline ? 'underline' : 'none',
                  backgroundColor: cellData?.style?.backgroundColor || 'transparent',
                  color: cellData?.style?.textColor || '#1f2937',
                  fontSize: cellData?.style?.fontSize ? `${cellData.style.fontSize}px` : '12px'
                };
                
                return (
                  <div
                    key={cellId}
                    className={`w-20 h-5 border-r border-b border-excel-gray-300 relative cursor-cell ${
                      isSelected ? 'ring-2 ring-excel-blue bg-excel-blue/10' : 'hover:bg-excel-gray-50'
                    }`}
                    onClick={() => handleCellClick(cellId)}
                    onDoubleClick={() => handleCellDoubleClick(cellId)}
                    style={!isEditing ? cellStyle : {}}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, cellId)}
                        onBlur={() => handleCellEdit(cellId, editValue)}
                        className="w-full h-full px-1 text-xs border-none outline-none bg-white"
                        autoFocus
                      />
                    ) : (
                      <div className="w-full h-full px-1 flex items-center text-xs overflow-hidden">
                        {cellData?.value || ''}
                      </div>
                    )}
                    
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-excel-blue border border-white"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSpreadsheetGrid;