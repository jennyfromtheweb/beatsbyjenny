var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    grad = null,
    gradStops = {
        speed : 0.3,
        colA: {
            brightness: 235,
            lighten: 5
        },
        colB: {
            brightness: 235,
            lighten: 5
        }
    },
    cycle = 0;

  function colorCycle(cycle, bright, light) {
      bright = bright || 255;
      light = light || 0;
      cycle *= .1;
      var r = ~~ (Math.sin(.3 * cycle + 0) * bright + light),
          g = ~~ (Math.sin(.3 * cycle + 2) * bright + light),
          b = ~~ (Math.sin(.3 * cycle + 4) * bright + light);

      return 'rgb(' + Math.min(r, 255) + ',' + Math.min(g, 255) + ',' + Math.min(b, 255) + ')';
  }


  function colorize() {
      cycle += gradStops.speed;
      grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, colorCycle(cycle, gradStops.colA.brightness, gradStops.colA.lighten));
      grad.addColorStop(1, colorCycle(cycle + 60, gradStops.colB.brightness, gradStops.colB.lighten));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      requestAnimationFrame(colorize);
  }

  setTimeout(function () {
      width = canvas.width = window.innerWidth,
      height = canvas.height = document.body.offsetHeight;
      colorize();
  },100);

  window.onresize = function () {
    height = canvas.height = document.body.offsetHeight;
    width = canvas.width = document.body.offsetWidth;
  };

  window.onload = function() {
    var reset = false;
  	var avgBPM = 0;
    var firstBeat = 0;
  	var currTime = 0;
  	var numTaps = 0;

    var fadeMark = 25;
    var fadeOpacity = 0.4;

    var intro1 = "Begin by tapping the beat on the screen.";
    var intro2 = "Continue tapping for greater accuracy.";
    var intro3 = "Sit back and watch the light show.";

  	document.getElementById("start").onclick = function count() {
      if (!reset) {
    		if (firstBeat == 0) {
    			startTimer();
    		}
    		currTime = Date.now();
    		calcAverage();
        numTaps += 1;

        if (numTaps < 3) {
          document.getElementById("BPM").innerHTML = "calculating... ";
        } else {
    		  document.getElementById("BPM").innerHTML = Math.round(avgBPM) + " bpm";
          gradStops.speed = (avgBPM / 52.45);
        }

        if (numTaps == 1) {
          document.getElementById("numTaps").innerHTML = numTaps + " tap";
        } else {
    		  document.getElementById("numTaps").innerHTML = numTaps + " taps";
        }

        if (numTaps == 10) {
          changeIntro(intro2);
        }
        else if (numTaps == fadeMark) {
          changeIntro(intro3);
        }

      } else {
        reset = false;
      }
    }

  	function startTimer() {
      firstBeat = Date.now();
  	}

  	document.getElementById("reset").onclick = function resetTimer() {
      reset = true;
      avgBPM = 0;
      firstBeat = 0;
      currTime = 0;
      numTaps = 0;
      gradStops.speed = 0.3;

      document.getElementById("BPM").innerHTML = avgBPM + " bpm"
      document.getElementById("numTaps").innerHTML = numTaps + " taps";
      changeIntro(intro1);

      // fIn();
  	}

    function calcAverage() {
      if (numTaps > 1) {
        var diff = currTime - firstBeat;
        avgBPM = 60000 * numTaps / diff;
      }
    }

    // FADING

    function changeIntro(s) {
      $("#intro").fadeOut(
        function() {
          if (s == intro1) {
            $("#intro, #BPM, #numTaps, #reset").fadeTo(1000, 1);
          };
          $(this).text(s).fadeIn(1000);
          if (s == intro3) {
            $("#intro, #BPM, #numTaps, #reset").fadeTo(1000, 1);
            $("#intro, #BPM, #numTaps, #reset").fadeTo(2500, fadeOpacity);;
          }
        }
      );
    }

    function changeBPMText(s) {
      $("#BPM").fadeOut(function() {
        $(this).text(s).fadeIn(100);
        }
      );
    }

    $("#intro, #BPM, #numTaps, #reset").hover(
      function() {
        if (numTaps >= fadeMark) {
          $(this).fadeTo(600, 1); 
        }
      },
      function() {
        if (numTaps >= fadeMark) {
          $(this).fadeTo(1000, fadeOpacity);
        }
      }
    );
    
  }