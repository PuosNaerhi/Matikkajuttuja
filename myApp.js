"use strict";

var myApp = angular.module('myApp', []);


myApp.factory('CanvasService', function (DataService){

	var canvas ;
	var context;


	function getMousePos(canvas, evt) {
       		var rect = canvas.getBoundingClientRect();
       		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
        		};
	}

	function getTouchPos(canvasDom, touchEvent) {
  		var rect = canvasDom.getBoundingClientRect();
  		return {
	 		 x: touchEvent.touches[0].clientX - rect.left,
	 		 y: touchEvent.touches[0].clientY - rect.top
  			};
	}

	function clearCanvas(){
		context.clearRect(0, 0, canvas.width, canvas.height);
	}



	function drawLevelText(params){
		context.save();
		context.fillText("Taso "+ params.level,((params.widthTileSize/2)*19)-(params.fontSize),params.heigthTileSize);
		context.restore();
	}

	function drawMissionText(params){
		var total;

		if(params.calcMark == "+"){
			total = params.missionValueOne + params.missionValueTwo;
		} else{
			total = params.missionValueOne - params.missionValueTwo
		}

		context.save();
		context.fillText(params.missionValueOne + " "+ params.calcMark +" ",((params.widthTileSize/2)*19)-(params.fontSize*2),(params.heigthTileSize*3)+(params.fontSize*1.25));
		context.fillText(" = " + total,((params.widthTileSize/2)*19)+(params.radius*2),(params.heigthTileSize*3)+(params.fontSize*1.25));
		context.restore();
	}

 
	function drawAnswerArea(params){
		context.save();
		context.fillStyle = 'gray';
		context.fillRect(((params.widthTileSize/2)*19),(params.heigthTileSize*3),params.radius*2,params.radius*2);
		context.fillStyle = 'black';
		context.fillText("?",((params.widthTileSize/2)*19)+(params.fontSize/1.5),(params.heigthTileSize*3)+(params.fontSize*1.25));
		context.restore();	
	}

	function drawGarbageArea(params){
		context.save();
		context.fillStyle = 'blue';
		context.fillRect((params.widthTileSize*16),params.heigthTileSize,params.fontSize*3,params.fontSize*3);
		context.fillStyle = 'black';
		context.fillText("Roskis",(params.widthTileSize*16),params.heigthTileSize+(params.fontSize*1.75));
		context.restore();	
	}

	function drawLife(params){
		context.save();
		context.fillStyle = 'yellow';
		context.fillRect(params.widthTileSize,params.heigthTileSize*2,params.fontSize,params.fontSize);
		context.fillRect((params.widthTileSize*2.5),params.heigthTileSize*2,params.fontSize,params.fontSize);
		context.fillRect((params.widthTileSize*4),params.heigthTileSize*2,params.fontSize,params.fontSize);
		context.fillStyle = 'black';
		context.fillText("Yritykset",params.widthTileSize,params.heigthTileSize+(params.fontSize*0.5));
		if(params.life<=2){
			context.strokeStyle = 'red';
			context.beginPath();
			context.moveTo(params.widthTileSize,params.heigthTileSize*2);
			context.lineTo(params.widthTileSize+params.fontSize, (params.heigthTileSize*2)+params.fontSize);
			context.moveTo(params.widthTileSize,(params.heigthTileSize*2)+params.fontSize);
			context.lineTo(params.widthTileSize+params.fontSize, (params.heigthTileSize*2));
			context.stroke();
		}
		if(params.life<=1){
			context.strokeStyle = 'red';
			context.beginPath();
			context.moveTo(params.widthTileSize*2.5,params.heigthTileSize*2);
			context.lineTo(params.widthTileSize*2.5+params.fontSize, (params.heigthTileSize*2)+params.fontSize);
			context.moveTo(params.widthTileSize*2.5,(params.heigthTileSize*2)+params.fontSize);
			context.lineTo(params.widthTileSize*2.5+params.fontSize, (params.heigthTileSize*2));
			context.stroke();	
		}
		if(params.life<=0){
			context.strokeStyle = 'red';
			context.beginPath();
			context.moveTo(params.widthTileSize*4,params.heigthTileSize*2);
			context.lineTo(params.widthTileSize*4+params.fontSize, (params.heigthTileSize*2)+params.fontSize);
			context.moveTo(params.widthTileSize*4,(params.heigthTileSize*2)+params.fontSize);
			context.lineTo(params.widthTileSize*4+params.fontSize, (params.heigthTileSize*2));
			context.stroke();	
		}
		context.restore();	
	}

			
	function drawScore(params){
		context.save();
		context.fillStyle = 'green';
		for (var i = 0; i < params.score; i++) {
			context.fillRect(params.widthTileSize ,(params.heigthTileSize*8)-(params.heigthTileSize/2)*i,params.widthTileSize ,(params.heigthTileSize/2));
			
		}
		for (var i = 0; i < 10; i++) {
			context.strokeRect(params.widthTileSize ,(params.heigthTileSize*8)-(params.heigthTileSize/2)*i,params.widthTileSize ,(params.heigthTileSize/2));
			
		}
		context.restore();
	}

	function gameover(){
		var params = DataService.getParams();

		context.save();
		context.fillStyle = 'gray';
		context.fillRect((params.widthTileSize *5),(params.heigthTileSize*6),params.widthTileSize *10,params.heigthTileSize*4);
		context.fillStyle = 'black';
		context.fillText("Yritykset loppui",(params.widthTileSize *7),(params.heigthTileSize*8));
		context.restore();
		DataService.SetTimeout(true);
		if(DataService.getScore() < 4){
			DataService.decLevel();
			if(params.level < 1){
				DataService.addLevel();	
			}
		}
		DataService.resetLifeAndScore();
		setTimeout(function(){ DataService.reset(false);draw(); }, 3000);
	}

	function updateLevel(){
		var params = DataService.getParams();

		context.save();
		context.fillStyle = 'gray';
		context.fillRect((params.widthTileSize*5),(params.heigthTileSize*6),params.widthTileSize*10,params.heigthTileSize*4);
		context.fillStyle = 'black';
		context.fillText("Taso läpäisty",(params.widthTileSize*7),(params.heigthTileSize*8));
		context.restore();
		DataService.SetTimeout(true);
		DataService.resetLifeAndScore();
		DataService.addLevel();		

		setTimeout(function(){ DataService.reset(false);draw(); }, 3000);
	}




	function answer(object,index){
		var params = DataService.getParams();
		var total;

		if(object.value == params.missionValueTwo){
			context.save();
			context.beginPath();
 			context.fillStyle = 'green';
			context.arc(object.x, object.y, object.radius, 0, 2 * Math.PI, false);
			context.fill();
			context.closePath();
			context.restore();
			context.fillText(object.value,object.x-(params.fontSize*0.35),object.y+(params.fontSize*0.35));
			context.fillText("Oikein",((params.widthTileSize/2)*19)-(params.fontSize),(params.heigthTileSize*6));
 			DataService.AddScore();
			DataService.SetTimeout(true);
			setTimeout(function(){ DataService.reset(false);draw(); }, 3000);
		} else {
			context.save();
			context.beginPath();
 			context.fillStyle = 'red';
			context.arc(object.x, object.y, object.radius, 0, 2 * Math.PI, false);
			context.fill();
			context.closePath();
			context.restore();
			context.fillText(object.value,object.x-(params.fontSize*0.35),object.y+(params.fontSize*0.35));
			if(params.calcMark == "+"){
				total = params.missionValueOne + object.value;
				context.fillText(params.missionValueOne + " " + params.calcMark + " " + object.value + " = " + total,((params.widthTileSize/2)*19)-(params.fontSize),(params.heigthTileSize*6));
			
			} else{
				total = params.missionValueOne - object.value;
				context.fillText(params.missionValueOne + " " + params.calcMark + " " + object.value + " = " + total,((params.widthTileSize/2)*19)-(params.fontSize),(params.heigthTileSize*6));
			
			}
			DataService.DecLife();
		}
		DataService.setIsAnswered(index);		
	}


	function drawObjects(params){
		var objects = DataService.getObjects();
		var l = objects.length;

		if (l > 0){
		for (var i = 0; i < l; i++) {
			if(objects[i].x > 0 && objects[i].x < canvas.width){
				if(objects[i].y > 0 && objects[i].y < canvas.height){
					context.save();
					context.beginPath();
					context.arc(objects[i].x, objects[i].y, objects[i].radius, 0, 2 * Math.PI, false);
					context.stroke();
					context.closePath();
					context.fillText(objects[i].value,objects[i].x-(params.fontSize*0.35),objects[i].y+(params.fontSize*0.35));
					context.restore();
				}
			}
		}
		}
	}

	function findSelectedObject(mousePos){
		var objectFound = false;
		var objects = DataService.getObjects();
		var params = DataService.getParams();

		var l = objects.length;
		
		if (params.timeout == false){
			for (var i = 0; i < l; i++) {
				if(objectFound == false && Math.pow(objects[i].radius,2) >= (Math.pow((objects[i].x-mousePos.x),2)+Math.pow((objects[i].y-mousePos.y),2))){
					objects[i].isDragged = true;
					objectFound = true;
				}
			}
		}
	}

	function moveEnded(){
		var removeIndex = -1;
		var objects = DataService.getObjects();
		var params = DataService.getParams();

		var l = objects.length;

		for (var i = 0; i < l; i++) {
			if(objects[i].isDragged == true){
				if(objects[i].x > ((canvas.width/40)*19) && objects[i].x < (((canvas.width/40)*19)+(params.radius*2)) && objects[i].y > ((canvas.height/15)*3) && objects[i].y < (((canvas.height/15)*3)+(params.radius*2))){
					if(objects[i].isAnswered == false){
						answer(objects[i],i);
						drawLife(params);
						drawScore(params);
					}	
				}
				if(objects[i].x > ((canvas.width/20)*16) && objects[i].x < (((canvas.width/20)*16)+params.fontSize*3) && objects[i].y > (canvas.height/15) && objects[i].y < ((canvas.height/15)+params.fontSize*3)){
					if(objects[i].isAnswered == true){
						removeIndex = i;	
					}	
				}
			}
			objects[i].isDragged = false;	
		}
		if(removeIndex != -1){
			objects.splice(removeIndex, 1);
			draw();
		}
		if(DataService.getLife() <= 0){
			gameover();
		}
		if(DataService.getScore() >= 10){
			updateLevel();
		}
	}

	function objectMove(mousePos){
		var objects = DataService.getObjects();
		var params = DataService.getParams();

		var l = objects.length;

		for (var i = 0; i < l; i++) {
			if(objects[i].isDragged == true){
				if(mousePos.x > params.radius && mousePos.x < (canvas.width - params.radius)){
					objects[i].x = mousePos.x;
				}
				if(mousePos.y > params.radius && mousePos.y < (canvas.height - params.radius)){
					objects[i].y = mousePos.y;
				}
				draw();
			}
		}
	}

	function draw(){
			var params = DataService.getParams();

			clearCanvas();
			drawLevelText(params);
			drawMissionText(params);
			drawAnswerArea(params);
			drawGarbageArea(params);
			drawLife(params);
			drawScore(params);
			drawObjects(params);
	}
	return {
		AddEventListener: function(canvasId){
			canvas = document.getElementById(canvasId);

            		if (canvas.getContext) {	
                		context = canvas.getContext("2d");

					canvas.addEventListener('mousedown', function(evt) {
					var mousePos = getMousePos(canvas, evt);
		
					findSelectedObject(mousePos);		
				}, false);

					canvas.addEventListener('mouseup', function(evt) {
					moveEnded();
		
				}, false);

					canvas.addEventListener('mouseout', function(evt) {
					moveEnded();
		
				}, false);

				canvas.addEventListener('mousemove', function(evt) {
					var mousePos = getMousePos(canvas, evt);

					objectMove(mousePos);

				}, false);

				canvas.addEventListener('touchstart', function(evt){
					evt.preventDefault();
					var mousePos = getTouchPos(canvas, evt);
		
					findSelectedObject(mousePos);
		        			
    				}, false);

				canvas.addEventListener('touchend', function(evt) {
					evt.preventDefault();
					moveEnded();

				}, false);

				canvas.addEventListener('touchleave', function(evt) {
					evt.preventDefault();
					moveEnded();

				}, false);

				canvas.addEventListener('touchmove', function(evt) {
				evt.preventDefault();

				var mousePos = getTouchPos(canvas, evt);
				objectMove(mousePos);	

				}, false);
			}
		},
		draw: function(canvasId){
			canvas = document.getElementById(canvasId);

            		if (canvas.getContext) {	
                		context = canvas.getContext("2d");
				draw();
			}
		},
		setFont: function(canvasId){
			canvas = document.getElementById(canvasId);

            		if (canvas.getContext) {	
                		context = canvas.getContext("2d");
				var fontSize = DataService.getFontSize();

				context.font = fontSize + "px Arial";
			}
		}
		
	};
});

myApp.factory('DataService', function (){
	var objects 	= [];
	var params = new params();

	function params(){
		this.missionValueOne = 0;
		this.missionValueTwo = 0;
		this.calcMark = "+";
		this.radius = 0;
		this.fontSize = 0;
		this.life = 3;
		this.score = 0;
		this.timeout = false;
		this.level = 1;
		this.widthTileSize = 0;
		this.heigthTileSize = 0;
	}

	function Object(){
		this.x = 0;
		this.y = 0;
		this.radius = 0;
		this.value = 0;
		this.isDragged = false;
		this.isAnswered = false;
	}

	function init(){

			var x = (params.widthTileSize)*4;
			var y = (params.heigthTileSize)*10;

			for (var i = 0; i < 5; i++) {
				var object = new Object;
				object.x = x + (i*((params.widthTileSize)*3));
				object.y = y;
				object.radius = params.radius;
				object.value = i;
				objects.push(object);	
			
			}
			for (var i = 5; i < 10; i++) {
				var object = new Object;
				object.x = x + ((i-5)*((params.widthTileSize)*3));
				object.y = y + (params.heigthTileSize)*3;
				object.radius = params.radius;
				object.value = i;
				objects.push(object);	
			
			}
		}

	function newMission(){ 
		var value; 
		if(params.level == 1){
			value = Math.floor(Math.random() * 9) + 1;
			params.missionValueOne = Math.floor(Math.random() * value);
			params.missionValueTwo = value - params.missionValueOne;
			params.calcMark = "+";
		}
		if(params.level == 2){
			value = Math.floor(Math.random() * 9) + 1;
			params.missionValueOne = value;
			params.missionValueTwo = value;
			params.calcMark = "+";
		}
		if(params.level == 3){
			value = Math.floor(Math.random() * 19) + 1;
			params.missionValueOne = Math.floor(Math.random() * value);
			params.missionValueTwo = value - params.missionValueOne;
			if(params.missionValueTwo > params.missionValueOne){
				var swapValue = params.missionValueOne;
				params.missionValueOne = params.missionValueTwo;
				params.missionValueTwo = swapValue;
			}
			params.calcMark = "+";
		}
		if(params.level == 4){
			value = Math.floor(Math.random() * 9) + 1;
			params.missionValueOne = Math.floor(Math.random() * value);
			params.missionValueTwo = value - params.missionValueOne;
			if(params.missionValueTwo > params.missionValueOne){
				var swapValue = params.missionValueOne;
				params.missionValueOne = params.missionValueTwo;
				params.missionValueTwo = swapValue;
			}
			params.calcMark = "-";
		}
		if(params.level == 5){
			value = Math.floor(Math.random() * 19) + 1;
			params.missionValueOne = Math.floor(Math.random() * value);
			params.missionValueTwo = value - params.missionValueOne;
			if(params.missionValueTwo > params.missionValueOne){
				var swapValue = params.missionValueOne;
				params.missionValueOne = params.missionValueTwo;
				params.missionValueTwo = swapValue;
			}
			params.calcMark = "-";
		}
		if(params.level >= 6){
			value = Math.floor(Math.random() * 19) + 1;
			params.missionValueOne = Math.floor(Math.random() * value);
			params.missionValueTwo = value - params.missionValueOne;
			if(params.missionValueTwo > params.missionValueOne){
				var swapValue = params.missionValueOne;
				params.missionValueOne = params.missionValueTwo;
				params.missionValueTwo = swapValue;
			}
			value = Math.floor(Math.random() * 100) + 1;
			if (value < 50){
				params.calcMark = "+";
			} else {
				params.calcMark = "-";
			}
		}
	}

	return{ 
		reset: function(resize){
			objects = [];
			params.timeout = false;

			init();
			if(resize != true){
				newMission();
			}
		},


		setSizeParams: function(radius,fontSize,widthTS,heigthTS){
			params.radius = radius;
			params.fontSize = fontSize;
			params.widthTileSize = widthTS;
			params.heigthTileSize = heigthTS;
		},
 		DecLife: function(){
			params.life--;
		},
 		AddScore: function(){
			params.score++;
		},
		resetLifeAndScore: function(){
			params.life = 3;
			params.score = 0;
		},
		addLevel: function(){
			params.level++;
		},	
		decLevel: function(){
			params.level--;
		},
		SetTimeout: function(timeout){
			params.timeout = timeout;
		},
		setIsAnswered: function(index){
			objects[index].isAnswered = true;
		},	
		getLife: function(){
			return params.life;
		},
		getScore: function(){
			return params.score;
		},
		getFontSize: function(){
			return params.fontSize;
		},
		getParams: function() {
			return params;
		},
		getObjects: function() {
			return objects;
		},
	};
});

myApp.controller('gameAreaCtrl',function($scope,CanvasService,DataService) {
	function resizeGame() {
		var gameArea = document.getElementById('gameArea');
		var widthToHeight = 4 / 3;
		var newWidth = window.innerWidth;
		var newHeight = window.innerHeight;
		var newWidthToHeight = newWidth / newHeight;
    
	    	if (newWidthToHeight > widthToHeight) {
	        	newWidth = newHeight * widthToHeight;
	        	gameArea.style.height = newHeight + 'px';
       	 		gameArea.style.width = newWidth + 'px';
    		} else {
        		newHeight = newWidth / widthToHeight;
        		gameArea.style.width = newWidth + 'px';
        		gameArea.style.height = newHeight + 'px';
    		}
    
    		gameArea.style.marginTop = (-newHeight / 2) + 'px';
    		gameArea.style.marginLeft = (-newWidth / 2) + 'px';
    
    		var gameCanvas = document.getElementById('canvas');
    		gameCanvas.width = newWidth;
    		gameCanvas.height = newHeight;
	
		DataService.setSizeParams(gameCanvas.width/20,gameCanvas.width/20,gameCanvas.width/20,canvas.height/15);
		CanvasService.setFont('canvas');
		DataService.reset(true);
		CanvasService.draw('canvas');
	}

	window.addEventListener('resize', resizeGame, false);
	window.addEventListener('orientationchange', resizeGame, false);

	window.onload = function(evt){
		
		DataService.reset(false);
resizeGame();
		CanvasService.AddEventListener('canvas');
	};

});
