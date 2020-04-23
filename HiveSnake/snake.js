const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// box
const box = 32;

// images

const logo = new Image();
logo.src = "img/hiveLogo.png";

const sunHeadImg = new Image();
sunHeadImg.src = "img/justinSun.png";

// snake

let snake = [];
snake [0] = {
    x : 9 * box,
    y: 10 * box
}

// food

let food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y : Math.floor(Math.random() * 15 + 3) * box
}

// sun
let sunHead = [{x: Math.floor(Math.random() * 17 + 1) * box, y: Math.floor(Math.random() * 15 + 3) * box}];

// score

let score = 0;

// snake controls

let d;

document.addEventListener("keydown", move);

function move(event){
    if(event.keyCode == 37 && d != "RIGHT") {
        d = "LEFT";
    }
    else if(event.keyCode == 38 && d != "DOWN") {
        d = "UP";
    }
    else if(event.keyCode == 39 && d != "LEFT") {
        d = "RIGHT";
    }
    else if(event.keyCode == 40 && d != "UP") {
        d = "DOWN";
    }
}

// restart function

function restart() {
    document.removeEventListener("keyup", restart);
    score = 0;
    snake = [];
    snake [0] = {
         x : 9 * box,
         y: 10 * box
     }
    sunHead = [{x: Math.floor(Math.random() * 17 + 1) * box, y: Math.floor(Math.random() * 15 + 3) * box}];
    d = null;
    game = setInterval(draw, 100);
}

// check collision function

function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

// draw grid (1 & 2 for different colours) (two for's for diagonal effect)
function drawGrid1() {
    for (let k = 0; k < 17; k = k +2) {
        for (let i = 0; i < 17; i = i +2) {
             ctx.fillStyle =  "#e7e7f1"; // Hive Grey
             ctx.fillRect(i * box + (1 * box), k * box + (3 * box),box,box);  
        }     
    }
    for (let m = 1; m < 15; m = m +2) {
        for (let n = 1; n < 17; n = n +2) {
             ctx.fillStyle =  "#e7e7f1";
             ctx.fillRect(n * box + (1 * box), m * box + (3 * box),box,box);  
        }     
    }
    
}

function drawGrid2() {
    ctx.fillStyle =  "#f0f0f8"; // Hive LightGrey
    for (let k = 0; k < 17; k = k +2) {
        for (let i = 1; i < 17; i = i +2) {  
             ctx.fillRect(i * box + (1 * box), k * box + (3 * box),box,box);  
        }     
    }
    ctx.fillStyle =  "#f0f0f8";
    for (let m = 1; m < 15; m = m +2) {
        for (let n = 0; n < 17; n = n +2) {   
             ctx.fillRect(n * box + (1 * box), m * box + (3 * box),box,box);  
        }     
    }
    
}

function drawBG() {
    //fill back
    ctx.fillStyle = "grey";
    ctx.fillRect(0,3, box * 23, box * 20)
    // make alternating
    ctx.fillStyle = "#212529"; // Hive Black
    for (let i = 2; i < 23; i = i + 2) {
        ctx.fillRect(0, i * box, box * 23, box)
    }  
    // line at top
    ctx.fillStyle = "#f0f0f8"; 
    ctx.fillRect(0, 0,box * 20,box * 2);
    // logo
    ctx.drawImage(logo,1 * box,0.65 * box); 
}

drawBG();

    

// draw to canvas

function draw() {     
    drawBG();
    drawGrid1();
    drawGrid2();
    
    
    for( let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#E31337" : "white";
        ctx.fillRect(snake[i].x, snake[i].y,box,box);
        
        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x, snake[i].y,box,box);
    }
    
    // draw sun and food
    ctx.drawImage(sunHeadImg, sunHead[0].x, sunHead[0].y);
    
    ctx.drawImage(logo, food.x, food.y);
    
    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // direction
    
    switch(d) {
        case "LEFT":
            snakeX -= box; break;
        case "UP":
            snakeY -= box; break;
        case "RIGHT": 
            snakeX += box; break;
        case "DOWN": 
            snakeY += box; break;
    }
    
    
    // if eats food
    
    if(snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y : Math.floor(Math.random() * 15 + 3) * box
        }
    }
    else {
        // remove tail
        snake.pop();
    }
     
    // new head
    
    let newHead = {
        x: snakeX,
        y: snakeY
    }
    
    // game over
    
    if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead,snake) ||collision(newHead,sunHead) ){
        clearInterval(game);
        
        ctx.fillStyle = "red";
        ctx.font = "25px Changa one";
        ctx.fillText("Press ANY BUTTON to restart game",4.5 * box, 1.4 * box);
        
        document.addEventListener("keyup", restart);
        
        
    }
    
    snake.unshift(newHead);
    
    ctx.fillStyle = "#E31337";
    ctx.font = "45px Changa one";
    ctx.fillText(score,2.2 * box, 1.6 * box);
    
   // console.log(snakeX);
}

// call draw() every 100 ms

 let game = setInterval(draw, 100);

