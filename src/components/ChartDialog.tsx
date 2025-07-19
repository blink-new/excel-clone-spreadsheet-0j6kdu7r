import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ChartData } from '../types/spreadsheet';

interface ChartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChart: (type: ChartData['type'], dataRange: string, title: string) => void;
  selectedRange?: string;
}

const ChartDialog: React.FC<ChartDialogProps> = ({ 
  isOpen, 
  onClose, 
  onCreateChart, 
  selectedRange 
}) => {
  const [chartType, setChartType] = useState<ChartData['type']>('bar');
  const [dataRange, setDataRange] = useState(selectedRange || 'A1:B5');
  const [title, setTitle] = useState('Chart Title');

  const handleCreate = () => {
    onCreateChart(chartType, dataRange, title);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Chart</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="chart-type" className="text-right">
              Type
            </Label>
            <Select value={chartType} onValueChange={(value) => setChartType(value as ChartData['type'])}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="data-range" className="text-right">
              Data Range
            </Label>
            <Input
              id="data-range"
              value={dataRange}
              onChange={(e) => setDataRange(e.target.value)}
              className="col-span-3"
              placeholder="e.g., A1:C5"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="chart-title" className="text-right">
              Title
            </Label>
            <Input
              id="chart-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="Chart Title"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            Create Chart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChartDialog;