import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartData {
  labels: string[];
  values: number[];
  datasets?: Array<{
    label: string;
    data: number[];
    color?: string;
  }>;
}

interface AdvancedChartProps {
  data: ChartData;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'area';
  color?: string;
  colors?: string[];
  realTime?: boolean;
  refreshInterval?: number;
  onDataRefresh?: () => Promise<ChartData>;
  showStats?: boolean;
  showTrends?: boolean;
  height?: number;
  description?: string;
}

const AdvancedChart: React.FC<AdvancedChartProps> = ({
  data,
  title,
  type,
  color = 'rgba(79, 70, 229, 0.8)',
  colors = [
    'rgba(79, 70, 229, 0.8)',   // Indigo
    'rgba(16, 185, 129, 0.8)',  // Green
    'rgba(245, 158, 11, 0.8)',  // Yellow
    'rgba(239, 68, 68, 0.8)',   // Red
    'rgba(59, 130, 246, 0.8)',  // Blue
    'rgba(139, 92, 246, 0.8)',  // Purple
  ],
  realTime = false,
  refreshInterval = 30000,
  onDataRefresh,
  showStats = true,
  showTrends = true,
  height = 300,
  description
}) => {
  const [chartData, setChartData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  // Real-time data refresh
  useEffect(() => {
    if (!realTime || !onDataRefresh) return;

    const interval = setInterval(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const newData = await onDataRefresh();
        setChartData(newData);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Failed to refresh chart data:', err);
        setError('Failed to update data');
      } finally {
        setIsLoading(false);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [realTime, onDataRefresh, refreshInterval]);

  // Calculate trends
  const calculateTrend = (values: number[]) => {
    if (values.length < 2) return 0;
    const recent = values.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const previous = values.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
    return ((recent - previous) / previous) * 100;
  };

  const trend = calculateTrend(chartData.values);
  const total = chartData.values.reduce((sum, value) => sum + value, 0);
  const average = total / chartData.values.length;
  const max = Math.max(...chartData.values);
  const min = Math.min(...chartData.values);

  // Prepare chart data
  const getChartData = () => {
    if (type === 'pie' || type === 'doughnut') {
      return {
        labels: chartData.labels,
        datasets: [{
          data: chartData.values,
          backgroundColor: colors.slice(0, chartData.labels.length),
          borderColor: colors.slice(0, chartData.labels.length).map(c => c.replace('0.8', '1')),
          borderWidth: 2,
          hoverBorderWidth: 3,
        }],
      };
    }

    if (chartData.datasets) {
      return {
        labels: chartData.labels,
        datasets: chartData.datasets.map((dataset, index) => ({
          label: dataset.label,
          data: dataset.data,
          backgroundColor: dataset.color || colors[index % colors.length],
          borderColor: dataset.color || colors[index % colors.length],
          borderWidth: 2,
          fill: type === 'area',
          tension: 0.4,
        })),
      };
    }

    return {
      labels: chartData.labels,
      datasets: [{
        label: title,
        data: chartData.values,
        backgroundColor: type === 'bar' ? color : 'transparent',
        borderColor: color,
        borderWidth: 2,
        fill: type === 'area',
        tension: 0.4,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: type === 'pie' || type === 'doughnut',
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 12 },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: color,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: type === 'pie' || type === 'doughnut',
        callbacks: {
          title: (context: any) => context[0].label,
          label: (context: any) => {
            if (type === 'pie' || type === 'doughnut') {
              const value = context.parsed;
              const percentage = ((value / total) * 100).toFixed(1);
              return `${context.dataset.label || 'Value'}: ${value} (${percentage}%)`;
            }
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: type !== 'pie' && type !== 'doughnut' ? {
      x: {
        grid: { display: false },
        ticks: {
          color: '#6B7280',
          font: { size: 12 },
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
          font: { size: 12 },
          callback: (value: any) => {
            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
            if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
            return value;
          },
        },
      },
    } : undefined,
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

  const renderChart = () => {
    const data = getChartData();
    
    switch (type) {
      case 'bar':
        return <Bar data={data} options={chartOptions} />;
      case 'line':
      case 'area':
        return <Line data={data} options={chartOptions} />;
      case 'pie':
        return <Pie data={data} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={chartOptions} />;
      default:
        return <Bar data={data} options={chartOptions} />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
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

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Chart */}
      <div style={{ height: `${height}px` }}>
        {renderChart()}
      </div>

      {/* Stats and Trends */}
      {showStats && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-indigo-600">
                {total.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(average).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Average</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {max.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Highest</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {chartData.labels.length}
              </div>
              <div className="text-xs text-gray-500">Items</div>
            </div>
          </div>

          {/* Trend indicator */}
          {showTrends && trend !== 0 && (
            <div className="mt-4 flex items-center justify-center">
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                trend > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <span>{trend > 0 ? '↗' : '↘'}</span>
                <span>{Math.abs(trend).toFixed(1)}%</span>
                <span>vs previous period</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedChart; 