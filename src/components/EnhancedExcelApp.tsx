import React from 'react';
import { SpreadsheetProvider } from './SpreadsheetProvider';
import TitleBar from './TitleBar';
import QuickAccessToolbar from './QuickAccessToolbar';
import EnhancedRibbonInterface from './EnhancedRibbonInterface';
import EnhancedFormulaBar from './EnhancedFormulaBar';
import EnhancedSpreadsheetGrid from './EnhancedSpreadsheetGrid';
import SheetTabs from './SheetTabs';
import StatusBar from './StatusBar';

const EnhancedExcelApp: React.FC = () => {
  return (
    <SpreadsheetProvider>
      <div className="h-screen flex flex-col bg-excel-gray-50 font-segoe">
        <TitleBar />
        <QuickAccessToolbar />
        <EnhancedRibbonInterface />
        <EnhancedFormulaBar />
        <div className="flex-1 flex flex-col">
          <EnhancedSpreadsheetGrid />
        </div>
        <SheetTabs />
        <StatusBar />
      </div>
    </SpreadsheetProvider>
  );
};

export default EnhancedExcelApp;