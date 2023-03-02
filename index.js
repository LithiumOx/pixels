const axios = require('axios');

let w = 0;
let h = 0;

// create a fetch query that posts data to a server with axios
const fetchQuery = (url, data) => {
	return new Promise((resolve, reject) => {
		axios.post(url, data).then(res => {
			resolve(res.data);
		}).catch(err => {
			reject(err);
		});
	});
}

const createObj = (width, height, data) => {
	return {
		width: width,
		height: height,
		data: data,
	};
}

// create a fucntion that randomizes the width height and color data randomly [0,0,0,0]
	function generateColorRGBA() {
		const color = [];
		for (let i = 0; i < 4; i++) {
			color.push(Math.floor(Math.random() * 255));
		}
		return color;
	}

	function createPixelData(width, height) {
		data = generateColorRGBA();
		const pixelData = createObj(width, height, data);
		// console.log(pixelData, `${width} | ${height}\n`);
		fetchQuery('http://api.pixels.codam.nl/canvas/single', pixelData).catch(err => { console.log(err) });
	}

// call the createPixelData function 100 times

function infiniteLoop() {
	for (let i = 0; i < 200; i++) {
		if (w == 200 && h == 200) {
			w = 0;
			h = 0;
		} else if (w == 200 && h < 200) {
			h++;
			w = 0;
		} else if (w < 200 && h != 200) {
			w++;
		}
		createPixelData(w, h);
	}
	console.log('Sent 250 pixels ✨\n');
	setTimeout(infiniteLoop, 1000);
}

infiniteLoop();