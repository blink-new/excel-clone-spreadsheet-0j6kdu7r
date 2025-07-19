import React, { useState, useEffect } from 'react';
import { useSpreadsheet } from '../hooks/useSpreadsheet';

const EnhancedFormulaBar: React.FC = () => {
  const { selectedCell, cells, setCellValue } = useSpreadsheet();
  const [formulaValue, setFormulaValue] = useState('');
  
  useEffect(() => {
    if (selectedCell) {
      const cellData = cells[selectedCell];
      setFormulaValue(cellData?.formula || cellData?.value || '');
    }
  }, [selectedCell, cells]);

  const handleFormulaSubmit = () => {
    if (selectedCell && formulaValue !== undefined) {
      const isFormula = formulaValue.startsWith('=');
      setCellValue(selectedCell, formulaValue, isFormula ? formulaValue : undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFormulaSubmit();
    }
  };

  return (
    <div className="h-6 bg-white border-b border-excel-gray-300 flex items-center px-2 space-x-2">
      {/* Name Box */}
      <div className="w-20 h-5 border border-excel-gray-300 flex items-center justify-center text-xs bg-white">
        {selectedCell || 'A1'}
      </div>
      
      {/* Formula Input */}
      <div className="flex-1 h-5 border border-excel-gray-300 flex items-center">
        <input
          type="text"
          value={formulaValue}
          onChange={(e) => setFormulaValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleFormulaSubmit}
          className="w-full h-full px-2 text-xs border-none outline-none"
          placeholder="Enter formula or value..."
        />
      </div>
      
      {/* Function Button */}
      <button className="w-6 h-5 bg-excel-gray-100 border border-excel-gray-300 flex items-center justify-center text-xs hover:bg-excel-gray-200">
        fx
      </button>
    </div>
  );
};

export default EnhancedFormulaBar;