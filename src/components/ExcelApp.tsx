import React from 'react';
import TitleBar from './TitleBar';
import QuickAccessToolbar from './QuickAccessToolbar';
import RibbonInterface from './RibbonInterface';
import FormulaBar from './FormulaBar';
import SpreadsheetGrid from './SpreadsheetGrid';
import SheetTabs from './SheetTabs';
import StatusBar from './StatusBar';

const ExcelApp: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
      {/* Title Bar */}
      <TitleBar />
      
      {/* Quick Access Toolbar */}
      <QuickAccessToolbar />
      
      {/* Ribbon Interface */}
      <RibbonInterface />
      
      {/* Formula Bar */}
      <FormulaBar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Spreadsheet Grid */}
        <div className="flex-1 min-h-0">
          <SpreadsheetGrid />
        </div>
        
        {/* Sheet Tabs */}
        <SheetTabs />
      </div>
      
      {/* Status Bar */}
      <StatusBar />
    </div>
  );
};

export default ExcelApp;