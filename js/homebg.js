(function() {
  // shim layer with setTimeout fallback
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

  var maxDepth  = 16;
  var numStars  = 512;
  var stars     = new Array(numStars);

  // Use W3C model. IE < 9 doesn't support <canvas> anyway
  document.addEventListener('DOMContentLoaded', function() {
    var canvas  = document.getElementById('starfield');
    var ctx     = canvas.getContext("2d");

    var onResize = function() {
      canvas.width  = document.body.clientWidth;
      canvas.height = document.body.clientHeight;

      //content.style.paddingTop = parseInt(document.body.clientHeight / 4) + 'px';
    }

    var between = function(min, max) {
      return min + Math.floor((max - min - 1) * Math.random());
    }

    var init = function() {
      // Annoyingly can't use forEach on an array with undefined values.
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
          // the stars are moving towards camera thus must be blue due to doppler effect
          ctx.fillStyle = "rgb(" + shade + "," + shade + "," + parseInt(shade * 1.9) + ")";
          ctx.beginPath();
          ctx.arc(projectedX, projectedY, size / 2, 0, Math.PI * 2, false);
          ctx.fill();
        }
      })

      requestAnimFrame(animateFrame);
    }

    init();
    requestAnimFrame(animateFrame);
  })
})();