// Variáveis para a bola
let ballX, ballY, ballSpeedX, ballSpeedY;
let ballRadius = 15;
 
// Variáveis para as raquetes
let paddleWidth = 10, paddleHeight = 100;
let leftPaddleY, rightPaddleY;
let leftPaddleSpeed = 10, rightPaddleSpeed = 10;
 
// Pontuação
let leftScore = 0, rightScore = 0;

// Variáveis para o sistema de recordes
let gameEnded = false;
let highScores = [];
let showHighScores = true;

// Constantes para o banco de dados
const HIGH_SCORES_KEY = 'pongHighScores';

function setup() {
  createCanvas(800, 400);
  // Inicializa a posição da bola
  ballX = width / 2;
  ballY = height / 2;
  ballSpeedX = 5;
  ballSpeedY = 4;
  // Inicializa as posições das raquetes
  leftPaddleY = height / 2 - paddleHeight / 2;
  rightPaddleY = height / 2 - paddleHeight / 2;
  
  // Carrega os recordes salvos
  loadHighScores();
}

function draw() {
  background(0);
  
  // Desenha a tabela de recordes no canto superior direito
  if (showHighScores) {
    drawHighScoresTable();
  }
  
  // Desenha a bola
  fill(255);
  ellipse(ballX, ballY, ballRadius * 2);
  
  // Desenha as raquetes
  rect(20, leftPaddleY, paddleWidth, paddleHeight);
  rect(width - 30, rightPaddleY, paddleWidth, paddleHeight);
  
  // Atualiza a posição da bola
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  
  // Rebote no topo e base
  if (ballY - ballRadius < 0 || ballY + ballRadius > height) {
    ballSpeedY *= -1;
  }
  
  // Checa colisão com a raquete esquerda
  if (ballX - ballRadius < 30 && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
    ballSpeedX *= -1;
  }
  
  // Checa colisão com a raquete direita
  if (ballX + ballRadius > width - 30 && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
    ballSpeedX *= -1;
  }
  
  // Verifica se a bola saiu pela esquerda (ponto para a direita)
  if (ballX - ballRadius < 0) {
    rightScore++;
    resetBall();
    checkForNewRecord();
  }
  
  // Verifica se a bola saiu pela direita (ponto para a esquerda)
  if (ballX + ballRadius > width) {
    leftScore++;
    resetBall();
    checkForNewRecord();
  }
  
  // Movimento das raquetes
  if (keyIsDown(87)) { // 'W' para cima
    leftPaddleY -= leftPaddleSpeed;
  }
  if (keyIsDown(83)) { // 'S' para baixo
    leftPaddleY += leftPaddleSpeed;
  }
  if (keyIsDown(UP_ARROW)) { // Seta para cima
    rightPaddleY -= rightPaddleSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) { // Seta para baixo
    rightPaddleY += rightPaddleSpeed;
  }
  
  // Limita as raquetes dentro da tela
  leftPaddleY = constrain(leftPaddleY, 0, height - paddleHeight);
  rightPaddleY = constrain(rightPaddleY, 0, height - paddleHeight);
  
  // Exibe a pontuação
  fill(255);
  textSize(32);
  text(leftScore, width / 4, 50);
  text(rightScore, (3 * width) / 4, 50);
}

function resetBall() {
  ballX = width / 2;
  ballY = height / 2;
  ballSpeedX *= random() > 0.5 ? 1 : -1; // Aleatório para o lado inicial
  ballSpeedY = random(-4, 4);
}

// Funções do banco de dados
function loadHighScores() {
  const savedScores = localStorage.getItem(HIGH_SCORES_KEY);
  if (savedScores) {
    highScores = JSON.parse(savedScores);
  } else {
    highScores = [];
  }
}

function saveHighScore(playerName, score) {
  const newScore = { name: playerName, score: score };
  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score);
  highScores = highScores.slice(0, 10); // Mantém apenas os 10 melhores
  localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(highScores));
}

function checkForNewRecord() {
  const maxScore = Math.max(leftScore, rightScore);
  
  // Verifica se alguém chegou a 10 pontos (fim do jogo)
  if (maxScore >= 10 && !gameEnded) {
    gameEnded = true;
    const winner = leftScore > rightScore ? "Jogador Esquerdo" : "Jogador Direito";
    const winnerScore = Math.max(leftScore, rightScore);
    
    // Verifica se é um novo recorde
    if (highScores.length < 10 || winnerScore > highScores[highScores.length - 1].score) {
      const playerName = prompt(`Novo recorde! ${winner} fez ${winnerScore} pontos. Digite seu nome:`);
      if (playerName && playerName.trim() !== "") {
        saveHighScore(playerName.trim(), winnerScore);
      }
    }
    
    // Reinicia o jogo após 3 segundos
    setTimeout(() => {
      leftScore = 0;
      rightScore = 0;
      gameEnded = false;
      resetBall();
    }, 3000);
  }
}

function drawHighScoresTable() {
  // Fundo da tabela
  fill(0, 0, 0, 150);
  rect(width - 200, 10, 190, 220);
  
  // Título da tabela
  fill(255, 255, 0);
  textSize(16);
  textAlign(CENTER);
  text("RECORDES", width - 105, 30);
  
  // Cabeçalho da tabela
  fill(255);
  textSize(12);
  textAlign(LEFT);
  text("Pos", width - 190, 50);
  text("Nome", width - 160, 50);
  text("Pontos", width - 80, 50);
  
  // Linha separadora
  stroke(255);
  line(width - 190, 55, width - 20, 55);
  noStroke();
  
  // Exibe os recordes
  for (let i = 0; i < Math.min(highScores.length, 8); i++) {
    const y = 75 + i * 18;
    fill(255);
    textAlign(LEFT);
    text(i + 1, width - 190, y);
    
    // Limita o nome a 8 caracteres
    const displayName = highScores[i].name.length > 8 ? 
                       highScores[i].name.substring(0, 8) + "..." : 
                       highScores[i].name;
    text(displayName, width - 160, y);
    text(highScores[i].score, width - 80, y);
  }
  
  // Instruções
  fill(200);
  textSize(10);
  textAlign(CENTER);
  text("Pressione 'H' para ocultar/mostrar", width - 105, 210);
}

// Controle para mostrar/ocultar a tabela de recordes
function keyPressed() {
  if (key === 'h' || key === 'H') {
    showHighScores = !showHighScores;
  }
}

