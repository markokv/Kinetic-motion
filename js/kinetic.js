class Kinetic {
	constructor(target,fps){
		this.fps = fps;
		this.friction = 0.98
		this.momentum = 0.70;

		this.touchTarget = this.kineticTarget  = document.querySelector(target);

		this.touchTarget.addEventListener("mousedown", this.clickDown.bind(null, this), false);
		this.touchTarget.addEventListener("touchstart", this.clickDown.bind(null, this), false);
	}
	clickDown(self, event) {
		var date = new Date();
		self.time = date.getTime();

		self.momentumX = 0;
		self.momentumY = 0;

		self.clickedUp = false;
		self.moveHandler = self.clickMove.bind(null, self);
		self.clickUpHandler = self.clickUp.bind(null, self);

		if ( typeof window["timeOut"+self.kineticTarget.id] !== 'undefined')
			clearTimeout(window["timeOut"+self.kineticTarget.id]);

		if(event.type==="touchstart"){
			self.x = event.targetTouches[0].clientX;
			self.y = event.targetTouches[0].clientY;

			self.touchTarget.addEventListener("touchmove", self.moveHandler);
			self.touchTarget.addEventListener("touchend", self.clickUpHandler);
		}
		else if(event.type === "mousedown"){
			self.x = event.clientX;
			self.y = event.clientY;

			self.touchTarget.addEventListener("mousemove", self.moveHandler);
			self.touchTarget.addEventListener("mouseup", self.clickUpHandler);
		}

		event.preventDefault();
		return false;
	}
	clickMove(self, event){
		var date = new Date();
		var time = date.getTime();

		var moveX, moveY;

		if(event.type==="touchmove"){
			moveX = event.targetTouches[0].clientX - self.x;
			moveY = event.targetTouches[0].clientY - self.y;
			self.x = event.targetTouches[0].clientX;
			self.y = event.targetTouches[0].clientY;
		}
		else if(event.type === "mousemove"){
			moveX = event.clientX - self.x;
			moveY = event.clientY - self.y;
			self.x = event.clientX;
			self.y = event.clientY;
		}

		self.kineticTarget.style.left = self.kineticTarget.getBoundingClientRect().left+ moveX + "px";
		self.kineticTarget.style.top = self.kineticTarget.getBoundingClientRect().top+ moveY + "px";
		self.ball3D();

		var Timescale = (time-self.time)/(1000/self.fps);
		self.time =time;

		var SpeedX = moveX/Timescale;
		var SpeedY = moveY/Timescale;

		self.momentumX=self.momentumX*self.momentum+(SpeedX)*(1-self.momentum);
		self.momentumY=self.momentumY*self.momentum+(SpeedY)*(1-self.momentum);
	}
	clickUp(self, event){
		if(!self.clickedUp){
			if(event.type==="touchend"){
				self.touchTarget.removeEventListener("touchmove",self.moveHandler);
				self.touchTarget.removeEventListener("touchend",self.clickUpHandler);
			}
			else if(event.type === "mouseup"){
				self.touchTarget.removeEventListener("mousemove",self.moveHandler);
				self.touchTarget.removeEventListener("mouseup",self.clickUpHandler);
			}
		}
		self.clickedUp = true;

		self.getMotionFrames(self.momentumX, self.momentumY);
		self.startAnim(0);

		event.preventDefault();
		return false;
	}
	getMotionFrames(X,Y){
		this.motionFrames = [];
		this.motionFrames["X"]=[];
		this.motionFrames["Y"]=[];
		this.motionFrames["X"][0]=X;
		this.motionFrames["Y"][0]=Y;

		var hypotenuse = Math.sqrt(Math.pow(X, 2)+Math.pow(Y, 2));
		var angleRadians = Math.atan2(Y, X);
		do{
			hypotenuse*=this.friction;

			this.motionFrames["X"][this.motionFrames["X"].length]=Math.cos(angleRadians) * hypotenuse;
			this.motionFrames["Y"][this.motionFrames["Y"].length]=Math.sin(angleRadians) * hypotenuse;
		}while(hypotenuse>=0.1);
	}
	startAnim(index){
		if(index<this.motionFrames["X"].length){
			this.kineticTarget.style.left = this.kineticTarget.getBoundingClientRect().left + this.motionFrames["X"][index]+ "px";
			this.kineticTarget.style.top = this.kineticTarget.getBoundingClientRect().top + this.motionFrames["Y"][index] + "px";
			this.ball3D();

			var self = this;
			window["timeOut"+this.kineticTarget.id] = setTimeout(function(){
				self.startAnim(index +1);
			}, 1000/this.fps);
		}
	}
	addLine(height){
		var line = document.createElement("div");
		line.style.height = Math.abs(height)+"px";
		if(height>0)
			line.style.background = "blue";
		else
			line.style.background = "red";
		line.className = "line";
		document.getElementById("target2").appendChild(line);
	}
	log(value){
		var opt = document.createElement("option");
		opt.text = value;
		document.getElementById("log").appendChild(opt);
	}
	setNewKineticTarget(target){
		this.kineticTarget  = document.querySelector(target);
	}
	ball3D(){
		var w = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;

		var h = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;

		var ball = this.kineticTarget.getBoundingClientRect();
		var left = (ball.left+ball.width/2);
		var top = (ball.top+ball.height/2);
		var posL = (w-left)/w*100;
		var posT = (h-top)/h*100;

		this.kineticTarget.style.background = "radial-gradient(circle at "+Math.trunc(posL)+"% "+Math.trunc(posT)+"%, white 2px, aqua 3%, darkblue 60%, aqua 100%)";
	}
}
