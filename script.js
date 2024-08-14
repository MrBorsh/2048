document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const newGameButton = document.getElementById('new-game');
    let score = 0;
    const width = 4;
    let squares = [];
    let gameOver = false;

    // Create board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.classList.add('tile');
            square.dataset.x = Math.floor(i / width);
            square.dataset.y = i % width;
            gridDisplay.appendChild(square);
            squares.push(square);
        }
        generateRandomTile();
        generateRandomTile();
    }

    // Generate a random tile (2 or 4)
    function generateRandomTile() {
        let randomNumber = Math.floor(Math.random() * squares.length);
        if (squares[randomNumber].innerHTML === '') {
            squares[randomNumber].innerHTML = Math.random() < 0.9 ? 2 : 4;
            squares[randomNumber].classList.add('new');
            squares[randomNumber].style.setProperty('--x', '0px');
            squares[randomNumber].style.setProperty('--y', '0px');
            setTimeout(() => squares[randomNumber].classList.remove('new'), 200);
            setTileColor(squares[randomNumber]);
            checkForGameOver();
        } else generateRandomTile();
    }

    // Set tile color based on value
    function setTileColor(tile) {
        tile.dataset.value = tile.innerHTML;
    }

    // Move tiles and add merging animation
    function moveAndMerge(direction) {
        let moved = false;
        let merged = [];
        
        function moveAndMergeTiles(startIndex, endIndex, step) {
            for (let i = startIndex; i !== endIndex; i += step) {
                let x = Math.floor(i / width);
                let y = i % width;
                let nextX = x + (direction === 'up' ? -1 : direction === 'down' ? 1 : 0);
                let nextY = y + (direction === 'left' ? -1 : direction === 'right' ? 1 : 0);
                let currentIndex = x * width + y;
                let nextIndex = nextX * width + nextY;

                if (nextX >= 0 && nextX < width && nextY >= 0 && nextY < width) {
                    if (squares[nextIndex].innerHTML === '') {
                        if (squares[currentIndex].innerHTML !== '') {
                            squares[nextIndex].innerHTML = squares[currentIndex].innerHTML;
                            squares[currentIndex].innerHTML = '';
                            moved = true;
                            squares[nextIndex].style.setProperty('--x', '0px');
                            squares[nextIndex].style.setProperty('--y', '0px');
                        }
                    } else if (squares[nextIndex].innerHTML === squares[currentIndex].innerHTML && !merged.includes(nextIndex)) {
                        squares[nextIndex].innerHTML = parseInt(squares[nextIndex].innerHTML) * 2;
                        squares[currentIndex].innerHTML = '';
                        score += parseInt(squares[nextIndex].innerHTML);
                        scoreDisplay.innerHTML = score;
                        merged.push(nextIndex);
                        moved = true;
                        squares[nextIndex].classList.add('merge');
                        setTimeout(() => squares[nextIndex].classList.remove('merge'), 200);
                        squares[nextIndex].style.setProperty('--x', '0px');
                        squares[nextIndex].style.setProperty('--y', '0px');
                    }
                }
            }
        }

        if (direction === 'right') {
            for (let i = 0; i < width * width; i += width) {
                moveAndMergeTiles(i + width - 1, i - 1, -1);
            }
        } else if (direction === 'left') {
            for (let i = 0; i < width * width; i += width) {
                moveAndMergeTiles(i, i + width, 1);
            }
        } else if (direction === 'down') {
            for (let i = width * (width - 1); i >= 0; i -= width) {
                moveAndMergeTiles(i, -1, -width);
            }
        } else if (direction === 'up') {
            for (let i = 0; i < width * (width - 1); i += width) {
                moveAndMergeTiles(i, width * width, width);
            }
        }

        if (moved) generateRandomTile();
    }

    // Key control
    function control(e) {
        if (gameOver) return;
        if (e.keyCode === 39) {
            moveAndMerge('right');
        } else if (e.keyCode === 37) {
            moveAndMerge('left');
        } else if (e.keyCode === 38) {
            moveAndMerge('up');
        } else if (e.keyCode === 40) {
            moveAndMerge('down');
        }
    }

    document.addEventListener('keyup', control);

    // Check for win
    function checkForWin() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 2048) {
                alert('You win!');
                document.removeEventListener('keyup', control);
                gameOver = true;
            }
        }
    }

    // Check for game over
    function checkForGameOver() {
        let zeros = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == '') {
                zeros++;
            }
        }
        if (zeros === 0) {
            alert('Game Over!');
            document.removeEventListener('keyup', control);
            gameOver = true;
        }
    }

    // New Game
    newGameButton.addEventListener('click', () => {
        gridDisplay.innerHTML = '';
        squares = [];
        score = 0;
        scoreDisplay.innerHTML = score;
        gameOver = false;
        createBoard();
        document.addEventListener('keyup', control);
    });

    createBoard();
});
