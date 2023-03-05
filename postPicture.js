const axios = require('axios');
const fs = require('fs');
const { setTimeout } = require('timers/promises');

let development = false;

let url = !development ? 'http://api.pixels.codam.nl/canvas/single' : 'http://localhost:3000/canvas/single';
const headers = { 'x-real-ip': 'joe mama' };

let timeout = 0;

async function postJSONToServer() {
	// Read the contents of the file into a string
	console.log(url);
	const jsonStr = await fs.promises.readFile('picture.json', 'utf8');

	// Parse the JSON string into an array of objects
	const jsonArr = jsonStr.split('\n').map((str) => JSON.parse(str));

	// Loop over the array of objects and per 250 objects take a pause of one second then repeat until all objects are posted
	// randomize the order of the objects
	const randomizedArr = jsonArr[0].sort(() => Math.random() - 0.5);

	for (let i = 0; i < randomizedArr.length; i += 400) {
		const data = randomizedArr.slice(i, i + 400);
		for (let j = 0; j < data.length; j++) {
			await axios.post(url, data[j], { headers })
				.catch(err => { console.error("Server wants me to wait.. cringe.. Waiting: " + err.response.data.error + "ms"), timeout = err.response.data.error, j--; });
			// console.log(` (${Math.floor(((j + i + 1) / randomizedArr.length) * 100)}%)`);
			// print progress bar
			const progress = Math.floor(((j + i + 1) / randomizedArr.length) * 100);
			const progressStr = `Sent pixel ${j + i + 1} of ${randomizedArr.length} (${progress}%) `;
			const progressStrLength = progressStr.length;
			const progressStrLengthDiff = 100 - progressStrLength;
			const progressStrDiff = ' '.repeat(progressStrLengthDiff);
			const progressStrFinal = progressStr + progressStrDiff;
			process.stdout.write(progressStrFinal + '\r');
			await setTimeout(timeout);
			timeout += 1;
		}
		// await setTimeout(1500);
	}
	// for (let i = 0; i < jsonArr[0].length; i += 200) {
	// 	const data = jsonArr[0].slice(i, i + 200);
	// 	for (let j = 0; j < data.length; j++) {
	// 		await axios.post('http://api.pixels.codam.nl/canvas/single', data[j])
	// 		.catch (err => {console.log(err), setTimeout(4000)});
	// 		console.log(`Sent pixel ${j + i + 1} of ${jsonArr[0].length}` + ` (${Math.floor(((j + i + 1) / jsonArr[0].length) * 100)}%) ` + '\r');
	// 		await setTimeout(15);
	// 	}
	// 	await setTimeout(1000);
	// }

	// save progress to file and log it
	// await fs.promises.writeFile('progress.txt', `${jsonArr[0].length} pixels sent`);
	// console.log(`${jsonArr[0].length} pixels sent`);
};

postJSONToServer();
