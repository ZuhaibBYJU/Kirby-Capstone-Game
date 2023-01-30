var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4
var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("Kirby Running 1.png","Kirby Running 2.png","Kirby Running 3.png","Kirby Running 4.png","Kirby Running 5.png","Kirby Running 6.png","Kirby Running 7.png")
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  obstacle1 = loadImage("Obstacle 1.png");
  obstacle2 = loadImage("Obstacle 2.png");
  obstacle3 = loadImage("Obstacle 3.png");
  obstacle4 = loadImage("Obstacle 4.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(405,200); 

  trex = createSprite(200,100,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  
  trex_collided.scale = 1;
  trex.scale = 1;
  
  ground = createSprite(300,280,400,20);
  ground.addImage("ground",groundImage);
  //ground.x = ground.width /2;
  ground.scale = 0.25
  

  gameOver = createSprite(200,50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(200,120);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.23;
  restart.scale = 0.025;
  
  invisibleGround = createSprite(200,180,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 300,50);

  

  
  if(gameState === PLAY){
    //move the 
    gameOver.visible = false;
    restart.visible = false;
    if(keyDown("space")&& trex.y >= 100) {
      trex.velocityY = -12;
      jumpSound.play();
  }
  
  //add gravity
  trex.velocityY = trex.velocityY + 0.8
    //change the trex animation
      //trex.Animation("running", trex_running);
    
    //ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
       

     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
     
     obstaclesGroup.setVelocityXEach(0);
        
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)){
    reset();
  }
  drawSprites();
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false
  reset.visible = false;

  obstaclesGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  score = 0
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(500,150,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}


