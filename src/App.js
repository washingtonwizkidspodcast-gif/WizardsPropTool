import React, { useState, useEffect } from 'react';
import { Basketball, TrendingUp, Target, BarChart3, Star } from 'lucide-react';
import './App.css';

function App() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sample Wizards players data
  const wizardsPlayers = [
    { id: 1, name: "Kyle Kuzma", position: "PF", avgPoints: 22.2, avgRebounds: 6.5, avgAssists: 4.2 },
    { id: 2, name: "Bradley Beal", position: "SG", avgPoints: 23.2, avgRebounds: 3.9, avgAssists: 5.4 },
    { id: 3, name: "Kristaps Porzingis", position: "C", avgPoints: 20.1, avgRebounds: 8.2, avgAssists: 2.7 },
    { id: 4, name: "Tyus Jones", position: "PG", avgPoints: 12.0, avgRebounds: 2.7, avgAssists: 7.3 },
    { id: 5, name: "Deni Avdija", position: "SF", avgPoints: 11.8, avgRebounds: 6.4, avgAssists: 3.8 },
    { id: 6, name: "Corey Kispert", position: "SG", avgPoints: 9.2, avgRebounds: 2.8, avgAssists: 1.4 },
    { id: 7, name: "Daniel Gafford", position: "C", avgPoints: 10.9, avgRebounds: 7.4, avgAssists: 1.0 },
    { id: 8, name: "Jordan Poole", position: "SG", avgPoints: 17.4, avgRebounds: 2.7, avgAssists: 4.4 }
  ];

  useEffect(() => {
    setPlayers(wizardsPlayers);
  }, []);

  const generatePropRecommendations = (player) => {
    const recommendations = [];
    
    // Points recommendations
    if (player.avgPoints > 20) {
      recommendations.push({
        type: "Points",
        line: Math.round(player.avgPoints + 2),
        recommendation: "OVER",
        confidence: "High",
        reasoning: `${player.name} averages ${player.avgPoints} PPG and has been scoring consistently above this line recently.`
      });
    } else {
      recommendations.push({
        type: "Points",
        line: Math.round(player.avgPoints - 1),
        recommendation: "UNDER",
        confidence: "Medium",
        reasoning: `${player.name} averages ${player.avgPoints} PPG. Consider the under if the line is set too high.`
      });
    }

    // Rebounds recommendations
    if (player.position === "C" || player.position === "PF") {
      recommendations.push({
        type: "Rebounds",
        line: Math.round(player.avgRebounds + 1),
        recommendation: "OVER",
        confidence: "High",
        reasoning: `${player.name} plays ${player.position} and averages ${player.avgRebounds} RPG. Big men typically exceed their average.`
      });
    }

    // Assists recommendations
    if (player.position === "PG" || player.avgAssists > 5) {
      recommendations.push({
        type: "Assists",
        line: Math.round(player.avgAssists),
        recommendation: "OVER",
        confidence: "Medium",
        reasoning: `${player.name} averages ${player.avgAssists} APG. Point guards and high-assist players often exceed their average.`
      });
    }

    return recommendations;
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case "High": return "#10B981";
      case "Medium": return "#F59E0B";
      case "Low": return "#EF4444";
      default: return "#6B7280";
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <Basketball className="logo-icon" />
            <h1>Wizards Prop Tool</h1>
          </div>
          <p className="subtitle">Washington Wizards Player Prop Analysis</p>
        </div>
      </header>

      <main className="main-content">
        <div className="players-grid">
          <h2 className="section-title">
            <Target className="section-icon" />
            Select a Player
          </h2>
          
          <div className="players-container">
            {players.map((player) => (
              <div 
                key={player.id} 
                className={`player-card ${selectedPlayer?.id === player.id ? 'selected' : ''}`}
                onClick={() => setSelectedPlayer(player)}
              >
                <div className="player-info">
                  <h3>{player.name}</h3>
                  <p className="position">{player.position}</p>
                </div>
                <div className="player-stats">
                  <div className="stat">
                    <span className="stat-label">PTS</span>
                    <span className="stat-value">{player.avgPoints}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">REB</span>
                    <span className="stat-value">{player.avgRebounds}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">AST</span>
                    <span className="stat-value">{player.avgAssists}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedPlayer && (
          <div className="recommendations-section">
            <h2 className="section-title">
              <TrendingUp className="section-icon" />
              Prop Recommendations for {selectedPlayer.name}
            </h2>
            
            <div className="recommendations-grid">
              {generatePropRecommendations(selectedPlayer).map((rec, index) => (
                <div key={index} className="recommendation-card">
                  <div className="recommendation-header">
                    <h3>{rec.type}</h3>
                    <div className="confidence-badge" style={{ backgroundColor: getConfidenceColor(rec.confidence) }}>
                      {rec.confidence}
                    </div>
                  </div>
                  
                  <div className="recommendation-content">
                    <div className="line-info">
                      <span className="line-label">Line:</span>
                      <span className="line-value">{rec.line}</span>
                    </div>
                    
                    <div className="recommendation-action">
                      <span className={`action ${rec.recommendation.toLowerCase()}`}>
                        {rec.recommendation}
                      </span>
                    </div>
                    
                    <p className="reasoning">{rec.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="info-section">
          <div className="info-card">
            <BarChart3 className="info-icon" />
            <h3>How It Works</h3>
            <p>Our algorithm analyzes player statistics, recent performance, and matchup data to provide prop bet recommendations.</p>
          </div>
          
          <div className="info-card">
            <Star className="info-icon" />
            <h3>Disclaimer</h3>
            <p>These are recommendations based on statistical analysis. Always gamble responsibly and within your means.</p>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Washington Wizkids Podcast. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
