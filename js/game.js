(function() {
	window.requestAnimFrame = (function(){
		return  window.requestAnimFrame       ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame    ||
						window.oRequestAnimationFrame      ||
						window.msRequestAnimationFrame     ||
						function( callback ){
							window.setTimeout(callback, 1000 / 60);
						};
	})();

	// Props to Stevie Graham / Zap for the funky star inspiration.
	//   http://paywithzap.com

	var maxDepth  = 16;
	var numStars  = 512;
	var stars     = new Array(numStars);
	var finished = false;

	document.addEventListener('DOMContentLoaded', function() {
		var canvas  = document.getElementById('starfield');
		var ctx     = canvas.getContext("2d");

		var onResize = function() {
			canvas.width  = document.body.clientWidth;
			canvas.height = document.body.clientHeight;
		}

		onResize();

		var between = function(min, max) {
			return min + Math.floor((max - min - 1) * Math.random());
		}

		var init = function() {
			for(var i = 0; i < stars.length; i++) {
				stars[i] = {
					x: between(-25,25),
					y: between(-25,25),
					z: between(1, maxDepth)
				}
			}
		}

		var animateFrame = function() {
			var halfWidth  = canvas.width / 2;
			var halfHeight = canvas.height / 2;

			ctx.fillStyle = "rgb(0, 0, 0)";
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			stars.forEach(function(star,index,stars) {
				star.z -= 0.005;

				if(star.z <= 0) {
					star.x = between(-25,25);
					star.y = between(-25,25);
					star.z = maxDepth;
				}

				var k          = 192.0 / star.z;
				var projectedX = star.x * k + halfWidth;
				var projectedY = star.y * k + halfHeight;

				if(projectedX >= 0 && projectedX <= canvas.width && projectedY >= 0 && projectedY <= canvas.height ) {
					var size = (1 - star.z / maxDepth) * 2.5;
					var shade = parseInt((1 - star.z / maxDepth) * 255);

					ctx.fillStyle = "rgb(" + shade + "," + shade + "," + parseInt(shade * 1.9) + ")";
					ctx.beginPath();
					ctx.arc(projectedX, projectedY, size / 2, 0, Math.PI * 2, false);
					ctx.fill();
				}
			});

			// Check to see if game is finished - if so, don't create/loop biebs.
			if (!finished) {
				draw();  // Create loop of Biebers.
				drawRed();  // Create loop of BadBiebers.
				setTimeout(function(){requestAnimFrame(drawMiley); drawMiley(); }, 10000);  //  Create Miley instance.
				
			}
			requestAnimFrame(animateFrame);
		}

		init();
		requestAnimFrame(animateFrame);


		// Let's bang some Biebs!

		var ctx;
		var imgBiebs;
		var x = 0;
		var y = 0;
		var noOfBiebs = 10;
		var noOfReds = 3;
		var fallingBiebs = [];
		var fallingRedBiebs = [];
		var fallingMiley = [];
		var CanWidth = canvas.width;
		var CanHeight = canvas.height;

		var Score = 0;
		var BoomCounter = 0;

		var imgBg = new Array()
			imgBg[1] = 'img/bieb1.png'
			imgBg[2] = 'img/bieb2.png'
			imgBg[3] = 'img/bieb3.png'


		function draw() {

			if (Score >= 15000) {
				biebIsDead()
			}

			if (document.querySelector(".leap-pointable-cursor")) {
				var currentLeapPosition = document.querySelector(".leap-pointable-cursor").style;
				currentLeapPosition = {
					top:parseInt(currentLeapPosition.top,10),
					left:parseInt(currentLeapPosition.left,10)
				};
			} else {
				currentLeapPosition = {
					top:-1000,
					left:-1000
				};
			}

			for (var i = 0; i < noOfBiebs; i++)
			{
				ctx.drawImage (fallingBiebs[i].image, fallingBiebs[i].x, fallingBiebs[i].y); // The Bieb drop

				fallingBiebs[i].y += fallingBiebs[i].speed; // Set the falling speed
				// reset biebs
				if (fallingBiebs[i].y > CanHeight) {  // Repeat the biebdrop when he falls out of view
					fallingBiebs[i].y = -100 // Account for the image size
					fallingBiebs[i].x = Math.random() * CanWidth;    // Make him appear randomly along the width    
					if (fallingBiebs[i].boomed) {
						fallingBiebs[i].boomed = false;
						fallingBiebs[i].image.src = imgBg[Math.floor((Math.random()*3)+1)];
					}
					fallingBiebs[i].speed = 2 + Math.random() * 4

				}

				var threshold = 100;
				if (fallingBiebs[i].y > currentLeapPosition.top -threshold &&
					fallingBiebs[i].y < currentLeapPosition.top +threshold &&
					fallingBiebs[i].x > currentLeapPosition.left -threshold &&
					fallingBiebs[i].x < currentLeapPosition.left +threshold &&
					!fallingBiebs[i].boomed) 
				{
					fallingBiebs[i].image.src = 'img/b00m.png';
					fallingBiebs[i].boomed = true;
					fallingBiebs[i].speed = 10
					var popsound = new Audio('sounds/pop.mp3');
					popsound.volume=0.5;
					popsound.play();
					Score += 100
					document.getElementById("scorediv").textContent = "Bieberscore:  " + Score

				}

			}
		}


		function drawRed() {
			if (document.querySelector(".leap-pointable-cursor")) {
				var currentLeapPosition = document.querySelector(".leap-pointable-cursor").style;
				currentLeapPosition = {
					top:parseInt(currentLeapPosition.top,10),
					left:parseInt(currentLeapPosition.left,10)
				};
			} else {
				currentLeapPosition = {
					top:-1000,
					left:-1000
				};
			}

			for (var i = 0; i < noOfReds; i++)
			{
				ctx.drawImage (fallingRedBiebs[i].image, fallingRedBiebs[i].x, fallingRedBiebs[i].y); // The Bieb drop
				
				fallingRedBiebs[i].y += fallingRedBiebs[i].speed; // Set the falling speed
				// reset biebs
				if (fallingRedBiebs[i].y > CanHeight) {  // Repeat the biebdrop when he falls out of view
					fallingRedBiebs[i].y = -100 // Account for the image size
					fallingRedBiebs[i].x = Math.random() * CanWidth;    // Make him appear randomly along the width    
					fallingRedBiebs[i].boomed = false;
					fallingRedBiebs[i].image.src = 'img/badbiebs.png';
					fallingRedBiebs[i].speed = 2 + Math.random() * 4

				}

				var threshold = 100;
				if (fallingRedBiebs[i].y > currentLeapPosition.top -threshold &&
					fallingRedBiebs[i].y < currentLeapPosition.top +threshold &&
					fallingRedBiebs[i].x > currentLeapPosition.left -threshold &&
					fallingRedBiebs[i].x < currentLeapPosition.left +threshold &&
					!fallingRedBiebs[i].boomed) 
				{
					fallingRedBiebs[i].image.src = 'img/badoops.png';
					fallingRedBiebs[i].boomed = true;
					fallingRedBiebs[i].speed = 5;
					var angrysound = new Audio('sounds/bahh.mp3');
					angrysound.volume=0.9;
					angrysound.play();

					BoomCounter++
					document.getElementById("boomScorediv").textContent = "Lives left:  "  + (5 - BoomCounter ) + "  /  5"
					
					if (BoomCounter > 5) {
						OopsyDaisy()
					}

					Score -= 10 * 100;
					document.getElementById("scorediv").textContent = "Bieberscore:  " + Score
				}

			}
		}


		function drawMiley() {
			if (document.querySelector(".leap-pointable-cursor")) {
				var currentLeapPosition = document.querySelector(".leap-pointable-cursor").style;
				currentLeapPosition = {
					top:parseInt(currentLeapPosition.top,10),
					left:parseInt(currentLeapPosition.left,10)
				};
			} else {
				currentLeapPosition = {
					top:-1000,
					left:-1000
				};
			}

			for (var i = 0; i < 1; i++)
			{
				ctx.drawImage (fallingMiley[i].image, fallingMiley[i].x, fallingMiley[i].y); // The Miley drop
				
				fallingMiley[i].y += fallingMiley[i].speed; // Set the falling speed
				var threshold = 150;
				if (fallingMiley[i].y > currentLeapPosition.top -threshold &&
					fallingMiley[i].y < currentLeapPosition.top +threshold &&
					fallingMiley[i].x > currentLeapPosition.left -threshold &&
					fallingMiley[i].x < currentLeapPosition.left +threshold &&
					!fallingMiley[i].boomed) 
				{
					fallingMiley[i].image.src = 'img/mileybonus.png';
					fallingMiley[i].boomed = true;
					fallingMiley[i].speed = 0.9;
					var mileySound = new Audio('sounds/miley.mp3');
					mileySound.volume=0.8;
					mileySound.play();
					Score += 20 * 100;
					document.getElementById("scorediv").textContent = "Bieberscore:  " + Score
				}
			}
		}





		function setup() {
			var canvas = document.getElementById('starfield');

			if (canvas.getContext) {
				ctx = canvas.getContext('2d');

				for (var i = 0; i < noOfBiebs; i++) {
					var fallingBe = {
						image: new Image(),
						boomed: false,
						x: parseInt(Math.random() * 1200, 10),
						y: parseInt(Math.random() * 5, 10),
						speed: 2 + Math.random() * 4
					};
					fallingBe.image.src = imgBg[Math.floor((Math.random()*3)+1)];
					fallingBiebs.push(fallingBe);
				}
			}
		}
		setup();


		function redSetup() {
			var canvas = document.getElementById('starfield');

			if (canvas.getContext) {
				ctx = canvas.getContext('2d');

				for (var i = 0; i < noOfReds; i++) 	{
					var fallingRed = {
						image: new Image(),
						boomed: false,
						x: parseInt(Math.random() * 1200, 10),
						y: parseInt(Math.random() * 5, 10),
						speed: 2 + Math.random() * 4
					};

					fallingRed.image.src = 'img/badbiebs.png';
					fallingRedBiebs.push(fallingRed);
					
					}
			}
		}
		redSetup();


		function mileySetup() {
			var canvas = document.getElementById('starfield');

			if (canvas.getContext) {
				ctx = canvas.getContext('2d');

				for (var i = 0; i < 1; i++) 	{
					var fallingMil = {
						image: new Image(),
						boomed: false,
						x: parseInt(Math.random() * 1200, 10),
						y: parseInt(-300, 0),
						speed: 1 + Math.random() * 1
					};

					fallingMil.image.src = 'img/wreckingball.png';
					fallingMiley.push(fallingMil);
					
				}
			}
		}
		mileySetup();




		function OopsyDaisy() {
			finished = true;
			document.getElementById("OOPS").className += " PLAYER";
 
			function vidplay() {
				var oopsound = new Audio('sounds/oopsbaby.mp3');
				oopsound.volume = 1.0;
				oopsound.play();
			} vidplay();

			document.getElementById("OOPS").innerHTML += "<link href='http://fonts.googleapis.com/css?family=Sancreek' rel='stylesheet'>"
			document.getElementById("OOPS").innerHTML += "<h1 id='LostLeft'>OOPS!</h1>";
		}


			function biebIsDead() {
				finished = true;

				var canvas = document.getElementById('starfield');
				var ctx     = canvas.getContext("2d");
				var dickhead = new Image();
				dickhead.onload = function() {
					ctx.drawImage(dickhead, 200, 200);
				};
				dickhead.src = "img/wreckingball.png";

			}

		})


})();