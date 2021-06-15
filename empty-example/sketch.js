let breakSfx;

let cookies = [];
let score = 0;
let timeUp;
let timeUpSecond;

// ready, playing, finalize
let state = 'ready'
let cookieImage
let cookieBiteImage

let isTouching = false
let hasSuccess = false

class cookie {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.active = false;
    this.activeStart = 0;
    this.bite = false;
  }

  draw() {
    fill(0);
    ellipse(this.x, this.y, 24, 24);
    if (this.active) {
      if (this.bite) {
        image(cookieBiteImage, this.x - 40, this.y - 40, 80, 80);
      } else {
        image(cookieImage, this.x - 40, this.y - 40, 80, 80);
        this.hasTouchedInActive()
      }
    }
  }


  hasTouchedInActive () {
    if (isTouching) {
      if (Math.abs(mouseX - this.x) + Math.abs(mouseY - this.y) < 60) {
        this.bite = true
        score += 10
        hasSuccess = true
        if (breakSfx.isPlaying()) {
          breakSfx.stop();
        }
        breakSfx.play();
      }
    }
  }
}

function preload() {
  state = 'ready';
  score = 0;
  cookies = [];
  cookieImage = loadImage('../res/cookie.png');
  cookieBiteImage = loadImage('../res/cookie-bite.png');
  breakSfx = loadSound('../res/break-sfx.wav');
}

function setup() {
  createCanvas(displayWidth, displayHeight)
  cookies = []
  score = 0;

  const spacing = width / 30;
  const count = 3;
  const marginX = width / count - spacing * 2;
  const marginY = (height - min(displayHeight * 0.7, 150)) / count - spacing * 2;

  for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
      let x = (i + 1) * marginX;
      let y = (j + 1) * marginY;

      let instance = new cookie();
      instance.x = x;
      instance.y = y;

      cookies.push(instance);
    }
  }
}

function draw() {
  if (state === 'ready') {
    background(200, 200, 200);
    fill(0);
    textAlign(CENTER);
    textSize(40);
    text('민주의 쿠키를 부숴라!', width / 2, height / 2 - 30);
    textSize(20);
    text('시작하려면 터치하세요!', width / 2, height / 2 + 10);

    if (isTouching) {
      isTouching = false
      state = 'playing'
      timeUp = millis() + 10 * 1000;
      timeUpSecond = 10
    }
  }
  else if (state === 'playing') {
    background(200, 200, 200);
    fill(0);
    textAlign(CENTER);
    textSize(40);
    text('민주의 쿠키를 부숴라!', width / 2, 60);
    textSize(20);
    text('획득 점수: ' + score.toLocaleString() + '점', width * 4 / 5, 100);
    text('남은 시간: ' + timeUpSecond.toLocaleString() + '초', width * 4 / 5, 120);

    let tick = millis() / 1000;
    let timeOut = 1;
    let activeCount = 0;

    for (let i = 0; i < cookies.length; i++) {
      cookies[i].draw();

      if (cookies[i].active) {
        activeCount++;

        if (tick - cookies[i].activeStart > timeOut) {
          cookies[i].active = false;
          if (!hasSuccess) {
            score -= 5;
          }
        }
      }
    }

    if (int(tick) % 2 === 0 && activeCount < 1) {

      for (let j = 0; j < 3; j++) {
        let randIndex = int(random(0, cookies.length));
        cookies[randIndex].active = true;
        cookies[randIndex].bite = false;
        cookies[randIndex].activeStart = millis() / 1000 + int(random(0, 2));
      }
      hasSuccess = false;
    }

    if (isTouching) {
      isTouching = false;
      if (!hasSuccess) {
        score -= 5;
      }
    }

    if (timeUp < millis()) {
      state = 'finalize';
    } else {
      timeUpSecond = Math.ceil((timeUp - millis()) / 1000);
    }
  }
  else if (state === 'finalize') {
    background(20, 20, 20);
    textAlign(CENTER);

    fill(200);
    textSize(40);
    text('민주의 쿠키를 부숴라!', width / 2, height / 2 - 100);
    textSize(20);
    text('게임 종료!', width / 2, height / 2 - 70);

    textSize(40);
    text(score.toLocaleString() + '점!', width / 2, height / 2 + 30);
    textSize(24);
    text('다시 시작하려면 터치하세요!', width / 2, height / 2 + 80);

    if (isTouching) {
      state = 'playing';
      score = 0;
      timeUp = millis() + 10 * 1000;
      timeUpSecond = 10;
      isTouching = false;
      hasSuccess = true;
    }
  }
}

function touchEnded() {
  isTouching = true;
  hasSuccess = false;
}
