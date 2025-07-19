import React from 'react';
import { ChartData } from '../types/spreadsheet';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X, Move } from 'lucide-react';

interface ChartProps {
  chart: ChartData;
  onRemove: (chartId: string) => void;
  onUpdate: (chartId: string, updates: Partial<ChartData>) => void;
}

const Chart: React.FC<ChartProps> = ({ chart, onRemove, onUpdate }) => {
  const colors = ['#217346', '#4285F4', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  const renderChart = () => {
    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#217346" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#217346" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chart.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div
      className="absolute bg-white border border-gray-300 rounded-lg shadow-lg"
      style={{
        left: chart.position.x,
        top: chart.position.y,
        width: chart.size.width,
        height: chart.size.height,
        zIndex: 10
      }}
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Move className="w-4 h-4 text-gray-500 cursor-move" />
          <span className="text-sm font-medium text-gray-700">{chart.title}</span>
        </div>
        <button
          onClick={() => onRemove(chart.id)}
          className="p-1 hover:bg-gray-200 rounded"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      
      {/* Chart Content */}
      <div className="p-2" style={{ height: chart.size.height - 40 }}>
        {chart.data.length > 0 ? (
          renderChart()
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available for range: {chart.dataRange}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;