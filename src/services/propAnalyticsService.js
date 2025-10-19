// Advanced analytics service for prop betting insights
class PropAnalyticsService {
  constructor() {
    this.trendAnalysis = new Map();
    this.performanceMetrics = new Map();
  }

  // Calculate advanced betting metrics
  calculateBettingMetrics(player, prop, line, period = 'Last 20') {
    if (!player || !player.gameLog) {
      return this.getDefaultMetrics();
    }

    const games = player.gameLog.slice(0, parseInt(period.split(' ')[1]));
    const values = this.extractPropValues(games, prop);
    
    return {
      // Basic metrics
      hitRate: this.calculateHitRate(values, line),
      average: this.calculateAverage(values),
      median: this.calculateMedian(values),
      standardDeviation: this.calculateStandardDeviation(values),
      
      // Advanced metrics
      consistency: this.calculateConsistency(values),
      trend: this.calculateTrend(values),
      volatility: this.calculateVolatility(values),
      
      // Betting insights
      edge: this.calculateEdge(values, line),
      confidence: this.calculateConfidence(values, line),
      recommendation: this.getRecommendation(values, line),
      
      // Performance metrics
      streak: this.calculateStreak(values, line),
      recentForm: this.calculateRecentForm(values, line),
      homeAwaySplit: this.calculateHomeAwaySplit(games, prop, line),
      
      // Statistical analysis
      percentile: this.calculatePercentile(values, line),
      probability: this.calculateProbability(values, line),
      expectedValue: this.calculateExpectedValue(values, line)
    };
  }

  // Extract prop values from games
  extractPropValues(games, prop) {
    return games.map(game => {
      switch(prop) {
        case 'Points': return game.pts;
        case 'Rebounds': return game.reb;
        case 'Assists': return game.ast;
        case '3-Pointers Made': return game.threePM;
        case 'Steals': return game.stl;
        case 'Blocks': return game.blk;
        case 'Pts+Reb+Ast': return game.pts + game.reb + game.ast;
        case 'Pts+Reb': return game.pts + game.reb;
        case 'Pts+Ast': return game.pts + game.ast;
        case 'Reb+Ast': return game.reb + game.ast;
        default: return game.pts;
      }
    });
  }

  // Calculate hit rate
  calculateHitRate(values, line) {
    const hits = values.filter(value => value > parseFloat(line)).length;
    return {
      hits,
      total: values.length,
      percentage: values.length > 0 ? Math.round((hits / values.length) * 100) : 0
    };
  }

  // Calculate average
  calculateAverage(values) {
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  }

  // Calculate median
  calculateMedian(values) {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  // Calculate standard deviation
  calculateStandardDeviation(values) {
    if (values.length === 0) return 0;
    const avg = this.calculateAverage(values);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  // Calculate consistency (lower is more consistent)
  calculateConsistency(values) {
    if (values.length === 0) return 0;
    const avg = this.calculateAverage(values);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    return Math.round((1 - (Math.sqrt(variance) / avg)) * 100);
  }

  // Calculate trend (positive = improving, negative = declining)
  calculateTrend(values) {
    if (values.length < 3) return 0;
    const recent = values.slice(0, Math.floor(values.length / 2));
    const older = values.slice(Math.floor(values.length / 2));
    const recentAvg = this.calculateAverage(recent);
    const olderAvg = this.calculateAverage(older);
    return Math.round(((recentAvg - olderAvg) / olderAvg) * 100);
  }

  // Calculate volatility
  calculateVolatility(values) {
    if (values.length === 0) return 0;
    const avg = this.calculateAverage(values);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    return Math.round((Math.sqrt(variance) / avg) * 100);
  }

  // Calculate betting edge
  calculateEdge(values, line) {
    const hitRate = this.calculateHitRate(values, line);
    const impliedProbability = 50; // Assuming -110 odds
    return hitRate.percentage - impliedProbability;
  }

  // Calculate confidence level
  calculateConfidence(values, line) {
    const hitRate = this.calculateHitRate(values, line);
    const sampleSize = values.length;
    
    if (sampleSize < 5) return 'Low';
    if (sampleSize < 10) return 'Medium';
    if (hitRate.percentage > 60 || hitRate.percentage < 40) return 'High';
    return 'Medium';
  }

  // Get betting recommendation
  getRecommendation(values, line) {
    const hitRate = this.calculateHitRate(values, line);
    const edge = this.calculateEdge(values, line);
    const trend = this.calculateTrend(values);
    
    if (hitRate.percentage > 60 && edge > 5) return 'Strong Over';
    if (hitRate.percentage > 55 && edge > 0) return 'Over';
    if (hitRate.percentage < 40 && edge < -5) return 'Strong Under';
    if (hitRate.percentage < 45 && edge < 0) return 'Under';
    if (trend > 10) return 'Trending Up';
    if (trend < -10) return 'Trending Down';
    return 'No Edge';
  }

  // Calculate current streak
  calculateStreak(values, line) {
    if (values.length === 0) return { type: 'none', count: 0 };
    
    let currentStreak = 0;
    let streakType = values[0] > parseFloat(line) ? 'hit' : 'miss';
    
    for (let i = 0; i < values.length; i++) {
      const isHit = values[i] > parseFloat(line);
      if ((isHit && streakType === 'hit') || (!isHit && streakType === 'miss')) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    return { type: streakType, count: currentStreak };
  }

  // Calculate recent form (last 5 games)
  calculateRecentForm(values, line) {
    const recent = values.slice(0, 5);
    const hitRate = this.calculateHitRate(recent, line);
    return {
      hits: hitRate.hits,
      total: hitRate.total,
      percentage: hitRate.percentage,
      trend: this.calculateTrend(recent)
    };
  }

  // Calculate home/away split
  calculateHomeAwaySplit(games, prop, line) {
    const homeGames = games.filter(game => game.opponent.includes('vs'));
    const awayGames = games.filter(game => game.opponent.includes('@'));
    
    const homeValues = this.extractPropValues(homeGames, prop);
    const awayValues = this.extractPropValues(awayGames, prop);
    
    return {
      home: {
        hitRate: this.calculateHitRate(homeValues, line),
        average: this.calculateAverage(homeValues),
        games: homeGames.length
      },
      away: {
        hitRate: this.calculateHitRate(awayValues, line),
        average: this.calculateAverage(awayValues),
        games: awayGames.length
      }
    };
  }

  // Calculate percentile
  calculatePercentile(values, line) {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const lineValue = parseFloat(line);
    const belowLine = sorted.filter(val => val <= lineValue).length;
    return Math.round((belowLine / values.length) * 100);
  }

  // Calculate probability
  calculateProbability(values, line) {
    const hitRate = this.calculateHitRate(values, line);
    return hitRate.percentage / 100;
  }

  // Calculate expected value
  calculateExpectedValue(values, line) {
    const probability = this.calculateProbability(values, line);
    const payout = 0.91; // Assuming -110 odds
    return (probability * payout) - ((1 - probability) * 1);
  }

  // Get default metrics
  getDefaultMetrics() {
    return {
      hitRate: { hits: 0, total: 0, percentage: 0 },
      average: 0,
      median: 0,
      standardDeviation: 0,
      consistency: 0,
      trend: 0,
      volatility: 0,
      edge: 0,
      confidence: 'Low',
      recommendation: 'No Data',
      streak: { type: 'none', count: 0 },
      recentForm: { hits: 0, total: 0, percentage: 0, trend: 0 },
      homeAwaySplit: { home: { hitRate: { hits: 0, total: 0, percentage: 0 }, average: 0, games: 0 }, away: { hitRate: { hits: 0, total: 0, percentage: 0 }, average: 0, games: 0 } },
      percentile: 0,
      probability: 0,
      expectedValue: 0
    };
  }

  // Generate betting insights
  generateBettingInsights(player, prop, line, period = 'Last 20') {
    const metrics = this.calculateBettingMetrics(player, prop, line, period);
    
    const insights = [];
    
    // Hit rate insights
    if (metrics.hitRate.percentage > 60) {
      insights.push({
        type: 'positive',
        title: 'Strong Hit Rate',
        message: `${metrics.hitRate.percentage}% hit rate suggests value on the Over`
      });
    } else if (metrics.hitRate.percentage < 40) {
      insights.push({
        type: 'negative',
        title: 'Low Hit Rate',
        message: `${metrics.hitRate.percentage}% hit rate suggests value on the Under`
      });
    }
    
    // Trend insights
    if (metrics.trend > 10) {
      insights.push({
        type: 'positive',
        title: 'Positive Trend',
        message: `Player is trending up (+${metrics.trend}% vs earlier games)`
      });
    } else if (metrics.trend < -10) {
      insights.push({
        type: 'negative',
        title: 'Negative Trend',
        message: `Player is trending down (${metrics.trend}% vs earlier games)`
      });
    }
    
    // Consistency insights
    if (metrics.consistency > 80) {
      insights.push({
        type: 'neutral',
        title: 'High Consistency',
        message: `Very consistent performance (${metrics.consistency}% consistency)`
      });
    } else if (metrics.consistency < 50) {
      insights.push({
        type: 'warning',
        title: 'High Volatility',
        message: `Inconsistent performance (${metrics.consistency}% consistency)`
      });
    }
    
    // Streak insights
    if (metrics.streak.count > 3) {
      insights.push({
        type: metrics.streak.type === 'hit' ? 'positive' : 'negative',
        title: `${metrics.streak.count}-Game ${metrics.streak.type === 'hit' ? 'Hit' : 'Miss'} Streak`,
        message: `Currently on a ${metrics.streak.count}-game ${metrics.streak.type} streak`
      });
    }
    
    // Recent form insights
    if (metrics.recentForm.percentage > 70) {
      insights.push({
        type: 'positive',
        title: 'Hot Recent Form',
        message: `${metrics.recentForm.percentage}% hit rate in last 5 games`
      });
    } else if (metrics.recentForm.percentage < 30) {
      insights.push({
        type: 'negative',
        title: 'Cold Recent Form',
        message: `${metrics.recentForm.percentage}% hit rate in last 5 games`
      });
    }
    
    return insights;
  }
}

// Create singleton instance
const propAnalyticsService = new PropAnalyticsService();

export default propAnalyticsService;
