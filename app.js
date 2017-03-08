
window.onload = function() {
  Game.initialize();
  $('#New-Game').on('click', AppController.onClickNewGame);
};

var player1 = {
  name: "Deadpool",
  score: 0
}
var player2 = {
  name: "The Flash",
  score: 0
}

const Game = {
  gameBoard: [[], [], [], [], [], [], []],
  currentTurn: player1.name,
  winner: false,
  initialize: function() {
    // initialize gameBoard
    //apply basic attributes and functionality to all positions
    for (var i = 0; i < 7; i++) {
      for (var j = 0; j < 6; j++) {
        var position = `pos${i}-${j}`;
        this.gameBoard[i][j] = document.getElementById(position);
        this.gameBoard[i][j].setAttribute('player', "");
        this.gameBoard[i][j].setAttribute('valid', false);
        this.gameBoard[i][j].className += ' animated infinite tada';
        this.gameBoard[i][j].addEventListener('click', AppController.onClickMove);
        $('.cell').removeClass('valid');
      }
    }
    //make bottom cells valid
    for (var k = 0; k < 7; k++) {
      var $cell = $(`#pos${k}-0`);
      $cell.attr('valid', true)
           .addClass('valid');
    }
  },

  move: function(x, y) {
    var $currentCell = $(`#pos${x}-${y}`);
    $currentCell.attr('valid', false)
                .attr('player', this.currentTurn)
                .removeClass('valid');
    x = parseInt(x);
    y = parseInt(y);

    //cant update the cell above it if there is none
    if (y < 5) {
      var $nextCell = $(`#pos${x}-${y+1}`);
      $nextCell.attr('valid', true)
               .addClass('valid');
    }

    //run UI function that changes the display
    Presenter.moveDisplay($currentCell);
    //run data function that checks if someone has won
    this.checkWinningCombinations(x, y, this.currentTurn);
    //update the currentTurn value
    this.updateTurn();
  },

  updateTurn: function() {
    if (this.currentTurn === player1.name) {
      this.currentTurn = player2.name;
    } else {this.currentTurn = player1.name;}
  },

  isWinningCombination: function(combination, player) {
    for (var i = 0; i < 4; i++) {
      if (combination[i].getAttribute('player') !== player) {
        return '';
      }
    }
    this.winner = true;
    if (this.currentTurn === player1.name) {
      player1.score++;
    } else {player2.score++;}

    Presenter.gameOverDisplay(player);
  },

  checkWinningCombinations: function(x, y, player) {
    // check every possible row combination
    //four possible row combinations regardless of where the tile is placed
    //i.e (0,0) -> (3,0), (1,0) -> (4,0), (2,0) -> (5,0), (3,0) -> (6,0)
    //iterate three times, within each iteration add the current cell plus three more
    for (var i = 0; i < 4; i++) {
      var tempRow = [];
      for (var j = i; j < i + 4; j++) {
        tempRow.push(this.gameBoard[j][y]);
      }
      this.isWinningCombination(tempRow, player);
    }

    // check the only possible column combination
    var tempCol = [];
    if (y >= 3) {
      for (var j = y - 3; j < y + 1; j++) {
        tempCol.push(this.gameBoard[x][j]);
      }
      this.isWinningCombination(tempCol, player);
    }

    // check all the positive sloped diagonals
    //first check for danger zone (i.e. no right hand diagonal available)
    if (!((x <= y - 3) && (y >= 3)) && !((x >= 4) && (y <= x - 4))) {
      // now we can check right hand diagonals
      // first compute lowest starting position for diagonal
      var i = x;
      var j = y;
      while (i > 0 && j > 0) {
        i--;
        j--;
      }
      var startX = i;
      var startY = j;
      // have to loop over while preserving value of starting points so that
      // you can check up to three diagonals
      while (startX <= 3 && startY <= 2) {
        var tempDiag = [];
        // make a loop that iterates 4 times so we can check the combination
        var rowIndex = startX;
        var colIndex = startY;
        for (var k = 0; k < 4; k++) {
          tempDiag.push(this.gameBoard[rowIndex][colIndex]);
          rowIndex++;
          colIndex++;
        }
        // check if this diagonal is a winner
        this.isWinningCombination(tempDiag, player);
        //restart while loop but have our starting positions incremented
        // along a positively sloped diagonal
        // rowIndex and colIndex will update too
        startX++;
        startY++;
      }
    }

    // cleared positive diagonal checks
    // now check all negatively sloped diagonals
    // first check for danger zone
    if (!(x <= 2 && y < (-x + 3)) &&
       !(((4 < x) && (x <= 6)) && (y < (-x + 10)))) {
      //no longer in danger zone
      // find starting point
      var i = x;
      var j = y;
      while (i < 6 && j > 0) {
        i++;
        j--;
      }
      var startX = i;
      var startY = j;
      while (startX >= 3 && startY <= 2) {
        var tempDiag = [];
        var rowIndex = startX;
        var colIndex = startY;
        //iterate 4 times
        for (var k = 0; k < 4; k++) {
          tempDiag.push(this.gameBoard[rowIndex][colIndex]);
          rowIndex--;
          colIndex++;
        }
        //check if this diagonal is a winner
        this.isWinningCombination(tempDiag, player);
        // restart loop but decrement X value and increment Y value
        // like the other diagonal function, loop will run at least once
        // if not in danger zone
        startX--;
        startY++;
      }
    }
  },

  newGame: function() {
    this.gameBoard = [[], [], [], [], [], [], []];
    this.currentTurn = player1.name;
    this.winner = false;
    this.initialize();
  }
}


const Presenter = {
  moveDisplay: function(cell) {
    var $header = $('.jumbotron h1');
    cell.removeClass('animated infinite');
    if (Game.currentTurn === player1.name) {
      cell.addClass('animated fadeInDownBig');
      cell.html('<img src="deadpool.svg">');
      $header.html(`${player2.name}'s Turn!`);
    } else {
      cell.addClass('animated fadeInDownBig');
      cell.html('<img src="flash.svg">');
      $header.html(`${player1.name}'s Turn!`);
    }
  },

  gameOverDisplay: function(player) {
    var modalBody = $('#gameOverModalBody');
    modalBody.append(`<p>${player} wins! Great job!</p>`);
    $('#gameOverModal').modal('show');

    if (player === player1.name) {
      $('#player1Score').html(`${player1.score}`);
    } else {
      $('#player2Score').html(`${player2.score}`);
    }
  },

  resetGameDisplay: function() {
    $('.cell').html('<h4>Click Me</h4>');
    $('.cell').removeClass('animated infinite tada fadeInDownBig')
              .addClass('animated infinite tada');
    var $header = $('.jumbotron h1');
    $header.html(`${Game.currentTurn}'s Turn!`);
    // reset game over modal contents
    var modalBody = $('#gameOverModalBody');
    modalBody.html('');
  }
}


const AppController = {
  onClickMove: function() {
    // check if game is over or not
    if (Game.winner) {
      return '';
    }
    // check if position is valid
    var validAttr = $(this).attr('valid');
    if (validAttr === 'true') {
      var xPos = $(this).attr('id').charAt(3);
      var yPos = $(this).attr('id').charAt(5);
      Game.move(xPos, yPos);
    }
    else {
      $('#invalidMoveModal').modal('show');
    }
  },

  onClickNewGame: function() {
    Game.newGame();
    Presenter.resetGameDisplay();
  }
}


