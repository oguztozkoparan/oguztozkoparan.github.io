class Rain {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.width = random(3);
    this.height = random(3);
  }
  display() {
    fill(255, 255, 255);
    ellipse(this.x, this.y, this.width, this.height);
    fill(255, 255, 255, random(10, 25));
    ellipse(this.x, this.y, this.width + 10, this.height + 10);
  }
  update() {
    if (this.y > height) {
      this.y = 0;
    } else {
      this.y += random(1, 3) + this.height;
    }
  }
}

let rains = [];

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("main");
  canvas.style("position", "fixed");
  canvas.style("top", "0");
  canvas.style("z-index", "-1");

  for (var i = 0; i < 600; i++) {
    rains.push(new Rain());
  }
}

function draw() {
  noStroke();
  background(0);
  for (var i = 0; i < 600; i++) {
    rains[i].display();
    rains[i].update();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
