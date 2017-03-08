var player1 = "Red";
var player2 = "Yellow";

// initialize gameBoard


const Game = {
  gameBoard: [[], [], [], [], [], [], []],
  currentTurn: player1,
  winner: false,
  initialize: function() {
    //apply basic attributes and functionality to all positions
    for (var i = 0; i < 7; i++) {
      for (var j = 0; j < 6; j++) {
        var position = `pos${i}-${j}`;
        this.gameBoard[i][j] = document.getElementById(position);
        this.gameBoard[i][j].setAttribute('player', "");
        this.gameBoard[i][j].setAttribute('valid', false);
        this.gameBoard[i][j].addEventListener('click', AppController.onClickMove);
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
    console.log(this);
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
    if (this.currentTurn === player1) {
      this.currentTurn = player2;
    } else {this.currentTurn = player1;}
  },

  isWinningCombination: function(combination, player) {
    for (var i = 0; i < 4; i++) {
      console.log('combination is: ');
      console.log(combination);
      if (combination[i].getAttribute('player') !== player) {
        console.log(`current combination value is ${combination[i]}`);
        return false;
      }
    }
    return true;
  },

  checkWinningCombinations: function(x, y, player) {
    // check every possible row combination
    //four possible row combinations regardless of where the tile is placed
    //i.e (0,0) -> (3,0), (1,0) -> (4,0), (2,0) -> (5,0), (3,0) -> (6,0)
    //iterate three times, within each iteration add the current value plus three more
    for (var i = 0; i < 4; i++) {
      var tempRow = [];
      for (var j = i; j < i + 4; j++) {
        console.log(`j is ${j}`);
        tempRow.push(this.gameBoard[j][y]);
      }
      if (this.isWinningCombination(tempRow, player)) {
        alert(`Game over! ${player} wins!`);
      }
    }

    // check the only possible column combination
    var tempCol = [];
    if (y >= 3) {
      for (var j = y - 3; j < y + 1; j++) {
        tempCol.push(this.gameBoard[x][j]);
      }
      if (this.isWinningCombination(tempCol, player)) {
        alert(`Game over! ${player} wins!`);
      }
    }
    console.log('cleared column check');
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
        // make a loop that iterates 4 times
        console.log(`starting x coordin is ${startX}, starting y is ${startY}`);
        var rowIndex = startX;
        var colIndex = startY;
        for (var k = 0; k < 4; k++) {
          tempDiag.push(this.gameBoard[rowIndex][colIndex]);
          rowIndex++;
          colIndex++;
        }
        // check if this diagonal is a winner
        if (this.isWinningCombination(tempDiag, player)) {
          alert(`Game over! ${player} wins!`);
        }
        //restart while loop but have our starting positions incremented
        // along a positively sloped diagonal
        // rowIndex and colIndex will update too
        startX++;
        startY++;
      }
    }
    console.log('cleared positve diagonals');
    // now check all negatively sloped diagonals
    // first check for danger zone
    if (!(x <= 2 && y < (-x + 3)) &&
       !(((4 < x) && (x <= 6)) && (y < (-x + 10)))) {
      //no longer in danger zone
      // find starting point
      var i = x;
      var j = y;
      while (i <= 6 && j > 0) {
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
        console.log(`starting x coordin is ${startX}, starting y is ${startY}`);
        for (var k = 0; k < 4; k++) {
          tempDiag.push(this.gameBoard[rowIndex][colIndex]);
          rowIndex--;
          colIndex++;
        }
        //check if this diagonal is a winner
        if (this.isWinningCombination(tempDiag, player)) {
          alert(`Game over! ${player} wins!`);
        }
        // restart loop but decrement X value and increment Y value
        // like the other diagonal function, loop will run at least once
        // if not in danger zone
        startX--;
        startY++;
      }
    }



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
    console.log('clicked');
    if ($(this).attr('valid')) {
      var xPos = $(this).attr('id').charAt(3);
      var yPos = $(this).attr('id').charAt(5);
      console.log(`${xPos}, ${yPos}`);
      Game.move(xPos, yPos);
    }
    else {
      alert('invalid space!');
    }
  },
  onClickNewGame: function() {

  }


}

window.onload = function() {
  Game.initialize();
};
