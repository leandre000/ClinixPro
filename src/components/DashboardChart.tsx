import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  title: string;
  type?: 'bar' | 'line';
  color?: string;
  realTime?: boolean;
  refreshInterval?: number;
  onDataRefresh?: () => Promise<{ labels: string[]; values: number[] }>;
}

const DashboardChart: React.FC<DashboardChartProps> = ({ 
  data, 
  title, 
  type = 'bar',
  color = 'rgba(79, 70, 229, 0.8)',
  realTime = false,
  refreshInterval = 30000, // 30 seconds
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

  const processedData = {
    labels: chartData.labels,
    datasets: [
      {
        label: title,
        data: chartData.values,
        backgroundColor: type === 'bar' ? color : 'transparent',
        borderColor: color,
        borderWidth: 2,
        fill: type === 'line' ? true : false,
        tension: 0.4,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: '#374151',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: color,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            return `${title}: ${context[0].label}`;
          },
          label: (context: any) => {
            return `Value: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
          callback: (value: any) => {
            // Format large numbers with K, M, etc.
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'K';
            }
            return value;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    elements: {
      bar: {
        borderRadius: 4,
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
        {type === 'bar' ? (
          <Bar data={processedData} options={options} />
        ) : (
          <Line data={processedData} options={options} />
        )}
      </div>
      
      {/* Summary stats */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-600">
              {Math.max(...chartData.values)}
            </div>
            <div className="text-xs text-gray-500">Highest</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(chartData.values.reduce((a, b) => a + b, 0) / chartData.values.length)}
            </div>
            <div className="text-xs text-gray-500">Average</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {chartData.values.length}
            </div>
            <div className="text-xs text-gray-500">Total Items</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardChart; 