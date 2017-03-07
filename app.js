var player1 = "Red";
var player2 = "Yellow";

// initialize gameBoard


const Game = {
  gameBoard: [[], [], [], [], [], []],
  currentTurn: player1,
  winner: false,
  initialize: function() {
    //apply basic attributes and functionality to all positions
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 7; j++) {
        var position = `pos${i}-${j}`;
        this.gameBoard[i][j] = document.getElementById(position);
        this.gameBoard[i][j].setAttribute('player', "");
        this.gameBoard[i][j].setAttribute('valid', false);
        this.gameBoard[i][j].addEventListener('click', AppController.onClickMove);
      }
    }
    //make bottom cells valid
    for (var k = 0; k < 7; k++) {
      var $cell = $(`#pos0-${k}`);
      $cell.attr('valid', true)
           .addClass('valid');
    }
  },

  move: function(x, y) {
    var $currentCell = $(`#pos${x}-${y}`);
    $currentCell.attr('valid', false)
                .attr('player', this.currentTurn);
                .removeClass('valid');
    x = parseInt(x);

    if (x < 5) {
      var $nextCell = $(`#pos${x+1}-${y}`);
      $nextCell.attr('valid', true)
               .addClass('valid');
    }

    Presenter.moveDisplay($currentCell);
    this.checkWinningCombinations(x, y, this.currentTurn);
    this.updateTurn();
  },

  updateTurn: function() {
    if (this.currentTurn === player1) {
      this.currentTurn = player2;
    } else {this.currentTurn = player1;}
  },

  isWinningCombination: function(combination, player) {
    for (var i = 0; i < 4; i++) {
      if (combination[i].getAttribute('player') !== player) {
        return false;
      }
    }
    return true;
  },

  checkWinningCombinations: function(x, y, player) {

  }
}

const Presenter = {
  moveDisplay: function(cell) {
    console.log(cell);
    var $header = $('.jumbotron h1');
    if (Game.currentTurn === player1) {
      cell.html('<img src="red-circle.svg">');
      $header.html(`${player2}'s Turn!`);
    } else {
      cell.html('<img src="yellow-circle.svg">');
      $header.html(`${player1}'s Turn!`);
    }
  },





}

const AppController = {
  onClickMove: function() {
    // check if position is valid
    if ($(this).attr('valid')) {
      var xPos = $(this).attr('id').charAt(3);
      var yPos = $(this).attr('id').charAt(5);
      Game.move(xPos, yPos);
    }
    else {
      alert('invalid space!');
    }
  }


}

window.onload = function() {
  Game.initialize();
};
