import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const SheetTabs: React.FC = () => {
  const [activeSheet, setActiveSheet] = useState('Sheet1');
  const [sheets, setSheets] = useState(['Sheet1', 'Sheet2', 'Sheet3']);
  
  const addNewSheet = () => {
    const newSheetName = `Sheet${sheets.length + 1}`;
    setSheets([...sheets, newSheetName]);
    setActiveSheet(newSheetName);
  };
  
  return (
    <div className="h-6 bg-excel-gray-100 border-t border-excel-gray-300 flex items-center">
      {/* Navigation arrows */}
      <div className="flex items-center border-r border-excel-gray-300 px-1">
        <button className="w-4 h-4 flex items-center justify-center hover:bg-excel-gray-200 rounded">
          <ChevronLeft className="w-3 h-3 text-excel-gray-600" />
        </button>
        <button className="w-4 h-4 flex items-center justify-center hover:bg-excel-gray-200 rounded">
          <ChevronRight className="w-3 h-3 text-excel-gray-600" />
        </button>
      </div>
      
      {/* Sheet tabs */}
      <div className="flex items-center flex-1">
        {sheets.map((sheet) => (
          <button
            key={sheet}
            onClick={() => setActiveSheet(sheet)}
            className={`px-3 py-1 text-xs border-r border-excel-gray-300 transition-colors ${
              activeSheet === sheet
                ? 'bg-white text-excel-gray-900 font-medium'
                : 'text-excel-gray-700 hover:bg-excel-gray-200'
            }`}
          >
            {sheet}
          </button>
        ))}
        
        {/* Add sheet button */}
        <button
          onClick={addNewSheet}
          className="w-6 h-4 flex items-center justify-center hover:bg-excel-gray-200 rounded ml-1"
        >
          <Plus className="w-3 h-3 text-excel-gray-600" />
        </button>
      </div>
      
      {/* Horizontal scrollbar area */}
      <div className="flex-1 min-w-0">
        {/* This would contain the horizontal scrollbar for the grid */}
      </div>
    </div>
  );
};

export default SheetTabs;