// Modern chart component for prop betting visualization
import React from 'react';

const PropChart = ({ data, prop, line, playerName }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-placeholder">
          <p>No data available for chart</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  const chartHeight = 200;
  const chartWidth = data.length * 40;

  // Generate chart points
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((point.value - minValue) / range) * chartHeight;
    return { x, y, ...point };
  });

  // Create SVG path
  const pathData = points.map((point, index) => {
    return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }).join(' ');

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>{playerName} - {prop} Trend</h3>
        <div className="chart-stats">
          <span className="stat">Avg: {data.reduce((sum, d) => sum + d.value, 0) / data.length}</span>
          <span className="stat">Max: {maxValue}</span>
          <span className="stat">Min: {minValue}</span>
        </div>
      </div>
      
      <div className="chart-wrapper">
        <svg width={chartWidth + 60} height={chartHeight + 40} className="chart-svg">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#333" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Prop line */}
          <line
            x1="30"
            y1={chartHeight - ((parseFloat(line) - minValue) / range) * chartHeight + 20}
            x2={chartWidth + 30}
            y2={chartHeight - ((parseFloat(line) - minValue) / range) * chartHeight + 20}
            stroke="#ff6b6b"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          {/* Data line */}
          <path
            d={pathData}
            fill="none"
            stroke="#4ade80"
            strokeWidth="3"
            transform="translate(30, 20)"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x + 30}
              cy={point.y + 20}
              r="4"
              fill={point.value > parseFloat(line) ? "#4ade80" : "#ff6b6b"}
              stroke="#fff"
              strokeWidth="2"
            />
          ))}
          
          {/* Y-axis labels */}
          {[minValue, (minValue + maxValue) / 2, maxValue].map((value, index) => (
            <text
              key={index}
              x="10"
              y={chartHeight - ((value - minValue) / range) * chartHeight + 25}
              fill="#aaa"
              fontSize="12"
              textAnchor="end"
            >
              {value.toFixed(1)}
            </text>
          ))}
          
          {/* X-axis labels */}
          {points.filter((_, index) => index % Math.ceil(data.length / 5) === 0).map((point, index) => (
            <text
              key={index}
              x={point.x + 30}
              y={chartHeight + 35}
              fill="#aaa"
              fontSize="10"
              textAnchor="middle"
            >
              {point.date}
            </text>
          ))}
        </svg>
      </div>
      
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color" style={{backgroundColor: '#4ade80'}}></div>
          <span>Over Line</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{backgroundColor: '#ff6b6b'}}></div>
          <span>Under Line</span>
        </div>
        <div className="legend-item">
          <div className="legend-line" style={{borderColor: '#ff6b6b'}}></div>
          <span>Prop Line ({line})</span>
        </div>
      </div>
    </div>
  );
};

export default PropChart;
