const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d");

//    ----------------PADDLE-----------------
// Create PADDLE
const PADDLE_WIDTH = 160;
const PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50;

const paddle = {
    x:canvas.width/2 - PADDLE_WIDTH/2,
    y:canvas.height - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx:5 // move left or right 5 steps
}
// Draw PADDLE
function drawPaddle(){
    ctx.fillStyle = "#2e3548";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "#ffcd05"; // draw stroke of rectangle
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}
drawPaddle();

// Move PADDLE
// KeyCode 37 is left move button, 39 is right move button
let leftPress = false;
let rightPress = false;

document.addEventListener("keydown", keyDownHandler);
function keyDownHandler(e) {
    if(e.keyCode == 37){
        leftPress = true;
    }else if(e.keyCode == 39){
        rightPress = true;
    }
}
document.addEventListener("keyup", keyUpHandler);
function keyUpHandler(e){
    if(e.keyCode == 37){
        leftPress = false;
    } else if(e.keyCode == 39){
        rightPress = false;
    }
}
function movePaddle(){
    if(leftPress && paddle.x > 0 ){
        paddle.x -= paddle.dx;
    } else if(rightPress && paddle.x + paddle.width < canvas.width){
        paddle.x += paddle.dx;
    }
}
// --------------------------------------

// ------------------BALL----------------
// Create BALL
const BALL_RADIUS = 8;

const ball = {
    x: canvas.width/2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 5,
    dx: 3,
    dy: -3
}
// Draw BALL
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#ffcd05";
    ctx.fill();
    ctx.strokeStyle = "#2e3548";
    ctx.stroke();
    ctx.closePath();
}
// Move BALL
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}
// BALL wall colision
let LIFE = 3; // Has 3 lives
function resetBall() {
    ball.x = canvas.width/2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
    ball.speed += 1;
}

function ballWallCollision(){
    if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0){
        ball.dx = -ball.dx;
    }
    if(ball.y - ball.radius < 0){
        ball.dy = -ball.dy;
    }
    if(ball.y + ball.radius > canvas.height){
        LIFE--;
        resetBall();
    }
}

// BALL PADDLE collision
function ballPaddleColision(){
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height
        && ball.y > paddle.y){
        ball.dx = ball.dx;
        ball.dy = -ball.dy;
    }
}
//-------------------------------------

//---------------BRICK-----------------
// Creat BRICK
const brick = {
    row: 2,
    col: 7,
    width: 55,
    height: 20,
    offsetLeft: 50,
    offsetTop: 20,
    marginTop: 60,
    fillColor: "#5dcb09",
    strokeColor: "#fff"
}
let bricks = []; // array has bricks
function creatBricks(){
    for(let r=0; r<brick.row; r++){
        bricks[r] = [];
        for(let c=0; c<brick.col; c++){
            bricks[r][c] = {
                x: c * (brick.offsetLeft + brick.width) + brick.offsetLeft,
                y: r * (brick.offsetTop + brick.height) + brick.offsetTop + brick.marginTop,
                status: true
            }
        }
    }
}
creatBricks();
// Draw BRICK
function drawBricks(){
    for(let r=0; r<brick.row; r++){
        for(let c=0; c<brick.col; c++){
            if(bricks[r][c].status){
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);
            }
        }
    }
}
let SCORE = 0;
const SCORE_UNIT = 10;
// Collision BALL with BRICK
function ballBrickCollision(){
    for(let r=0; r<brick.row; r++){
        for(let c=0; c<brick.col; c++){
            let b = bricks[r][c];
            if(b.status){
                if(ball.x + ball.radius > b.x
                    && ball.x - ball.radius < b.x + brick.width
                    && ball.y + ball.radius > b.y
                    && ball.y - ball.radius < b.y + brick.height){
                    b.status = false;
                    ball.dy = -ball.dy;
                    SCORE += SCORE_UNIT;
                }
            }
        }
    }
}
//------------------------------------------------


// ------------SCORE,LIVES---------------
const SCORE_IMG = new Image();
SCORE_IMG.src = "img/score.png";
SCORE_IMG.width = 15;
const LIFE_IMG = new Image();
LIFE_IMG.src = "img/live.png";
const LEVEL_IMG = new Image();
LEVEL_IMG.src = "img/level.png";
function showGameStats(text, textX, textY, img, imgX, imgY){
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);
    ctx.drawImage(img, imgX, imgY, 25, 25);
}

// Game Over
let GAME_OVER = false;
function gameOver(){
    if (LIFE <= 0){
        GAME_OVER = true;
        showLose();
    }
}

// Level up
let LEVEL = 1;
const MAX_LEVEL = 4;
function levelUp(){
    let isLevelUp = true;
    for(let r=0; r<brick.row; r++) {
        for (let c = 0; c < brick.col; c++) {
            isLevelUp = isLevelUp && !bricks[r][c].status;
        }
    }
    if(isLevelUp){
        if(LEVEL >= MAX_LEVEL){
            showWon();
            GAME_OVER = true;
            return;
        }
        brick.row++;
        creatBricks();
        resetBall();
        paddle.width -= 20;
        LEVEL++;
    }
}

const endgame = document.getElementById("endgame");
const won = document.getElementById("won");
const lose = document.getElementById("lose");
const restart = document.getElementById("restart");
restart.addEventListener("click", function (){
    location.reload();
});
function showWon(){
    endgame.style.display = "block";
    won.style.display = "block";
    lose.style.display = "none";
}
function showLose(){
    endgame.style.display = "block";
    won.style.display = "none";
    lose.style.display = "block";
}

//--------------------------------------

const BG_IMG = new Image();
BG_IMG.src = "img/bg2.png";

function draw(){
    drawPaddle();
    drawBall();
    drawBricks();

    showGameStats(SCORE,85,45, SCORE_IMG, 45,25);
    showGameStats(LIFE,canvas.width - 25,65, LIFE_IMG, canvas.width - 55,45);
    showGameStats(LEVEL,canvas.width - 25,25, LEVEL_IMG, canvas.width - 55,5);
}
function update(){
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleColision();
    ballBrickCollision();
    gameOver();
    levelUp();
}
function loop(){
    // clear canvas
    ctx.drawImage(BG_IMG,0,0);
    draw();
    update();
    if(!GAME_OVER){
        requestAnimationFrame(loop);
    }

}
function startGame(){
    document.getElementById("start").style.display = "none";
    document.getElementById("container").style.display = "block";
    loop();
}
// ---------CREATE------------
// const ROUND_RADIUS = 20;
//
// const round = {
//     x: canvas.width/2 * Math.random(),
//     y: (paddle.y - ROUND_RADIUS) * Math.random(),
//     radius: ROUND_RADIUS,
// }
// function drawRound(){
//     ctx.beginPath();
//     ctx.arc(round.x, round.y, round.radius, 0, Math.PI*2);
//     ctx.strokeStyle = "#2e3548";
//     ctx.stroke();
//     ctx.closePath();
// }



