import React from 'react';
import { Save, Undo, Redo, ChevronDown } from 'lucide-react';

const QuickAccessToolbar: React.FC = () => {
  return (
    <div className="h-6 bg-excel-gray-100 border-b border-excel-gray-300 flex items-center px-2 space-x-1">
      {/* Quick Access Icons */}
      <button className="w-5 h-5 flex items-center justify-center hover:bg-excel-gray-200 rounded transition-colors">
        <Save className="w-3 h-3 text-excel-gray-700" />
      </button>
      <button className="w-5 h-5 flex items-center justify-center hover:bg-excel-gray-200 rounded transition-colors">
        <Undo className="w-3 h-3 text-excel-gray-700" />
      </button>
      <button className="w-5 h-5 flex items-center justify-center hover:bg-excel-gray-200 rounded transition-colors">
        <Redo className="w-3 h-3 text-excel-gray-700" />
      </button>
      
      {/* Dropdown arrow */}
      <button className="w-4 h-5 flex items-center justify-center hover:bg-excel-gray-200 rounded transition-colors">
        <ChevronDown className="w-3 h-3 text-excel-gray-700" />
      </button>
      
      {/* Separator */}
      <div className="w-px h-4 bg-excel-gray-300 mx-1" />
      
      {/* File menu area */}
      <div className="text-xs text-excel-gray-700">
        File
      </div>
    </div>
  );
};

export default QuickAccessToolbar;