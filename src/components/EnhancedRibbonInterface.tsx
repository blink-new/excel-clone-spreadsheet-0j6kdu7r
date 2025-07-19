import React, { useState, useRef } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, ChevronDown, Copy, Scissors, Clipboard, Palette, Type, FileDown, FileUp, BarChart3, PieChart, LineChart } from 'lucide-react';
import { useSpreadsheet } from '../hooks/useSpreadsheet';
import ChartDialog from './ChartDialog';

const EnhancedRibbonInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [showColorPicker, setShowColorPicker] = useState<'background' | 'text' | null>(null);
  const [showChartDialog, setShowChartDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    selectedCell,
    selectedRange,
    copyCells,
    cutCells,
    pasteCells,
    applyBold,
    applyItalic,
    applyUnderline,
    applyBackgroundColor,
    applyTextColor,
    applyFontSize,
    addChart,
    exportToCSV,
    importFromCSV
  } = useSpreadsheet();
  
  const tabs = ['File', 'Home', 'Insert', 'Page Layout', 'Formulas', 'Data', 'Review', 'View'];
  
  const getSelectedCells = () => {
    if (selectedRange) return selectedRange;
    if (selectedCell) return [selectedCell];
    return [];
  };

  const handleCopy = () => {
    const cells = getSelectedCells();
    if (cells.length > 0) {
      copyCells(cells);
    }
  };

  const handleCut = () => {
    const cells = getSelectedCells();
    if (cells.length > 0) {
      cutCells(cells);
    }
  };

  const handlePaste = () => {
    if (selectedCell) {
      pasteCells(selectedCell);
    }
  };

  const handleFormatting = (type: 'bold' | 'italic' | 'underline') => {
    const cells = getSelectedCells();
    if (cells.length > 0) {
      switch (type) {
        case 'bold':
          applyBold(cells);
          break;
        case 'italic':
          applyItalic(cells);
          break;
        case 'underline':
          applyUnderline(cells);
          break;
      }
    }
  };

  const handleColorChange = (color: string, type: 'background' | 'text') => {
    const cells = getSelectedCells();
    if (cells.length > 0) {
      if (type === 'background') {
        applyBackgroundColor(cells, color);
      } else {
        applyTextColor(cells, color);
      }
    }
    setShowColorPicker(null);
  };

  const handleFontSizeChange = (size: number) => {
    const cells = getSelectedCells();
    if (cells.length > 0) {
      applyFontSize(cells, size);
    }
  };

  const colors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#ffa500', '#800080', '#008000', '#800000', '#008080', '#000080', '#808080', '#c0c0c0'
  ];

  const handleExportCSV = () => {
    exportToCSV();
  };

  const handleImportCSV = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = e.target?.result as string;
        importFromCSV(csvData);
      };
      reader.readAsText(file);
    }
  };

  const handleCreateChart = (type: 'bar' | 'line' | 'pie', dataRange: string, title: string) => {
    addChart(type, dataRange, title);
  };

  const getSelectedRangeString = () => {
    if (selectedRange && selectedRange.length > 1) {
      const sortedRange = [...selectedRange].sort();
      return `${sortedRange[0]}:${sortedRange[sortedRange.length - 1]}`;
    }
    return selectedCell || 'A1:B5';
  };
  
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
                <button 
                  onClick={handlePaste}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-white border border-excel-gray-300 rounded hover:bg-excel-gray-50"
                >
                  <Clipboard className="w-3 h-3" />
                  <span>Paste</span>
                </button>
                <button 
                  onClick={handleCut}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-white border border-excel-gray-300 rounded hover:bg-excel-gray-50"
                >
                  <Scissors className="w-3 h-3" />
                  <span>Cut</span>
                </button>
                <button 
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-white border border-excel-gray-300 rounded hover:bg-excel-gray-50"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
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
                  <option>Segoe UI</option>
                  <option>Arial</option>
                  <option>Times New Roman</option>
                  <option>Calibri</option>
                </select>
                <select 
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                  className="px-2 py-1 text-xs border border-excel-gray-300 rounded bg-white w-12"
                >
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12" selected>12</option>
                  <option value="14">14</option>
                  <option value="16">16</option>
                  <option value="18">18</option>
                  <option value="20">20</option>
                  <option value="24">24</option>
                </select>
                <button 
                  onClick={() => handleFormatting('bold')}
                  className="w-6 h-6 flex items-center justify-center border border-excel-gray-300 rounded hover:bg-excel-gray-100"
                >
                  <Bold className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => handleFormatting('italic')}
                  className="w-6 h-6 flex items-center justify-center border border-excel-gray-300 rounded hover:bg-excel-gray-100"
                >
                  <Italic className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => handleFormatting('underline')}
                  className="w-6 h-6 flex items-center justify-center border border-excel-gray-300 rounded hover:bg-excel-gray-100"
                >
                  <Underline className="w-3 h-3" />
                </button>
                
                {/* Color Pickers */}
                <div className="relative">
                  <button 
                    onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')}
                    className="w-6 h-6 flex items-center justify-center border border-excel-gray-300 rounded hover:bg-excel-gray-100"
                  >
                    <Type className="w-3 h-3" />
                  </button>
                  {showColorPicker === 'text' && (
                    <div className="absolute top-8 left-0 bg-white border border-excel-gray-300 rounded shadow-lg p-2 z-10">
                      <div className="grid grid-cols-8 gap-1">
                        {colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorChange(color, 'text')}
                            className="w-4 h-4 border border-gray-300 rounded"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowColorPicker(showColorPicker === 'background' ? null : 'background')}
                    className="w-6 h-6 flex items-center justify-center border border-excel-gray-300 rounded hover:bg-excel-gray-100"
                  >
                    <Palette className="w-3 h-3" />
                  </button>
                  {showColorPicker === 'background' && (
                    <div className="absolute top-8 left-0 bg-white border border-excel-gray-300 rounded shadow-lg p-2 z-10">
                      <div className="grid grid-cols-8 gap-1">
                        {colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorChange(color, 'background')}
                            className="w-4 h-4 border border-gray-300 rounded"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
            {/* Charts Group */}
            <div className="flex flex-col items-center space-y-1 px-2">
              <div className="text-xs text-excel-gray-600">Charts</div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => setShowChartDialog(true)}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-white border border-excel-gray-300 rounded hover:bg-excel-gray-50"
                >
                  <BarChart3 className="w-3 h-3" />
                  <span>Insert Chart</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'Data' && (
          <div className="flex items-center space-x-4">
            {/* Import/Export Group */}
            <div className="flex flex-col items-center space-y-1 px-2">
              <div className="text-xs text-excel-gray-600">Import/Export</div>
              <div className="flex space-x-1">
                <button 
                  onClick={handleImportCSV}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-white border border-excel-gray-300 rounded hover:bg-excel-gray-50"
                >
                  <FileUp className="w-3 h-3" />
                  <span>Import CSV</span>
                </button>
                <button 
                  onClick={handleExportCSV}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-white border border-excel-gray-300 rounded hover:bg-excel-gray-50"
                >
                  <FileDown className="w-3 h-3" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'Formulas' && (
          <div className="flex items-center space-x-4">
            <div className="text-sm text-excel-gray-600">
              <div className="mb-2">Available Functions:</div>
              <div className="text-xs space-y-1">
                <div><strong>SUM(A1:A10)</strong> - Sum of range</div>
                <div><strong>AVERAGE(A1:A10)</strong> - Average of range</div>
                <div><strong>COUNT(A1:A10)</strong> - Count numbers in range</div>
                <div><strong>MAX(A1:A10)</strong> - Maximum value</div>
                <div><strong>MIN(A1:A10)</strong> - Minimum value</div>
                <div><strong>IF(A1&gt;10,"High","Low")</strong> - Conditional logic</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Hidden file input for CSV import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      {/* Chart Dialog */}
      <ChartDialog
        isOpen={showChartDialog}
        onClose={() => setShowChartDialog(false)}
        onCreateChart={handleCreateChart}
        selectedRange={getSelectedRangeString()}
      />
    </div>
  );
};

export default EnhancedRibbonInterface;