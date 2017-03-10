window.onload = function() {
    Game.initialize();
    $('#New-Game').on('click', AppController.onClickNewGame);
    $('#eightBitButton').on('click', AppController.onClickTheme);
    $('#vaporWaveButton').on('click', AppController.onClickTheme);
    $('#seinfeldButton').on('click', AppController.onClickTheme);
    $('#adultSwimButton').on('click', AppController.onClickTheme);
    $('#gameOfThronesButton').on('click', AppController.onClickTheme);

};

var player1 = {
    name: "Deadpool",
    score: 0,
}

var player2 = {
    name: "Skeletor",
    score: 0,
}

const Themes = {
    eightBit: {
        font: 'eightBit',
        player1img: '<img src="images/deadpool.svg">',
        player2img: '<img src="images/skeletorgif.gif">',
        background: 'url("images/stars.png")',
        player1Name: 'Deadpool',
        player2Name: 'Skeletor',
        playingSound: 'eightBitSound'
    },

    vaporWave: {
        // font: 'alienEncountersItalic',
        font: 'vcrAesthetic',
        player1img: '<img src="images/vaporwavePlaystation.gif">',
        player2img: '<img src="images/vaporwaveCars.gif">',
        background: 'url("images/vaporwaveWallpaper.jpg")',
        player1Name: 'リサフランク420',
        player2Name: '現代のコンピュー',
        playingSound: 'vaporwaveSound'
    },

    seinfeld: {
        font: 'seinfeld',
        // player1img: '<img src="images/kramer.jpg">',
        player1img: '<img src="images/kramergif.gif">',
        player2img: '<img src="images/jerryIcon.jpg">',
        background: 'url("images/seinfeldGeorgeBackground.jpg")',
        player1Name: 'Kramer',
        player2Name: 'Jerry',
        playingSound: 'seinfeldSound'
    },

    adultSwim: {
        font: 'adultSwim',
        player1img: '<img src="images/adultSwimAlien1.gif">',
        player2img: '<img src="images/adultSwimAlien3.gif">',
        background: 'url("images/adultSwimBackground.jpg")',
        // background: 'url("images/adultSwimBackground2.png")',
        player1Name: 'Ignignokt',
        player2Name: 'Err',
        playingSound: 'adultSwimSound',
    },

    gameOfThrones: {
        font: 'gameOfThrones',
        player1img: '<img src="images/hodor.gif">',
        player2img: '<img src="images/joffrey.gif">',
        background: 'url("images/gameOfThronesBackground.jpg")',
        player1Name: 'Hodor',
        player2Name: 'Joffrey',
        playingSound: 'gameOfThronesSound',
    }

}

const Game = {
    gameBoard: [[], [], [], [], [], [], []],
    startingTurn: player1.name,
    currentTurn: player1.name,
    currentTheme: Themes.eightBit,
    currentSong: 'eightBitSound',
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
        $('.jumbotron h1').html(`${this.startingTurn}'s Turn!`);
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
        //make audio file play
        document.getElementById(this.currentSong).play();
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
        this.winner = false;
        if (this.startingTurn === player1.name) {
            this.startingTurn = player2.name;
            this.currentTurn = player2.name;
        } else {
            this.currentTurn = player1.name;
        }
        this.initialize();
    },

    updateTheme: function(theme) {
        // update player values first for future moves
        player1.name = theme.player1Name;
        player2.name = theme.player2Name;
        //update Game object values pertaining to players
        // check if currentTurn/startingTurn is player1 or 2 by looking at
        // "previous" theme

        var oldPlayer1Name = this.currentTheme.player1Name;
        var oldPlayer2Name = this.currentTheme.player2Name;

        if (this.currentTurn === oldPlayer1Name) {
            this.currentTurn = player1.name;
        } else {this.currentTurn = player2.name;}

        if (this.startingTurn === oldPlayer1Name) {
            this.startingTurn = player1.name;
        } else {this.startingTurn = player2.name;}

        // update images for all cells before updating Game.currentTheme
        Presenter.updateThemeDisplay(theme);
        this.currentTheme = theme;
        this.currentSong = theme.playingSound;
    }
}


const Presenter = {
    moveDisplay: function(cell) {
        var $header = $('.jumbotron h1');
        cell.removeClass('animated infinite');
        if (Game.currentTurn === player1.name) {
            cell.addClass('animated fadeInDownBig');
            // cell.html('<img src="images/deadpool.svg">');
            cell.html(Game.currentTheme.player1img);
            $header.html(`${player2.name}'s Turn!`);
        } else {
            cell.addClass('animated fadeInDownBig');
            cell.html(Game.currentTheme.player2img);
            // cell.html('<img src="images/flash.svg">');
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
            console.log('else statement ran');
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
    },

    updateThemeDisplay: function(theme) {
        var oldPlayer1Name = Game.currentTheme.player1Name;
        var oldPlayer2Name = Game.currentTheme.player2Name;
        // loop over all the gameboard nodes
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 6; j++) {
                var position = `#pos${i}-${j}`;
                var cell = $(position);
                console.log(cell.attr('player'));
                if (cell.attr('player') === oldPlayer1Name) {
                    cell.attr('player', player1.name);
                    cell.html(theme.player1img);
                } else if (cell.attr('player') === oldPlayer2Name) {
                    cell.attr('player', player2.name);
                    cell.html(theme.player2img);
                }
            }
        }

        // change background
        $('body').css('background-image', theme.background);

        // change font
        $('body').css('font-family', theme.font);

        // change header and score display
        var $header = $('.jumbotron h1');
        if (Game.currentTurn === theme.player1Name) {
            $header.html(`${theme.player1Name}'s Turn!`);
        } else {$header.html(`${theme.player2Name}'s Turn!`);}

        $('#player1NameScore').html(`${theme.player1Name}`);
        $('#player2NameScore').html(`${theme.player2Name}`);

        //custom css changes
        switch (theme) {
            case Themes.vaporWave:
                // $('body').css('background-repeat', 'no-repeat repeat');
                $('body').css('background-repeat', 'repeat-y');
                $('body').css('background-position', 'center');
                // $('body').css('color', 'rgb(78, 192, 152)');
                $('body').css('color', 'white');
                break;

            case Themes.eightBit:
                $('body').css('background-repeat', 'repeat-y');
                $('body').css('background-position', 'none');
                $('body').css('color', '#fff');
                break;

            case Themes.seinfeld:
                $('body').css('background-repeat', 'repeat-y');
                $('body').css('background-position', 'center');
                // $('body').css('color', 'red');
                break;

            case Themes.adultSwim:
                $('body').css('background-repeat', 'repeat repeat');
                // $('body').css('background-repeat', 'repeat-x');
                $('body').css('background-position', 'center');
                break;

            case Themes.gameOfThrones:
                $('body').css('background-repeat', 'no-repeat');
                $('body').css('background-position', 'center');
                break;
        }


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
    },

    onClickTheme: function() {
        var key = $(this).attr('key');
        var theme = Themes[key];
        Game.updateTheme(theme);
    }
}
