const jimp = require('jimp');
const fs = require('fs');

function imageToJSON(path) {
	jimp.read(path, (err, image) => {
		if (err) throw err;

		const width = image.bitmap.width;
		const height = image.bitmap.height;

		const pixels = [];

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const rgba = jimp.intToRGBA(image.getPixelColor(x, y));
				// ignore transparent pixels
				if (rgba.a === 0 || (rgba.b === 255, rgba.g === 255, rgba.r === 255)) continue;
				const pixel = {
					x,
					y,
					data: [rgba.r, rgba.g, rgba.b, rgba.a],
				};
				pixels.push(pixel);
			}
		}

		const objects = [];

		for (let i = 0; i < pixels.length; i++) {
			const obj = {
				...pixels[i],
			};
			objects.push(obj);
		}

		const json = JSON.stringify(objects);

		fs.writeFile('picture.json', json, (err) => {
			if (err) throw err;
			console.log('File saved as picture.json');
		});
	});
}

imageToJSON('picture copy.jpg');