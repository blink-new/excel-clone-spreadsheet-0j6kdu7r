import React from 'react';
import { Minus, Square, X } from 'lucide-react';

const TitleBar: React.FC = () => {
  return (
    <div className="h-8 bg-excel-green flex items-center justify-between px-2 text-white text-sm select-none">
      {/* Left side - Excel icon and title */}
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
          <span className="text-excel-green text-xs font-bold">X</span>
        </div>
        <span className="font-normal">Microsoft Excel</span>
      </div>
      
      {/* Center - Document name */}
      <div className="flex-1 text-center">
        <span>Book1 - Excel</span>
      </div>
      
      {/* Right side - Window controls */}
      <div className="flex items-center">
        <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors">
          <Minus className="w-3 h-3" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors">
          <Square className="w-3 h-3" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors">
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;