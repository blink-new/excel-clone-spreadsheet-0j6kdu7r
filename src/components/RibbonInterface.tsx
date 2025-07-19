import React, { useState } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, ChevronDown } from 'lucide-react';

const RibbonInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Home');
  
  const tabs = ['File', 'Home', 'Insert', 'Page Layout', 'Formulas', 'Data', 'Review', 'View'];
  
  return (
    <div className="bg-excel-gray-50 border-b border-excel-gray-300">
      {/* Tab Headers */}
      <div className="flex border-b border-excel-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-normal transition-colors ${
              activeTab === tab
                ? 'bg-white border-b-2 border-excel-blue text-excel-blue'
                : 'text-excel-gray-700 hover:bg-excel-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Ribbon Content */}
      <div className="p-2">
        {activeTab === 'Home' && (
          <div className="flex items-center space-x-4">
            {/* Clipboard Group */}
            <div className="flex flex-col items-center space-y-1 px-2">
              <div className="text-xs text-excel-gray-600">Clipboard</div>
              <div className="flex space-x-1">
                <button className="px-2 py-1 text-xs bg-white border border-excel-gray-300 rounded hover:bg-excel-gray-50">
                  Paste
                </button>
                <button className="px-2 py-1 text-xs bg-white border border-excel-gray-300 rounded hover:bg-excel-gray-50">
                  Cut
                </button>
                <button className="px-2 py-1 text-xs bg-white border border-excel-gray-300 rounded hover:bg-excel-gray-50">
                  Copy
                </button>
              </div>
            </div>
            
            {/* Separator */}
            <div className="w-px h-12 bg-excel-gray-300" />
            
            {/* Font Group */}
            <div className="flex flex-col space-y-1">
              <div className="text-xs text-excel-gray-600">Font</div>
              <div className="flex items-center space-x-1">
                <select className="px-2 py-1 text-xs border border-excel-gray-300 rounded bg-white">
                  <option>Calibri</option>
                  <option>Arial</option>
                  <option>Times New Roman</option>
                </select>
                <select className="px-2 py-1 text-xs border border-excel-gray-300 rounded bg-white w-12">
                  <option>11</option>
                  <option>12</option>
                  <option>14</option>
                </select>
                <button className="w-6 h-6 flex items-center justify-center border border-excel-gray-300 rounded hover:bg-excel-gray-100">
                  <Bold className="w-3 h-3" />
                </button>
                <button className="w-6 h-6 flex items-center justify-center border border-excel-gray-300 rounded hover:bg-excel-gray-100">
                  <Italic className="w-3 h-3" />
                </button>
                <button className="w-6 h-6 flex items-center justify-center border border-excel-gray-300 rounded hover:bg-excel-gray-100">
                  <Underline className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            {/* Separator */}
            <div className="w-px h-12 bg-excel-gray-300" />
            
            {/* Alignment Group */}
            <div className="flex flex-col space-y-1">
              <div className="text-xs text-excel-gray-600">Alignment</div>
              <div className="flex items-center space-x-1">
                <button className="w-6 h-6 flex items-center justify-center border border-excel-gray-300 rounded hover:bg-excel-gray-100">
                  <AlignLeft className="w-3 h-3" />
                </button>
                <button className="w-6 h-6 flex items-center justify-center border border-excel-gray-300 rounded hover:bg-excel-gray-100">
                  <AlignCenter className="w-3 h-3" />
                </button>
                <button className="w-6 h-6 flex items-center justify-center border border-excel-gray-300 rounded hover:bg-excel-gray-100">
                  <AlignRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'Insert' && (
          <div className="flex items-center space-x-4">
            <div className="text-sm text-excel-gray-600">Insert tools coming soon...</div>
          </div>
        )}
        
        {activeTab === 'Formulas' && (
          <div className="flex items-center space-x-4">
            <div className="text-sm text-excel-gray-600">Formula tools coming soon...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RibbonInterface;