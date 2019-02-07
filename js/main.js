let s = 10;

function setup() {
	let w = 0;
	let h = 0;

	for (let i = 0; i < nn.weights.length; i++) {
		if (nn.weights[i].cols * s > w) {
			w = nn.weights[i].cols * s;
		}
		h += nn.weights[i].rows * s;
	}

	createCanvas(w, h);
	frameRate(10);
	background(0);
	noStroke();
}

function draw() {
	let weights = nn.weights[0];
	let y = 0;

	for (let i = 0; i < nn.weights.length; i++) {

		for (let j = 0; j < nn.weights[i].rows; j++) {
			for (let k = 0; k < nn.weights[i].cols; k++) {
				fill(nn.weights[i].matrix[j][k] * 255);
				rect(k*s, j*s+y, s, s);
			}
		}
		y += nn.weights[i].rows * s;
	}
}