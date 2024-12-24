export function saveHighScore(score) {
    const currentHighScore = localStorage.getItem('highScore');
    
    if (!currentHighScore || score < parseInt(currentHighScore, 10)) {
        localStorage.setItem('highScore', score);
    }
  }

export function loadHighScore() {
    const highScore = localStorage.getItem('highScore');
    if (highScore) {
        return parseInt(highScore, 10);
    } else {
        return 0;
    }
}