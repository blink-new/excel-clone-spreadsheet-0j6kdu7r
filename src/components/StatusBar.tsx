import React from 'react';

const StatusBar: React.FC = () => {
  return (
    <div className="h-5 bg-excel-gray-100 border-t border-excel-gray-300 flex items-center justify-between px-2 text-xs text-excel-gray-700">
      {/* Left side - Status info */}
      <div className="flex items-center space-x-4">
        <span>Ready</span>
        <span>Sheet1</span>
      </div>
      
      {/* Right side - View controls */}
      <div className="flex items-center space-x-2">
        <span>100%</span>
        <div className="flex space-x-1">
          <button className="w-4 h-3 bg-excel-gray-200 border border-excel-gray-400 hover:bg-excel-gray-300"></button>
          <button className="w-4 h-3 bg-excel-gray-200 border border-excel-gray-400 hover:bg-excel-gray-300"></button>
          <button className="w-4 h-3 bg-excel-gray-200 border border-excel-gray-400 hover:bg-excel-gray-300"></button>
        </div>
        <div className="w-16 h-2 bg-excel-gray-200 border border-excel-gray-400 rounded-sm">
          <div className="w-full h-full bg-excel-blue rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;