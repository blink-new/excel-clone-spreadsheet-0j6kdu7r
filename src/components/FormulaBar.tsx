import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

const FormulaBar: React.FC = () => {
  const [selectedCell, setSelectedCell] = useState('A1');
  const [formula, setFormula] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="h-8 bg-white border-b border-excel-gray-300 flex items-center">
      {/* Name Box */}
      <div className="w-20 h-full border-r border-excel-gray-300 flex items-center">
        <input
          type="text"
          value={selectedCell}
          onChange={(e) => setSelectedCell(e.target.value)}
          className="w-full h-full px-2 text-xs text-center border-none outline-none focus:bg-excel-blue/10"
        />
      </div>
      
      {/* Formula Controls */}
      <div className="flex items-center h-full">
        <button className="w-6 h-6 mx-1 flex items-center justify-center hover:bg-excel-gray-100 rounded">
          <Check className="w-3 h-3 text-excel-green" />
        </button>
        <button className="w-6 h-6 mx-1 flex items-center justify-center hover:bg-excel-gray-100 rounded">
          <X className="w-3 h-3 text-red-600" />
        </button>
        <div className="w-px h-5 bg-excel-gray-300 mx-1" />
      </div>
      
      {/* Formula Input */}
      <div className="flex-1 h-full">
        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          placeholder="Enter formula or value..."
          className="w-full h-full px-2 text-xs border-none outline-none focus:bg-excel-blue/5"
        />
      </div>
    </div>
  );
};

export default FormulaBar;