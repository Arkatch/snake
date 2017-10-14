/*Obiekty sterowania*/
var mapDOWN = 0, mapPRESS = {}, mapUP = {}, leftRightClick = true, upTopClick = true, oneTimeL = false;


/*Zmienne węża*/
var snakeHead = {}, snakeBody = [], snakeSpeed = 10, snakeLength = 2;

/*Zmienne jedzenia*/
var foodBlock = {}, posFoodX = Math.floor(Math.random()*610)+25, posFoodY = Math.floor(Math.random()*485)+25;

/*inne*/
var info = {}, points = snakeLength-snakeLength, crashFood = [];

/*Frame rate = (1000/fraRate)*/
var fraRate = 50;

//Generate obj


var myGameArea = {
    canvas 	: document.createElement("canvas"),
    start 	: function() {
				this.canvas.width = 670;
				this.canvas.height = 640;
				this.canvas.style.border = "solid 2px black";
				this.canvas.style.backgroundColor = "gray";
				this.context = this.canvas.getContext("2d");
				document.body.insertBefore(this.canvas, document.body.childNodes[0]);
				this.interval = setInterval(updateGameArea, fraRate);
		
				window.addEventListener('keydown', function (e) {
					myGameArea.key = e.keyCode;
				})
				window.addEventListener('keyup', function (e) {
					myGameArea.key = false;
				})
    }, 
    clear : function(){
				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
	stop  : function(){
				clearInterval(myGameArea.interval);
				let scoreVAR = myGameArea.context;
				let Myscore = "KONIEC GRY";
				scoreVAR.font = "60px Arial"
				scoreVAR.fillStyle = "white"
				scoreVAR.fillText(Myscore, 150, 615);
	}
}

function updateGameArea(){
/*Odświeżanie elementów*/
	myGameArea.clear();
	
	for(var i = 0, j = crashFood.length;i<j;i++){
		crashFood[i].create();
	}
	info.create();
	foodNew();
	control();
	
	
	for(var i = 0, j = snakeBody.length;i<j;i++){
		snakeBody[i].create();
	}
	snakeHead.create();
	
	for(var i = 0, j = crashFood.length;i<j;i++){
		if(crashTest(crashFood[i], snakeHead)){
			myGameArea.stop();
		}
	}
	
	if(crashTestSnake(snakeBody, snakeHead)){
		myGameArea.stop();
	}
	
	
	score();
}

function addObject(){
	/*Dodawanie obiektów*/
	myGameArea.start();
	let xy = myGameArea.canvas.width;
	let yx = myGameArea.canvas.height;
	
	let crashObjLength = Math.floor(xy*0.3);
	
	snakeHead = new hero(10, 10, (xy*0.5), (yx*0.5), "green");
	snakeBody[0] = new hero(10, 10, (xy*0.5-10), snakeHead.y, "blue");
	foodBlock = new food(10, 10, posFoodX, posFoodY, "red");
	
	crashFood[0] = new food(11, crashObjLength, 0, 0, "white");
	crashFood[1] = new food(11, crashObjLength, 0, 340, "white");
	crashFood[2] = new food(265, 11, 0, 0, "white");
	crashFood[3] = new food(265, 11, 405, 0, "white");
	crashFood[4] = new food(11, crashObjLength, 659, 0, "white");
	crashFood[5] = new food(11, crashObjLength, 659, 340, "white");
	crashFood[6] = new food(265, 11, 0, 529, "white");
	crashFood[7] = new food(265, 11, 405, 529, "white");
	
	info = new food(670, 100, 0, 540, "black");
	for(var i=1;i<snakeLength;i++)
		snakeBody[i] = new hero(10, 10, snakeBody[i-1].x-10, snakeBody[i-1].y, "blue");
}

function hero(width, height, x, y, color) {
	let ctx = myGameArea.context;
	
	this.width = width;
    this.height = height;
	this.x = x;
    this.y = y;
	
	this.speedX = 0;
    this.speedY = 0; 
	
	this.create = function() {

		if(this.x>=670){
			this.x = 0;
			this.x += this.speedX;
			this.y += this.speedY;
		}else if(this.y>=540){
			this.y = 0;
			this.y += this.speedY;
			this.x += this.speedX;
		}else if(this.x<0){
			this.x = 670;
			this.x += this.speedX;
			this.y += this.speedY;
		}else if(this.y<0){
			this.y = 540;
			this.y += this.speedY;
			this.x += this.speedX;
		}else{
			this.x += this.speedX; this.y += this.speedY;
		}
		
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function food(width, height, x, y, color) {
	let ctx = myGameArea.context;
	
	this.width = width;
    this.height = height;
	this.x = x;
    this.y = y;
	this.create = function() {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function control(){
	let oldX = [];
	let oldY = [];
	let i, j =  snakeBody.length;
	oldX[0] = snakeHead.x;
	oldY[0] = snakeHead.y;
	
	for(i = 1;i<j;i++){
		oldX[i] = snakeBody[i-1].x;
		oldY[i] = snakeBody[i-1].y;
	}
	
	
	//Sterowanie strzalkami/////////////////
		/*left*/
    if (myGameArea.key == 37 && leftRightClick && oneTimeL){
		snakeHead.speedY = 0;
		snakeHead.speedX = -snakeSpeed;
		leftRightClick = false;
		upTopClick = true;
	}
		/*right*/
	if (myGameArea.key == 39 && leftRightClick){
		snakeHead.speedY = 0;
		snakeHead.speedX = snakeSpeed;
		leftRightClick = false;
		upTopClick = true;
		oneTimeL = true;
	}
		/*up*/
    if (myGameArea.key == 38 && upTopClick){
		snakeHead.speedX = 0;
		snakeHead.speedY = -snakeSpeed;
		leftRightClick = true;
		upTopClick = false;
		oneTimeL = true;
	}
		/*down*/
    if (myGameArea.key == 40 && upTopClick){
		snakeHead.speedX = 0;
		snakeHead.speedY = snakeSpeed;
		leftRightClick = true;
		upTopClick = false;
		oneTimeL = true;
	}
	//////////////////////////////////////

	if(snakeHead.speedY!=0||snakeHead.speedX!=0){
			for(i = 0;i<j;i++){
			snakeBody[i].y = oldY[i];
			snakeBody[i].x = oldX[i];
			}
	}
	
	//if(!oneTimeL){}
}

function foodNew(){
	if(crashTest(foodBlock, snakeHead)){
		posFoodX = Math.floor(Math.random()*610)+25;
		posFoodY = Math.floor(Math.random()*485)+25;
		foodBlock = new food(10, 10, posFoodX, posFoodY, "red");
		snakeBody[snakeLength] = new hero(10, 10, snakeBody[snakeLength-1].x-10, snakeBody[snakeLength-1].y, "blue");
		++snakeLength;
		++points;
		if(fraRate>=25)
		--fraRate;
		
	}
	foodBlock.create();
}

function score(){
	let scoreVAR = myGameArea.context;
	let Myscore = points;
	scoreVAR.font = "30px Arial"
	scoreVAR.fillStyle = "white"
	scoreVAR.fillText(Myscore, 45, 600);
}

function crashTest(objectName, snakeName){
	
	let myLeft = snakeName.x;
	let myRight = myLeft + snakeName.width;
	let myTop = snakeName.y;
	let myBottom = myTop + snakeName.height;
	
	let targetLeft = objectName.x;
	let targetTop = objectName.y;
	let targetBottom = objectName.y + (objectName.height);
	let targetRight = objectName.x + (objectName.width);
	
	if ((myBottom < targetTop) || (myTop > targetBottom) || (myRight < targetLeft) || (myLeft > targetRight)){
		return false;
	}
	return true;
}

function crashTestSnake(objectName, snakeName){
	let myLeft = snakeName.x;
	let myRight = myLeft + snakeName.width;
	let myTop = snakeName.y;
	let myBottom = myTop + snakeName.height;
	
	for(var i=0;i<objectName.length;i++){
	let targetLeft = objectName[i].x;
	let targetTop = objectName[i].y;
	let targetBottom = objectName[i].y + (objectName[i].height);
	let targetRight = objectName[i].x + (objectName[i].width);
		
	if ((myTop == targetTop) && (myBottom == targetBottom) && (myRight == targetRight) && (myLeft == targetLeft)){
		return true;
	}
	}
	return false;
}
addObject();