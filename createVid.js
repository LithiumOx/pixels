// create a program that listens in a websocket Uint8Array and returns a picture of 200x200 pixels in a folder called 'pictures' in png format

const fs = require('fs');
const path = require('path');
const { createCanvas, Image } = require('canvas');
const WebSocket = require('ws');

const canvas = createCanvas(200, 200);
const ctx = canvas.getContext('2d');

let width, height, imageData;

const ws = new WebSocket('ws://localhost:3000/canvas');

ws.binaryType = 'arraybuffer';

ws.addEventListener('message', (event) => {
	const data = JSON.parse(event.data);

	if (data.width && data.height) {
		width = data.width;
		height = data.height;

		canvas.width = width;
		canvas.height = height;

		imageData = ctx.createImageData(width, height);
	} else if (data.data) {
		const pixels = new Uint8ClampedArray(data.data);

		for (let i = 0; i < pixels.length; i += 4) {
			const r = pixels[i];
			const g = pixels[i + 1];
			const b = pixels[i + 2];
			const a = pixels[i + 3];

			const x = (i / 4) % width;
			const y = Math.floor(i / 4 / width);

			const index = (y * width + x) * 4;

			imageData.data[index] = r;
			imageData.data[index + 1] = g;
			imageData.data[index + 2] = b;
			imageData.data[index + 3] = a;
		}

		ctx.putImageData(imageData, 0, 0);
	}
});

setInterval(() => {
	const now = new Date();
	const filename = `${now.toISOString()}.png`;
	const filepath = path.join('pictures', filename);

	const out = fs.createWriteStream(filepath);
	const stream = canvas.createPNGStream();

	stream.pipe(out);
}, 30000);