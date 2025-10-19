import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedProp, setSelectedProp] = useState('Points');
  const [propLine, setPropLine] = useState('20.5');
  const [searchTerm, setSearchTerm] = useState('');
  const [hitRatePeriod, setHitRatePeriod] = useState('Last 20');

  // Sample Wizards players data with more realistic info
  const wizardsPlayers = [
    { 
      id: 1, 
      name: "Kyle Kuzma", 
      position: "PF", 
      experience: "7",
      college: "Utah",
      avgPoints: 22.2, 
      avgRebounds: 6.5, 
      avgAssists: 4.2,
      gameLog: [
        { date: "4/13", opponent: "vs CLE", pts: 7, reb: 3, ast: 2, threePM: 1, stl: 0, blk: 0 },
        { date: "4/11", opponent: "@ MIA", pts: 11, reb: 5, ast: 3, threePM: 2, stl: 1, blk: 0 },
        { date: "4/9", opponent: "vs CHI", pts: 3, reb: 2, ast: 1, threePM: 0, stl: 0, blk: 1 },
        { date: "4/7", opponent: "@ ATL", pts: 15, reb: 4, ast: 2, threePM: 3, stl: 0, blk: 0 },
        { date: "4/5", opponent: "vs NYK", pts: 8, reb: 3, ast: 1, threePM: 1, stl: 1, blk: 0 }
      ]
    },
    { 
      id: 2, 
      name: "Bradley Beal", 
      position: "SG", 
      experience: "12",
      college: "Florida",
      avgPoints: 23.2, 
      avgRebounds: 3.9, 
      avgAssists: 5.4,
      gameLog: [
        { date: "4/13", opponent: "vs CLE", pts: 18, reb: 2, ast: 4, threePM: 2, stl: 1, blk: 0 },
        { date: "4/11", opponent: "@ MIA", pts: 25, reb: 3, ast: 6, threePM: 3, stl: 0, blk: 0 },
        { date: "4/9", opponent: "vs CHI", pts: 22, reb: 4, ast: 5, threePM: 2, stl: 1, blk: 0 },
        { date: "4/7", opponent: "@ ATL", pts: 19, reb: 2, ast: 7, threePM: 1, stl: 0, blk: 0 },
        { date: "4/5", opponent: "vs NYK", pts: 28, reb: 3, ast: 4, threePM: 4, stl: 1, blk: 0 }
      ]
    },
    { 
      id: 3, 
      name: "Kristaps Porzingis", 
      position: "C", 
      experience: "9",
      college: "Latvia",
      avgPoints: 20.1, 
      avgRebounds: 8.2, 
      avgAssists: 2.7,
      gameLog: [
        { date: "4/13", opponent: "vs CLE", pts: 12, reb: 8, ast: 2, threePM: 1, stl: 0, blk: 2 },
        { date: "4/11", opponent: "@ MIA", pts: 16, reb: 10, ast: 3, threePM: 2, stl: 0, blk: 1 },
        { date: "4/9", opponent: "vs CHI", pts: 24, reb: 9, ast: 2, threePM: 3, stl: 0, blk: 3 },
        { date: "4/7", opponent: "@ ATL", pts: 18, reb: 7, ast: 1, threePM: 2, stl: 1, blk: 1 },
        { date: "4/5", opponent: "vs NYK", pts: 22, reb: 11, ast: 3, threePM: 2, stl: 0, blk: 2 }
      ]
    },
    { 
      id: 4, 
      name: "Tyus Jones", 
      position: "PG", 
      experience: "9",
      college: "Duke",
      avgPoints: 12.0, 
      avgRebounds: 2.7, 
      avgAssists: 7.3,
      gameLog: [
        { date: "4/13", opponent: "vs CLE", pts: 8, reb: 2, ast: 9, threePM: 1, stl: 1, blk: 0 },
        { date: "4/11", opponent: "@ MIA", pts: 14, reb: 3, ast: 8, threePM: 2, stl: 0, blk: 0 },
        { date: "4/9", opponent: "vs CHI", pts: 10, reb: 2, ast: 6, threePM: 1, stl: 2, blk: 0 },
        { date: "4/7", opponent: "@ ATL", pts: 16, reb: 4, ast: 10, threePM: 2, stl: 1, blk: 0 },
        { date: "4/5", opponent: "vs NYK", pts: 9, reb: 2, ast: 7, threePM: 1, stl: 0, blk: 0 }
      ]
    },
    { 
      id: 5, 
      name: "Deni Avdija", 
      position: "SF", 
      experience: "4",
      college: "Israel",
      avgPoints: 11.8, 
      avgRebounds: 6.4, 
      avgAssists: 3.8,
      gameLog: [
        { date: "4/13", opponent: "vs CLE", pts: 6, reb: 4, ast: 2, threePM: 0, stl: 1, blk: 0 },
        { date: "4/11", opponent: "@ MIA", pts: 15, reb: 7, ast: 4, threePM: 2, stl: 0, blk: 1 },
        { date: "4/9", opponent: "vs CHI", pts: 9, reb: 5, ast: 3, threePM: 1, stl: 1, blk: 0 },
        { date: "4/7", opponent: "@ ATL", pts: 13, reb: 8, ast: 2, threePM: 1, stl: 0, blk: 0 },
        { date: "4/5", opponent: "vs NYK", pts: 11, reb: 6, ast: 4, threePM: 1, stl: 1, blk: 1 }
      ]
    },
    { 
      id: 6, 
      name: "Corey Kispert", 
      position: "SG", 
      experience: "3",
      college: "Gonzaga",
      avgPoints: 9.2, 
      avgRebounds: 2.8, 
      avgAssists: 1.4,
      gameLog: [
        { date: "4/13", opponent: "vs CLE", pts: 5, reb: 2, ast: 1, threePM: 1, stl: 0, blk: 0 },
        { date: "4/11", opponent: "@ MIA", pts: 12, reb: 3, ast: 2, threePM: 2, stl: 0, blk: 0 },
        { date: "4/9", opponent: "vs CHI", pts: 7, reb: 2, ast: 1, threePM: 1, stl: 1, blk: 0 },
        { date: "4/7", opponent: "@ ATL", pts: 10, reb: 3, ast: 1, threePM: 2, stl: 0, blk: 0 },
        { date: "4/5", opponent: "vs NYK", pts: 8, reb: 2, ast: 1, threePM: 1, stl: 0, blk: 0 }
      ]
    },
    { 
      id: 7, 
      name: "Daniel Gafford", 
      position: "C", 
      experience: "5",
      college: "Arkansas",
      avgPoints: 10.9, 
      avgRebounds: 7.4, 
      avgAssists: 1.0,
      gameLog: [
        { date: "4/13", opponent: "vs CLE", pts: 8, reb: 6, ast: 1, threePM: 0, stl: 0, blk: 2 },
        { date: "4/11", opponent: "@ MIA", pts: 12, reb: 8, ast: 1, threePM: 0, stl: 0, blk: 1 },
        { date: "4/9", opponent: "vs CHI", pts: 6, reb: 5, ast: 0, threePM: 0, stl: 0, blk: 3 },
        { date: "4/7", opponent: "@ ATL", pts: 14, reb: 9, ast: 1, threePM: 0, stl: 1, blk: 1 },
        { date: "4/5", opponent: "vs NYK", pts: 9, reb: 7, ast: 1, threePM: 0, stl: 0, blk: 2 }
      ]
    },
    { 
      id: 8, 
      name: "Jordan Poole", 
      position: "SG", 
      experience: "5",
      college: "Michigan",
      avgPoints: 17.4, 
      avgRebounds: 2.7, 
      avgAssists: 4.4,
      gameLog: [
        { date: "4/13", opponent: "vs CLE", pts: 14, reb: 2, ast: 3, threePM: 2, stl: 1, blk: 0 },
        { date: "4/11", opponent: "@ MIA", pts: 20, reb: 3, ast: 5, threePM: 3, stl: 0, blk: 0 },
        { date: "4/9", opponent: "vs CHI", pts: 16, reb: 2, ast: 4, threePM: 2, stl: 1, blk: 0 },
        { date: "4/7", opponent: "@ ATL", pts: 22, reb: 3, ast: 6, threePM: 4, stl: 0, blk: 0 },
        { date: "4/5", opponent: "vs NYK", pts: 18, reb: 2, ast: 3, threePM: 3, stl: 1, blk: 0 }
      ]
    }
  ];

  useEffect(() => {
    if (wizardsPlayers.length > 0) {
      setSelectedPlayer(wizardsPlayers[0]);
    }
  }, []);

  const filteredPlayers = wizardsPlayers.filter(player =>
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
            />
          </div>

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
                  <p>{player.position} | Exp: {player.experience} | {player.college}</p>
                </div>
              </div>
            ))}
          </div>
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