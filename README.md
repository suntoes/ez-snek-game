<img src="https://github.com/suntoes/ez-snek-game/blob/master/resources/logo.png" alt="snek logo" width="120"/>

# ez-snek-game

### [click here for github demo](https://suntoes.github.io/ez-snek-game/)

<a href="https://suntoes.github.io/ez-snek-game/">
<img src="https://github.com/suntoes/ez-snek-game/blob/master/resources/gameplay.png" alt="gameplay" width="240"/>
</a>

## My first personal project, from zero...
Made this possible because a redditor recommended me some DOM documentation. From there I figured out that I've been learning html, css, javascript & bits of react for the past 3 months without hearing about DOM first. 

Few days after that, exactly just when I've finished the introduction part of the documentation to DOM, I had got to coding right away, and this is the result of my recent code spree redemption.

## ez snek's top 3 syntax are...
<details>
  <summary>DOM Manipulation</summary>

```javascript
//line 164, detects cell if snake or apple, recalled to draw function.
function detectSnakeOrApple(cell, index) {
  
    if(snakeIndex.some(x => x === i)) {
        if(i === snakeIndex[0]) {
            //DOM manipulation stars here
            cell.classList.add('cell-head');
            cell.innerHTML = ':';
            let numDeg = moveUp ? 90 : moveRight ? 180 : moveDown ? 270 : 0
            cell.style.transform = `rotate(${numDeg}deg)`
        };    
        cell.style.backgroundColor = '#4df163';
    }   else if(i === appleIndex) {
            cell.style.backgroundColor = '#ff5959';
        };
};
```

</details>
<details>
  <summary>Array Iteration</summary>

```javascript  
// line 136, generates the first board, under draw function.
if (boardDiv.innerHTML === '') {
    // array iteration starts here
    board.forEach(( e, i) => {
        const cell = document.createElement('div');
        boardDiv.appendChild(cell);
        cell.id = i;
        cell.classList.add('cells');
        cell.style.backgroundColor = '#212121';
        detectSnakeOrApple(cell, i);
    });
};
```
  
</details>
<details>
  <summary>setInterval()</summary>

```javascript
// line 205, recalls renderBoard() for every speed in milliseconds, under gameOn function.
let interval = setInterval(() => renderBoard(), speed);
  
// ps. renderBoard and draw function is different.
// renderBoard() renders the board with game rule tests and calls draw() if passed.
```

</details>

## What I've learned is...
There are hella lot of real deal hefty documentation out there that I've got to read.
