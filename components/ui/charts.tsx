import React from 'react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#10b981',
  backgroundColor = '#e5e7eb',
  children
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

interface SimpleChartProps {
  data: Array<{ date: string; value: number; label?: string }>;
  height?: number;
  color?: string;
  showGrid?: boolean;
}

export function SimpleLineChart({ 
  data, 
  height = 200, 
  color = '#3b82f6',
  showGrid = true 
}: SimpleChartProps) {
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-md text-gray-400"
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const width = 100; // Use percentage width
  const padding = 10;

  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = padding + ((maxValue - item.value) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full" style={{ height }}>
      <svg 
        width="100%" 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {/* Grid lines */}
        {showGrid && (
          <g stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5">
            {[...Array(5)].map((_, i) => {
              const y = padding + (i / 4) * (height - 2 * padding);
              return (
                <line
                  key={i}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                />
              );
            })}
          </g>
        )}
        
        {/* Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          className="drop-shadow-sm"
        />
        
        {/* Dots */}
        {data.map((item, index) => {
          const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
          const y = padding + ((maxValue - item.value) / range) * (height - 2 * padding);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              className="hover:r-4 transition-all cursor-pointer"
            >
              <title>{`${item.label || item.date}: ${item.value}`}</title>
            </circle>
          );
        })}
      </svg>
    </div>
  );
}

interface SimpleBarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  height?: number;
  showValues?: boolean;
}

export function SimpleBarChart({ 
  data, 
  height = 200, 
  showValues = true 
}: SimpleBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-md text-gray-400"
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full space-y-3" style={{ minHeight: height }}>
      {data.map((item, index) => {
        const barHeight = maxValue > 0 ? (item.value / maxValue) * height * 0.8 : 0;
        const color = item.color || '#3b82f6';
        
        return (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600 dark:text-gray-400 truncate">
              {item.label}
            </div>
            <div className="flex-1 flex items-center">
              <div 
                className="rounded-md transition-all duration-300"
                style={{ 
                  backgroundColor: color,
                  height: '20px',
                  width: `${(item.value / maxValue) * 100}%`,
                  minWidth: item.value > 0 ? '4px' : '0'
                }}
              />
              {showValues && (
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {item.value}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface MacroRingProps {
  protein: number;
  carbs: number;
  fat: number;
  size?: number;
}

export function MacroRing({ protein, carbs, fat, size = 120 }: MacroRingProps) {
  const total = protein + carbs + fat;
  if (total === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400 text-sm"
        style={{ width: size, height: size }}
      >
        No data
      </div>
    );
  }

  const proteinPercent = (protein / total) * 100;
  const carbsPercent = (carbs / total) * 100;
  const fatPercent = (fat / total) * 100;

  const radius = (size - 20) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Calculate stroke dash arrays for each macro
  const proteinLength = (proteinPercent / 100) * circumference;
  const carbsLength = (carbsPercent / 100) * circumference;
  const fatLength = (fatPercent / 100) * circumference;

  const proteinOffset = 0;
  const carbsOffset = proteinLength;
  const fatOffset = proteinLength + carbsLength;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Protein */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#ef4444" // red
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={`${proteinLength} ${circumference - proteinLength}`}
          strokeDashoffset={-proteinOffset}
          strokeLinecap="round"
        />
        {/* Carbs */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3b82f6" // blue
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={`${carbsLength} ${circumference - carbsLength}`}
          strokeDashoffset={-carbsOffset}
          strokeLinecap="round"
        />
        {/* Fat */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f59e0b" // yellow
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={`${fatLength} ${circumference - fatLength}`}
          strokeDashoffset={-fatOffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {total.toFixed(0)}g
        </div>
        <div className="text-xs text-gray-500">Total</div>
      </div>
    </div>
  );
}