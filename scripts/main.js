// select all imgs
var imgs = document.querySelectorAll("div#gameboard > img");
var borderGame = [];

// Scroe
var scoreCount = document.querySelector("span#count");

// Button Start
var startButt = document.querySelector("input#start");
startButt.onclick = startGame;

// Button Stop
var stopButt = document.querySelector("input#stop");
stopButt.onclick = exitGame;

// Audio win
var audioEffect = document.querySelector("audio#effect");
var audioBackground = document.querySelector("audio#background");
audioBackground.volume = 0.1;
audioEffect.volume = 0.5;

// popupWin
var popupWin = document.querySelector("div#win");
var start = false;
var clicked = false;

// Timer
var timer = document.getElementById("timer");
var timerInterval = false;

// Functions
function clickedSystem() {
  this.src = borderGame[this.id];
  this.style.borderColor = "#ff3737";
  var ele = this;

  setTimeout(function () {
    // Check repeat
    imgs = document.querySelectorAll("div#gameboard > img");
    var countRepeat = 0;
    for (let img of imgs) {
      if (img.src == ele.src && !ele.src.includes("Moon")) countRepeat++;
    }

    if (countRepeat > 1 && countRepeat % 2 == 0) {
      ele.removeEventListener("click", clickedSystem);
      audioEffect.play();
      ele.style.borderColor = "#1fc142";
      if (clicked) scoreCount.innerText++;
      clicked = !clicked;
    } else {
      imgs[ele.id].src = imgs[ele.id].src.replace(/\d.gif$/g, "Moon.gif");
      ele.style.borderColor = "#7289da";
    }

    var countMoons = 0;
    for (let img of imgs) {
      if (img.src.includes("Moon")) countMoons++;
    }
    if (!countMoons) {
      audioEffect.pause();
      audioBackground.src = "./sound/levelComplete.mp3";
      popupWin.style.display = "block";
      clearInterval(timerInterval);
      setTimeout(function () {
        exitGame();
        popupWin.style.display = "none";
        audioBackground.src = "./sound/worldMap.mp3";
      }, 10000);
    }
  }, 750);
}
function startGame() {
  // Check game
  if (start) {
    exitGame();
  } else {
    start = true;
    if (!audioEffect.src.includes("pop.mp3"))
      audioEffect.src = "./sound/pop.mp3";
    audioEffect.play();
    setTimeout(function () {
      audioEffect.src = "./sound/connectBubbles.mp3";
      audioEffect.volume = 0.3;
    }, 1000);
  }

  // make gamebord
  for (let i = 1; i < 7; i++) {
    borderGame.push("./images/memoryGame/" + i + ".gif");
    borderGame.push("./images/memoryGame/" + i + ".gif");
  }

  // Random items
  borderGame = borderGame.sort(function () {
    return 0.5 - Math.random();
  });

  // Start game
  setTimeout(function () {
    for (let i = 0; i < borderGame.length; i++) {
      imgs[i].src = borderGame[i];
    }
  }, 1000);
  setTimeout(function () {
    for (let i = 0; i < borderGame.length; i++) {
      imgs[i].src = imgs[i].src.replace(/\d.gif$/g, "Moon.gif");
      imgs[i].addEventListener("click", clickedSystem);
      imgs[i].style.cursor = "grab";
    }
    timerInterval = setInterval(function () {
      var [mints, secounds] = timer.innerText.split(":");
      console.log(secounds++);
      if (secounds < 60) {
        timer.innerText =
          secounds > 9 ? mints + ":" + secounds++ : mints + ":0" + secounds++;
      } else {
        secounds = 0;
        mints++;
        timer.innerText = mints > 9 ? mints + ":00" : "0" + mints + ":00";
      }
    }, 1000);
  }, 3000);
}
function exitGame() {
  if (!start) return;
  borderGame = [];
  scoreCount.innerText = 0;
  timer.innerText = "00:00";
  clearInterval(timerInterval);
  document.querySelectorAll("div#gameboard > img").forEach((img) => {
    img.removeEventListener("click", clickedSystem);
    img.src = "./images/memoryGame/Moon.gif";
    img.style.borderColor = "#7289da";
    img.style.cursor = "not-allowed";
  });
}

// Disabled right click
document.addEventListener("contextmenu", (event) => event.preventDefault());

window.onload = () => document.getElementById('background').play();
