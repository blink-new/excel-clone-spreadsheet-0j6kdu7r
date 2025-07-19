import { useContext } from 'react';
import { SpreadsheetContext } from '../contexts/SpreadsheetContext';

export const useSpreadsheet = () => {
  const context = useContext(SpreadsheetContext);
  if (!context) {
    throw new Error('useSpreadsheet must be used within a SpreadsheetProvider');
  }
  return context;
};