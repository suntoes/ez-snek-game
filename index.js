// array as board, fixed count
let board = [
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,
]

// elements
let snakeIndex = [67,75];

let appleIndex = 20;
let listOfAppleFree = []

let moveLeft = false;
let moveRight = false;
let moveUp = true;
let moveDown = false;

let speed = 400;

let defPass = true;

// initial draw call
draw(board);

// early DOM configuration
document.querySelector('#game-button').onclick = gameOn;
document.querySelector('#control-toggle').onclick = controlsToggle;
document.querySelectorAll('.controls-button').forEach(btn => btn.onclick = function(){inputKey(btn.id)});

// control essentials
document.addEventListener('keypress', (e) => {
    inputKey(e.key.toLowerCase());
})
function controlsToggle() {
    if (document.querySelector('#control-toggle').innerHTML === "show control buttons?") {
        document.querySelector('#controls-div').style.display = "flex";
        document.querySelector('#control-toggle').innerHTML = "hide control buttons?"
    } else {
        document.querySelector('#controls-div').style.display = "none";
        document.querySelector('#control-toggle').innerHTML = "show control buttons?"
    }
}
function inputKey(key) {
    if (document.querySelector('#game-button').innerHTML !== 'click me to play!') {
        switch(key) {
            case 'w':
                if (snakeIndex[0]-8 === snakeIndex[1]) {
                    break;
                    } else {
                        moveUp = true;
                        moveRight = false;
                        moveLeft = false;
                        moveDown = false;
                }
                break;
            case 'a':
                if (snakeIndex[0]-1 === snakeIndex[1]) {
                    break;
                    } else {
                        moveLeft = true;
                        moveUp = false;
                        moveRight = false;
                        moveDown = false;
                }
                break;
            case 'd':
                if (snakeIndex[0]+1 === snakeIndex[1]) {
                    break;
                    } else {
                        moveRight = true;
                        moveUp = false;
                        moveLeft = false;
                        moveDown = false;
                }
                break;
            case 's':
                if (snakeIndex[0]+8 === snakeIndex[1]) {
                    break;
                    } else {
                        moveDown = true;
                        moveUp = false;
                        moveRight = false;
                        moveLeft = false;
                }
                break;
        };
    }
    
}

// sets new speed
function newSpeed() {
    speed = 400 -(( 1/( board.length/snakeIndex.length) )*200);
}

// sets new list of snake-free index for next apple
function refreshAppleFree() {
    let freeArr = [];
    for (let i = 0; i < board.length; i++) {
        if (!snakeIndex.some(x => x === i)) {
            freeArr.push(i);
        };
    };
    listOfAppleFree = freeArr;
}

// generate random index for next apple
function newAppleIndex() {
    let rndm = Math.floor(Math.random() * (( listOfAppleFree.length -1 )- 0 + 1) + 0);
    return rndm;
}

// resets necessary game elements
function reset() {
    snakeIndex = [75,83];

    appleIndex = 20;
    listOfAppleFree = []

    moveLeft = false;
    moveRight = false;
    moveUp = true;
    moveDown = false;

    speed = 400;

    document.querySelector('#board-div').style.filter = '';
};

// starts the game with setInterval() and renderBoard()
function gameOn() {
    // recalls renderBoard() for every speed in milliseconds
    let interval = setInterval(() => renderBoard(), speed);

    // instruction before first apple gets eaten
    document.querySelector('#game-button').innerHTML = '(w, a, s, d) are the controls!';

    // disable the game button for unnecessary actions
    document.querySelector('#game-button').onclick = '';

    // use of localStorage to clean interval later on other function
    localStorage.clear();
    localStorage.setItem('game-interval', interval);
}

// render the game by the game rules
function renderBoard() {
    // if snake eats apple
    if (snakeMove(snakeIndex[0]) === appleIndex) {
        snakeIndex.unshift(appleIndex)
        refreshAppleFree();
        appleIndex = listOfAppleFree[newAppleIndex()];
        newSpeed();
        // refreshes the render calls for new speed
        gameOff();
        gameOn();
    } else {
        // else if snake dont eats apple
        snakeIndex = snakeIndex.map((pos, i) => i === 0 ? snakeMove(pos): snakeIndex[i-1] );
    }

    // updates control instruction if first apple eaten
    if (snakeIndex.length > 2) {
        document.querySelector('#game-button').innerHTML = 'think one step ahead!';
    }
    
    // win or defeat checker
    winTest();
    defTest();

    if (defPass) {
        draw(board);
    }
}

// stops the game with clearInterval()
function gameOff() {
    clearInterval( localStorage.getItem('game-interval') );
}


function snakeMove(pos) {
    // basic math to move snake in array w/ restrictions
    if (moveUp) {
        return pos-8;
    } else if (moveDown) {
        return pos+8;
    } else if (moveLeft) {
        return pos-1;
    } else if (moveRight) {
        return pos+1;
    }
}

function winTest() {
    // basic logic to detect win win
    if (snakeIndex.length >= board.length) {
        gameOff();
        document.querySelector('#game-button').innerHTML = 'nc! wanna play again?';
        document.querySelector('#game-button').onclick = gameOn;
    }
}

function defTest() {
    // to call if proven lose
    function provenLose() {
        function reZero() {
            reset();
            defPass = true;
            document.querySelector('#game-button').onclick = gameOn;
            document.querySelector('#game-button').innerHTML = 'click me to play!';
            draw(board);
        }
        gameOff();
        document.querySelector('#game-button').innerHTML = 'aw! wanna try again?';
        document.querySelector('#game-button').onclick = reZero;
        document.querySelector('#board-div').onclick = reZero;
        defPass = false;
        document.querySelector('#board-div').style.filter = 'brightness(80%)';
    };

    // some impromptu maths to detect snake move violations
    if (snakeIndex.indexOf(snakeIndex[0]) !== snakeIndex.lastIndexOf(snakeIndex[0])) {
        provenLose();
    } else if (snakeIndex[0] < 0 || snakeIndex[0] > board.length-1) {
        provenLose();
    } else if ((moveLeft && (snakeIndex[0]+1)%8 === 0) || (moveRight && (snakeIndex[0]+8)%8 === 0)) {
        provenLose();
    }
    
}

// resets the #board-div with a new fresh updated divs ;)
function draw(board) {
    document.querySelector('#board-div').innerHTML = '';
    // div checker for snake, apple, and blank cells
    board.forEach(( e, i) => {
    const cell = document.createElement('div');
    document.querySelector('#board-div').appendChild(cell);
    cell.id = i;
    // special add-ons for snake head cell
    if(i === snakeIndex[0]) {
        cell.classList.add('cells')
        cell.classList.add('cell-head')
        cell.innerHTML = ':'
    } else {
        // generic cell
        cell.classList.add('cells')
    };
    // give the life/color to div
    cell.style.backgroundColor = 
        // ternary cause i'm lazy
        snakeIndex.some(x => x === i) ? '#4df163' :
        i === appleIndex ? '#ff5959' :
        '#212121'
    })
    // give the snake head sum cute eyes
    const head = document.getElementById(snakeIndex[0])
    let numDeg = moveUp ? 90 : moveRight ? 180 : moveDown ? 270 : 0
    head.style.transform = `rotate(${numDeg}deg)`
}