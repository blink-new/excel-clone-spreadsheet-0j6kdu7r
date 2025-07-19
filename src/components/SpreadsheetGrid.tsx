import React, { useState, useRef, useEffect } from 'react';

interface CellData {
  value: string;
  formula?: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    backgroundColor?: string;
    textColor?: string;
  };
}

const SpreadsheetGrid: React.FC = () => {
  const [cells, setCells] = useState<{ [key: string]: CellData }>({});
  const [selectedCell, setSelectedCell] = useState<string | null>('A1');
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
  
  const handleCellDoubleClick = (cellId: string) => {
    setEditingCell(cellId);
    setEditValue(cells[cellId]?.value || '');
  };
  
  const handleCellEdit = (cellId: string, value: string) => {
    setCells(prev => ({
      ...prev,
      [cellId]: { ...prev[cellId], value }
    }));
    setEditingCell(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, cellId: string) => {
    if (e.key === 'Enter') {
      handleCellEdit(cellId, editValue);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };
  
  return (
    <div className="flex h-full bg-white">
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
                
                return (
                  <div
                    key={cellId}
                    className={`w-20 h-5 border-r border-b border-excel-gray-300 relative cursor-cell ${
                      isSelected ? 'ring-2 ring-excel-blue bg-excel-blue/10' : 'hover:bg-excel-gray-50'
                    }`}
                    onClick={() => handleCellClick(cellId)}
                    onDoubleClick={() => handleCellDoubleClick(cellId)}
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
                      <div className="w-full h-full px-1 flex items-center text-xs text-excel-gray-900 overflow-hidden">
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

export default SpreadsheetGrid;