const HIGH_SCORES_KEY = 'pongHighScores';

function getHighScores() {
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES_KEY)) || [];
  return highScores.sort((a, b) => b.score - a.score).slice(0, 10); // Retorna os 10 melhores recordes
}

function saveScore(playerName, score) {
  const highScores = getHighScores();
  const newScore = { name: playerName, score: score };
  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score);
  localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(highScores.slice(0, 10))); // Salva apenas os 10 melhores
}


