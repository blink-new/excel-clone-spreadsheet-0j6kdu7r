import { createContext } from 'react';
import { SpreadsheetContextType } from '../types/spreadsheet';

export const SpreadsheetContext = createContext<SpreadsheetContextType | undefined>(undefined);