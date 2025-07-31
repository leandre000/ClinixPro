import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title
);

interface PieChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  title: string;
  type?: 'pie' | 'doughnut';
  realTime?: boolean;
  refreshInterval?: number;
  onDataRefresh?: () => Promise<{ labels: string[]; values: number[] }>;
}

const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  title, 
  type = 'pie',
  realTime = false,
  refreshInterval = 30000,
  onDataRefresh
}) => {
  const [chartData, setChartData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Real-time data refresh
  useEffect(() => {
    if (!realTime || !onDataRefresh) return;

    const interval = setInterval(async () => {
      setIsLoading(true);
      try {
        const newData = await onDataRefresh();
        setChartData(newData);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to refresh chart data:', error);
      } finally {
        setIsLoading(false);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [realTime, onDataRefresh, refreshInterval]);

  const colors = [
    'rgba(79, 70, 229, 0.8)',   // Indigo
    'rgba(16, 185, 129, 0.8)',  // Green
    'rgba(245, 158, 11, 0.8)',  // Yellow
    'rgba(239, 68, 68, 0.8)',   // Red
    'rgba(59, 130, 246, 0.8)',  // Blue
    'rgba(139, 92, 246, 0.8)',  // Purple
    'rgba(236, 72, 153, 0.8)',  // Pink
    'rgba(34, 197, 94, 0.8)',   // Emerald
  ];

  const borderColors = [
    'rgba(79, 70, 229, 1)',
    'rgba(16, 185, 129, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(239, 68, 68, 1)',
    'rgba(59, 130, 246, 1)',
    'rgba(139, 92, 246, 1)',
    'rgba(236, 72, 153, 1)',
    'rgba(34, 197, 94, 1)',
  ];

  const processedData = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.values,
        backgroundColor: colors.slice(0, chartData.labels.length),
        borderColor: borderColors.slice(0, chartData.labels.length),
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const total = chartData.values.reduce((sum, value) => sum + value, 0);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
          },
          generateLabels: (chart: any) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const value = data.datasets[0].data[i];
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: 2,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: '#374151',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context: any) => {
            return context[0].label;
          },
          label: (context: any) => {
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {realTime && (
          <div className="flex items-center space-x-2">
            {isLoading && (
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            )}
            <span className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
      
      <div className="h-64">
        {type === 'pie' ? (
          <Pie data={processedData} options={options} />
        ) : (
          <Doughnut data={processedData} options={options} />
        )}
      </div>
      
      {/* Summary stats */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-600">
              {total}
            </div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {chartData.labels.length}
            </div>
            <div className="text-xs text-gray-500">Categories</div>
          </div>
        </div>
        
        {/* Top 3 items */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Top Items:</h4>
          <div className="space-y-1">
            {chartData.labels
              .map((label, index) => ({ label, value: chartData.values[index] }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 3)
              .map((item, index) => {
                const percentage = ((item.value / total) * 100).toFixed(1);
                return (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 truncate">{item.label}</span>
                    <span className="text-gray-900 font-medium">{percentage}%</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChart; 