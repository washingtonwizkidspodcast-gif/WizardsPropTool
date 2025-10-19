import React, { useState, useEffect } from 'react';
import './App.css';
import nbaDataService from './services/nbaDataService';

function App() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedProp, setSelectedProp] = useState('Points');
  const [propLine, setPropLine] = useState('20.5');
  const [searchTerm, setSearchTerm] = useState('');
  const [hitRatePeriod, setHitRatePeriod] = useState('Last 20');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load player data from API
  useEffect(() => {
    const loadPlayerData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get roster from API
        const roster = await nbaDataService.getWizardsRoster();
        
        // Load detailed data for each player
        const playersWithStats = await Promise.all(
          roster.map(async (player) => {
            const playerData = await nbaDataService.getPlayerData(player.id);
            return {
              ...player,
              ...playerData.stats,
              gameLog: playerData.gameLog,
              lastUpdated: playerData.lastUpdated
            };
          })
        );
        
        setPlayers(playersWithStats);
        setLastUpdated(new Date().toISOString());
        
        // Select first player by default
        if (playersWithStats.length > 0) {
          setSelectedPlayer(playersWithStats[0]);
        }
      } catch (err) {
        console.error('Error loading player data:', err);
        setError('Failed to load player data. Using fallback data.');
        
        // Use fallback data
        const fallbackRoster = nbaDataService.getFallbackRoster();
        const fallbackPlayers = fallbackRoster.map(player => ({
          ...player,
          avgPoints: 0,
          avgRebounds: 0,
          avgAssists: 0,
          gameLog: [],
          lastUpdated: new Date().toISOString()
        }));
        
        setPlayers(fallbackPlayers);
        if (fallbackPlayers.length > 0) {
          setSelectedPlayer(fallbackPlayers[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPlayerData();
  }, []);

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const propTypes = [
    'Points', 'Rebounds', 'Assists', '3-Pointers Made', 
    'Steals', 'Blocks', 'Pts+Reb+Ast', 'Pts+Reb', 'Pts+Ast'
  ];

  const combinedProps = ['Reb+Ast'];

  const calculateHitRate = (player, prop, line, period) => {
    if (!player || !player.gameLog) return { hits: 0, total: 0, rate: 0 };
    
    const games = player.gameLog.slice(0, parseInt(period.split(' ')[1]));
    let hits = 0;
    
    games.forEach(game => {
      let value = 0;
      switch(prop) {
        case 'Points':
          value = game.pts;
          break;
        case 'Rebounds':
          value = game.reb;
          break;
        case 'Assists':
          value = game.ast;
          break;
        case '3-Pointers Made':
          value = game.threePM;
          break;
        case 'Steals':
          value = game.stl;
          break;
        case 'Blocks':
          value = game.blk;
          break;
        case 'Pts+Reb+Ast':
          value = game.pts + game.reb + game.ast;
          break;
        case 'Pts+Reb':
          value = game.pts + game.reb;
          break;
        case 'Pts+Ast':
          value = game.pts + game.ast;
          break;
        case 'Reb+Ast':
          value = game.reb + game.ast;
          break;
        default:
          value = game.pts;
      }
      
      if (value > parseFloat(line)) {
        hits++;
      }
    });
    
    return {
      hits,
      total: games.length,
      rate: games.length > 0 ? Math.round((hits / games.length) * 100) : 0
    };
  };

  const hitRateData = selectedPlayer ? calculateHitRate(selectedPlayer, selectedProp, propLine, hitRatePeriod) : { hits: 0, total: 0, rate: 0 };

  const isHit = (game, prop, line) => {
    let value = 0;
    switch(prop) {
      case 'Points':
        value = game.pts;
        break;
      case 'Rebounds':
        value = game.reb;
        break;
      case 'Assists':
        value = game.ast;
        break;
      case '3-Pointers Made':
        value = game.threePM;
        break;
      case 'Steals':
        value = game.stl;
        break;
      case 'Blocks':
        value = game.blk;
        break;
      case 'Pts+Reb+Ast':
        value = game.pts + game.reb + game.ast;
        break;
      case 'Pts+Reb':
        value = game.pts + game.reb;
        break;
      case 'Pts+Ast':
        value = game.pts + game.ast;
        break;
      case 'Reb+Ast':
        value = game.reb + game.ast;
        break;
      default:
        value = game.pts;
    }
    return value > parseFloat(line);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">🎯</div>
            <div className="header-text">
              <h1>WIZARDS PROP TRACKER</h1>
              <p>Player Prop Analysis</p>
            </div>
          </div>
        </div>
      </header>

      <div className="main-layout">
        {/* Left Sidebar */}
        <div className="sidebar">
          <h2 className="sidebar-title">Wizards Roster</h2>
          
          <div className="search-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              placeholder="Find a player..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              disabled={loading}
            />
          </div>

          {loading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading player data...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
              <button 
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="players-list">
              {filteredPlayers.map((player) => (
                <div 
                  key={player.id} 
                  className={`player-card ${selectedPlayer?.id === player.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPlayer(player)}
                >
                  <div className="player-avatar">
                    <div className="avatar-placeholder">👤</div>
                  </div>
                  <div className="player-info">
                    <h3>{player.name}</h3>
                    <p>{player.position} | {player.height || 'N/A'} | {player.weight || 'N/A'}</p>
                    {player.avgPoints !== undefined && (
                      <div className="player-stats-preview">
                        <span>{player.avgPoints.toFixed(1)} PPG</span>
                        <span>{player.avgRebounds.toFixed(1)} RPG</span>
                        <span>{player.avgAssists.toFixed(1)} APG</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {lastUpdated && (
            <div className="last-updated">
              <small>Last updated: {new Date(lastUpdated).toLocaleTimeString()}</small>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="content-area">
          {/* Prop Selection */}
          <div className="prop-selection">
            <h2 className="section-title">Select Prop</h2>
            
            <div className="prop-buttons">
              {propTypes.map((prop) => (
                <button
                  key={prop}
                  className={`prop-button ${selectedProp === prop ? 'active' : ''}`}
                  onClick={() => setSelectedProp(prop)}
                >
                  {prop}
                </button>
              ))}
            </div>
            
            <div className="combined-props">
              {combinedProps.map((prop) => (
                <button
                  key={prop}
                  className={`prop-button ${selectedProp === prop ? 'active' : ''}`}
                  onClick={() => setSelectedProp(prop)}
                >
                  {prop}
                </button>
              ))}
            </div>

            <div className="prop-line-input">
              <label>Prop Line (Over)</label>
              <input
                type="number"
                step="0.5"
                value={propLine}
                onChange={(e) => setPropLine(e.target.value)}
                className="line-input"
              />
            </div>
          </div>

          {/* Player Analysis */}
          {selectedPlayer && (
            <div className="player-analysis">
              <div className="analysis-header">
                <div className="player-details">
                  <h2>{selectedPlayer.name}</h2>
                  <p>Prop analysis for {selectedProp} over {propLine}</p>
                </div>
                
                <div className="hit-rate-box">
                  <div className="hit-rate-buttons">
                    <button 
                      className={hitRatePeriod === 'Last 5' ? 'active' : ''}
                      onClick={() => setHitRatePeriod('Last 5')}
                    >
                      Last 5
                    </button>
                    <button 
                      className={hitRatePeriod === 'Last 10' ? 'active' : ''}
                      onClick={() => setHitRatePeriod('Last 10')}
                    >
                      Last 10
                    </button>
                    <button 
                      className={hitRatePeriod === 'Last 20' ? 'active' : ''}
                      onClick={() => setHitRatePeriod('Last 20')}
                    >
                      Last 20
                    </button>
                  </div>
                  <div className="hit-rate-display">
                    <div className="hit-count">
                      <span className="hits">{hitRateData.hits}</span>
                      <span className="separator"> / </span>
                      <span className="total">{hitRateData.total}</span>
                    </div>
                    <div className="hit-rate-percentage">
                      Hit Rate: {hitRateData.rate}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Log Table */}
              <div className="game-log">
                <table className="game-log-table">
                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>OPPONENT</th>
                      <th>PTS</th>
                      <th>REB</th>
                      <th>AST</th>
                      <th>3PM</th>
                      <th>STL</th>
                      <th>BLK</th>
                      <th>HIT?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPlayer.gameLog.map((game, index) => (
                      <tr key={index}>
                        <td>{game.date}</td>
                        <td>{game.opponent}</td>
                        <td className={selectedProp === 'Points' ? 'highlight-stat' : ''}>{game.pts}</td>
                        <td className={selectedProp === 'Rebounds' ? 'highlight-stat' : ''}>{game.reb}</td>
                        <td className={selectedProp === 'Assists' ? 'highlight-stat' : ''}>{game.ast}</td>
                        <td className={selectedProp === '3-Pointers Made' ? 'highlight-stat' : ''}>{game.threePM}</td>
                        <td className={selectedProp === 'Steals' ? 'highlight-stat' : ''}>{game.stl}</td>
                        <td className={selectedProp === 'Blocks' ? 'highlight-stat' : ''}>{game.blk}</td>
                        <td className="hit-column">
                          {isHit(game, selectedProp, propLine) ? (
                            <span className="hit-icon">✓</span>
                          ) : (
                            <span className="miss-icon">✗</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;