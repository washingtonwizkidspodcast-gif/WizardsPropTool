// API service for fetching NBA player data
const API_CONFIG = {
  // Free NBA API endpoints
  NBA_API_BASE: 'https://www.balldontlie.io/api/v1',
  SPORTS_DATA_BASE: 'https://api.sportsdata.io/v3/nba',
  // Backup API for additional data
  BACKUP_API: 'https://api-nba-v1.p.rapidapi.com'
};

// API Keys - These should be stored in environment variables in production
const API_KEYS = {
  SPORTS_DATA: process.env.REACT_APP_SPORTS_DATA_API_KEY || 'your_sports_data_key_here',
  RAPID_API: process.env.REACT_APP_RAPID_API_KEY || 'your_rapid_api_key_here'
};

class NBADataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Generic API call with error handling
  async makeAPICall(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  }

  // Get cached data or fetch new data
  async getCachedData(key, fetchFunction) {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const data = await fetchFunction();
      this.cache.set(key, {
        data,
        timestamp: now
      });
      return data;
    } catch (error) {
      // Return cached data if available, even if expired
      if (cached) {
        console.warn('Using expired cache due to API error:', error);
        return cached.data;
      }
      throw error;
    }
  }

  // Get Washington Wizards team ID
  async getWizardsTeamId() {
    return this.getCachedData('wizards_team_id', async () => {
      const url = `${API_CONFIG.NBA_API_BASE}/teams`;
      const data = await this.makeAPICall(url);
      
      const wizards = data.data.find(team => 
        team.name.toLowerCase().includes('washington') || 
        team.name.toLowerCase().includes('wizards')
      );
      
      return wizards ? wizards.id : 15; // Default to Wizards ID if not found
    });
  }

  // Get current Wizards roster
  async getWizardsRoster() {
    return this.getCachedData('wizards_roster', async () => {
      try {
        const teamId = await this.getWizardsTeamId();
        const url = `${API_CONFIG.NBA_API_BASE}/players?per_page=100`;
        const data = await this.makeAPICall(url);
        
        // Filter for current Wizards players
        const wizardsPlayers = data.data.filter(player => 
          player.team && player.team.id === teamId
        );

        return wizardsPlayers.map(player => ({
          id: player.id,
          name: `${player.first_name} ${player.last_name}`,
          position: player.position,
          team: player.team,
          height: player.height_feet ? `${player.height_feet}'${player.height_inches}"` : 'N/A',
          weight: player.weight_pounds ? `${player.weight_pounds} lbs` : 'N/A'
        }));
      } catch (error) {
        console.error('Error fetching roster:', error);
        // Return fallback data
        return this.getFallbackRoster();
      }
    });
  }

  // Get player statistics for current season
  async getPlayerStats(playerId, season = '2024-25') {
    return this.getCachedData(`player_stats_${playerId}`, async () => {
      try {
        const url = `${API_CONFIG.NBA_API_BASE}/stats?player_ids[]=${playerId}&seasons[]=${season}`;
        const data = await this.makeAPICall(url);
        
        if (data.data && data.data.length > 0) {
          const stats = data.data[0];
          return {
            gamesPlayed: stats.games_played || 0,
            avgPoints: stats.pts || 0,
            avgRebounds: stats.reb || 0,
            avgAssists: stats.ast || 0,
            avgSteals: stats.stl || 0,
            avgBlocks: stats.blk || 0,
            avgThreePointers: stats.fg3m || 0,
            fieldGoalPercentage: stats.fg_pct || 0,
            threePointPercentage: stats.fg3_pct || 0,
            freeThrowPercentage: stats.ft_pct || 0
          };
        }
        return null;
      } catch (error) {
        console.error(`Error fetching stats for player ${playerId}:`, error);
        return null;
      }
    });
  }

  // Get recent games for a player
  async getPlayerGameLog(playerId, limit = 5) {
    return this.getCachedData(`player_games_${playerId}`, async () => {
      try {
        const url = `${API_CONFIG.NBA_API_BASE}/stats?player_ids[]=${playerId}&per_page=${limit}`;
        const data = await this.makeAPICall(url);
        
        if (data.data && data.data.length > 0) {
          return data.data.map(game => ({
            date: game.game ? game.game.date : 'N/A',
            opponent: game.game ? this.formatOpponent(game.game) : 'N/A',
            pts: game.pts || 0,
            reb: game.reb || 0,
            ast: game.ast || 0,
            threePM: game.fg3m || 0,
            stl: game.stl || 0,
            blk: game.blk || 0
          }));
        }
        return [];
      } catch (error) {
        console.error(`Error fetching game log for player ${playerId}:`, error);
        return [];
      }
    });
  }

  // Format opponent name
  formatOpponent(game) {
    if (!game) return 'N/A';
    
    const homeTeam = game.home_team;
    const visitorTeam = game.visitor_team;
    
    if (homeTeam && visitorTeam) {
      // Determine if Wizards are home or away
      const isWizardsHome = homeTeam.name.toLowerCase().includes('washington') || 
                           homeTeam.name.toLowerCase().includes('wizards');
      
      if (isWizardsHome) {
        return `vs ${visitorTeam.abbreviation}`;
      } else {
        return `@ ${homeTeam.abbreviation}`;
      }
    }
    
    return 'N/A';
  }

  // Fallback roster data (current Wizards players)
  getFallbackRoster() {
    return [
      { id: 1, name: "Jordan Poole", position: "G", height: "6'4\"", weight: "194 lbs" },
      { id: 2, name: "Kyle Kuzma", position: "F", height: "6'9\"", weight: "221 lbs" },
      { id: 3, name: "Malcolm Brogdon", position: "G", height: "6'4\"", weight: "229 lbs" },
      { id: 4, name: "Bilal Coulibaly", position: "F", height: "6'6\"", weight: "195 lbs" },
      { id: 5, name: "Corey Kispert", position: "G", height: "6'6\"", weight: "220 lbs" },
      { id: 6, name: "Tyus Jones", position: "G", height: "6'0\"", weight: "185 lbs" },
      { id: 7, name: "Deni Avdija", position: "F", height: "6'9\"", weight: "210 lbs" },
      { id: 8, name: "Marvin Bagley III", position: "F", height: "6'10\"", weight: "235 lbs" },
      { id: 9, name: "Richaun Holmes", position: "C", height: "6'9\"", weight: "243 lbs" },
      { id: 10, name: "Johnny Davis", position: "G", height: "6'4\"", weight: "195 lbs" },
      { id: 11, name: "Anthony Gill", position: "F", height: "6'8\"", weight: "230 lbs" },
      { id: 12, name: "Jared Butler", position: "G", height: "6'3\"", weight: "193 lbs" }
    ];
  }

  // Get comprehensive player data
  async getPlayerData(playerId) {
    try {
      const [stats, gameLog] = await Promise.all([
        this.getPlayerStats(playerId),
        this.getPlayerGameLog(playerId)
      ]);

      return {
        stats,
        gameLog,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error getting comprehensive data for player ${playerId}:`, error);
      return {
        stats: null,
        gameLog: [],
        lastUpdated: new Date().toISOString()
      };
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache status
  getCacheStatus() {
    const now = Date.now();
    const status = {};
    
    for (const [key, value] of this.cache.entries()) {
      status[key] = {
        age: now - value.timestamp,
        isExpired: (now - value.timestamp) >= this.cacheTimeout
      };
    }
    
    return status;
  }
}

// Create singleton instance
const nbaDataService = new NBADataService();

export default nbaDataService;
