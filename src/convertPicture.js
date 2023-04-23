import jimp from 'jimp';
import fs from 'fs';

export function imageToJSON(path, targetWidth, targetHeight) {
	return new Promise((resolve, reject) => {
		jimp.read(path, (err, image) => {
			if (err) {
				reject(err);
				return;
			}

			// if the image above the target size, resize it
			if (
				image.bitmap.width > targetWidth ||
				image.bitmap.height > targetHeight
			) {
				image.resize(targetWidth, targetHeight);
			}

			const width = image.bitmap.width;
			const height = image.bitmap.height;

			const pixels = [];

			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					const rgba = jimp.intToRGBA(image.getPixelColor(x, y));
					// ignore transparent pixels
					if (rgba.a === 0) {
						continue;
					}
					const pixel = {
						x,
						y,
						color: [rgba.r, rgba.g, rgba.b, rgba.a],
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

			// if the picture.json already exists remove it
			if (!fs.existsSync('tmp')) {
				fs.mkdirSync('tmp');
			}
			if (fs.existsSync('tmp/picture.json')) {
				fs.unlink('tmp/picture.json', (err) => {
					if (err) {
						console.error(err);
						reject(err);
						return;
					}
				});
			}

			if (fs.existsSync('tmp/picture.json')) {
				fs.unlink('tmp/picture.json', (err) => {
					if (err) {
						console.error(err);
						reject(err);
						return;
					}
				});
			}

			fs.writeFile('tmp/picture.json', json, (err) => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
	});
}
