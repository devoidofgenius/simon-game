'use strict';

var nodes = document.querySelectorAll('.btn');
var startBtn = document.querySelector('#start');
var newNumberBtn = document.querySelector('#newNumber');
var displaySequence = document.querySelector('.sequence');
var playerSequence = document.querySelector('.player');
var score = document.querySelector('.count');
var strict = document.querySelector('#strict');
var reset = document.querySelector('.reset');
var mode = document.querySelector('.mode');
var flash = document.querySelector('.flash-msg');

var sequence = [];
var player = [];
var strictMode = false;
var isPlaying = false;
var playerTurn = false;

// Add eventListeners to each node
nodes.forEach(function (node) {
  return node.addEventListener('click', addPlayerTurn);
});

function test() {
  if (playerTurn && player.length !== sequence.length) {
    console.log("Click");
  }
}
// When node is clicked
function addPlayerTurn(e) {
  if (playerTurn && player.length !== sequence.length) {
    player.push(Number(e.target.dataset.btn));
    var audio = document.querySelector('audio[data-sound="' + player[player.length - 1] + '"]');
    if (audio) audio.currentTime = 0;
    if (audio) audio.play();
    var button = document.querySelector('.btn[data-btn="' + player[player.length - 1] + '"]');
    button.classList.add('blink');
    button.addEventListener('transitionend', function (e) {
      button.classList.remove('blink');
    });

    updateScore();
    checkPlayerMove();
  }
}

// Generate random number between 1-4
function randomNum() {
  return Math.floor(Math.random() * 4) + 1;
}

// Add a random number the the seqence
function addNumber() {
  sequence.push(randomNum());
}

// Play
function playGame() {
  console.log("play");
  setTimeout(function () {
    addNumber();
    player = [];
    playSound();
    updateScore();
  }, 1000);
}

// Play
function replay() {
  console.log("replay");
  setTimeout(function () {
    player = [];
    playSound();
    updateScore();
    flash.classList.remove('animate');
  }, 2000);
}

function tryAgain_flash() {
  flash.innerHTML = "Try Again";
  flash.classList.add('animate');
}

function gameOver_flash() {
  flash.innerHTML = "Game Over";
  flash.classList.add('animate');
}

function winner_flash() {
  flash.innerHTML = "You Won!";
  flash.classList.add('animate');
}

// Check if the players move matches the sequence
function checkPlayerMove() {
  var winner = player.length === 20 && player[player.length - 1] === sequence[sequence.length - 1];

  if (player.length !== sequence.length) {
    player.map(function (value, index) {

      if (!strictMode && value !== sequence[index]) {
        console.log('!StrictMode && ' + value + ' !== ' + sequence[index]);
        document.querySelector('audio[data-sound="tryagain"').play();
        tryAgain_flash();
        replay();
      } else if (strictMode && value !== sequence[index]) {
        console.log('StrictMode && ' + value + ' !== ' + sequence[index]);
        document.querySelector('audio[data-sound="gameover"').play();
        gameOver_flash();
        resetGame();
      } else {
        return;
      }
    });
  } else {
    if (winner) {
      resetGame();
      setTimeout(function () {
        document.querySelector('audio[data-sound="winner"').play();
        winner_flash();
      }, 1000);
    } else if (!strictMode && player[player.length - 1] !== sequence[sequence.length - 1]) {
      document.querySelector('audio[data-sound="tryagain"').play();
      tryAgain_flash();
      replay();
    } else if (strictMode && player[player.length - 1] !== sequence[sequence.length - 1]) {
      document.querySelector('audio[data-sound="gameover"').play();
      gameOver_flash();
      resetGame();
    } else {
      playGame();
    }
  }
}

// Reset Game
function resetGame() {
  console.log("resetGame");
  setTimeout(function () {
    sequence = [];
    player = [];
    strictMode = false;
    isPlaying = false;
    playerTurn = false;
    updateScore();
    checkBtnStatus();
    flash.classList.remove('animate');
  }, 1000);
}

// Plays sounds for sequence
function playSound() {
  var _loop = function _loop(i) {
    (function (index) {
      setTimeout(function () {
        var audio = document.querySelector('audio[data-sound="' + sequence[index] + '"]');
        var button = document.querySelector('.btn[data-btn="' + sequence[index] + '"]');
        audio.addEventListener('ended', function (e) {});
        button.classList.add('blink');
        button.addEventListener('transitionend', function (e) {
          button.classList.remove('blink');
        });
        audio.currentTime = 0;
        audio.play();
        if (index + 1 === sequence.length) playerTurn = true;
      }, i * 1000);
    })(i);
  };

  for (var i = 0; i < sequence.length; i += 1) {
    _loop(i);
  }
}

// Update Display for Testing
function updateScore() {
  // displaySequence.innerHTML = sequence;
  sequence.length === 0 ? score.innerHTML = 0 : score.innerHTML = sequence.length - 1;
  // playerSequence.innerHTML = player;
  // strictMode === false ? mode.innerHTML = "Strict Mode Off" : mode.innerHTML = "Strict Mode On";
}

function checkBtnStatus() {
  isPlaying ? startBtn.classList.add('on', 'removeClick') : startBtn.classList.remove('on', 'removeClick'); // Toggle startBtn on/off class
  isPlaying ? strict.classList.add('removeClick') : strict.classList.remove('removeClick');
  strictMode ? strict.classList.add('on') : strict.classList.remove('on'); // Toggle strict on/off class
}

// Start Button
startBtn.addEventListener('click', function (e) {
  !isPlaying ? isPlaying = true : isPlaying = false; // Toggle isPlaying
  checkBtnStatus();
  playGame(); // Play Game
});

// Strict mode toggle
strict.addEventListener('click', function (e) {
  strictMode === false ? strictMode = true : strictMode = false; // Toggle strict on/off
  checkBtnStatus();
});

// Reset Button
reset.addEventListener('click', resetGame);