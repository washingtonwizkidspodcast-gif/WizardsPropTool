// Advanced insights component for betting recommendations
import React from 'react';

const BettingInsights = ({ insights, metrics }) => {
  if (!insights || insights.length === 0) {
    return (
      <div className="insights-container">
        <h3>Betting Insights</h3>
        <div className="no-insights">
          <p>No insights available</p>
        </div>
      </div>
    );
  }

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      case 'warning': return '⚠️';
      case 'neutral': return '📊';
      default: return 'ℹ️';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive': return '#4ade80';
      case 'negative': return '#ff6b6b';
      case 'warning': return '#fbbf24';
      case 'neutral': return '#60a5fa';
      default: return '#9ca3af';
    }
  };

  return (
    <div className="insights-container">
      <h3>Betting Insights</h3>
      
      {/* Recommendation Card */}
      {metrics && (
        <div className="recommendation-card">
          <div className="recommendation-header">
            <h4>Recommendation</h4>
            <span className={`recommendation-badge ${metrics.recommendation.toLowerCase().replace(' ', '-')}`}>
              {metrics.recommendation}
            </span>
          </div>
          <div className="recommendation-metrics">
            <div className="metric">
              <span className="metric-label">Confidence</span>
              <span className={`metric-value confidence-${metrics.confidence.toLowerCase()}`}>
                {metrics.confidence}
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Edge</span>
              <span className={`metric-value ${metrics.edge > 0 ? 'positive' : 'negative'}`}>
                {metrics.edge > 0 ? '+' : ''}{metrics.edge.toFixed(1)}%
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Expected Value</span>
              <span className={`metric-value ${metrics.expectedValue > 0 ? 'positive' : 'negative'}`}>
                {metrics.expectedValue > 0 ? '+' : ''}{metrics.expectedValue.toFixed(3)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Insights List */}
      <div className="insights-list">
        {insights.map((insight, index) => (
          <div key={index} className="insight-item">
            <div className="insight-icon" style={{color: getInsightColor(insight.type)}}>
              {getInsightIcon(insight.type)}
            </div>
            <div className="insight-content">
              <h4 className="insight-title">{insight.title}</h4>
              <p className="insight-message">{insight.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Metrics */}
      {metrics && (
        <div className="advanced-metrics">
          <h4>Advanced Metrics</h4>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Consistency</span>
                <span className="metric-value">{metrics.consistency}%</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-fill" 
                  style={{width: `${metrics.consistency}%`, backgroundColor: '#4ade80'}}
                ></div>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Volatility</span>
                <span className="metric-value">{metrics.volatility}%</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-fill" 
                  style={{width: `${metrics.volatility}%`, backgroundColor: '#ff6b6b'}}
                ></div>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Trend</span>
                <span className={`metric-value ${metrics.trend > 0 ? 'positive' : 'negative'}`}>
                  {metrics.trend > 0 ? '+' : ''}{metrics.trend}%
                </span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-fill" 
                  style={{
                    width: `${Math.abs(metrics.trend)}%`, 
                    backgroundColor: metrics.trend > 0 ? '#4ade80' : '#ff6b6b'
                  }}
                ></div>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Percentile</span>
                <span className="metric-value">{metrics.percentile}%</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-fill" 
                  style={{width: `${metrics.percentile}%`, backgroundColor: '#60a5fa'}}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Information */}
      {metrics && metrics.streak.count > 0 && (
        <div className="streak-info">
          <h4>Current Streak</h4>
          <div className={`streak-display ${metrics.streak.type}`}>
            <span className="streak-count">{metrics.streak.count}</span>
            <span className="streak-type">
              {metrics.streak.type === 'hit' ? 'Hits' : 'Misses'} in a row
            </span>
          </div>
        </div>
      )}

      {/* Home/Away Split */}
      {metrics && metrics.homeAwaySplit && (
        <div className="split-analysis">
          <h4>Home/Away Split</h4>
          <div className="split-grid">
            <div className="split-card home">
              <h5>Home Games</h5>
              <div className="split-stats">
                <span>{metrics.homeAwaySplit.home.hitRate.percentage}% Hit Rate</span>
                <span>{metrics.homeAwaySplit.home.average.toFixed(1)} Avg</span>
                <span>{metrics.homeAwaySplit.home.games} Games</span>
              </div>
            </div>
            <div className="split-card away">
              <h5>Away Games</h5>
              <div className="split-stats">
                <span>{metrics.homeAwaySplit.away.hitRate.percentage}% Hit Rate</span>
                <span>{metrics.homeAwaySplit.away.average.toFixed(1)} Avg</span>
                <span>{metrics.homeAwaySplit.away.games} Games</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BettingInsights;
