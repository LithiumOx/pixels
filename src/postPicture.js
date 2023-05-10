import fs from 'fs';
import axios from 'axios';
import cliProgress from 'cli-progress';
import { setTimeout } from 'timers/promises';

let development = true;

const URL = !development
	? 'http://api.pixels.codam.nl/api/single'
	: 'http://localhost:5173/api/single';
const HEADERS = { 'x-real-ip': 'joe mama' };
const SLEEP_DURATION = 1000;
const MAX_RETRIES = 3;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function sendPixel(pixel) {
	try {
		const response = await axios.post(URL, pixel).catch(async (error) => {
			if (error.response && error.response.status === 429) {
				await setTimeout(error.response.data.timeToWait);
				return sendPixel(pixel);
			} else {
				throw error;
			}
		});
	} catch (error) {
		console.error('Error while sending pixel:', error);
		throw error;
	}
}

export async function postJSONToServer() {
	try {
		const jsonStr = await fs.promises.readFile('tmp/picture.json', 'utf8');
		const jsonArr = jsonStr.split('\n').map((str) => JSON.parse(str));
		const pixels = jsonArr.flat();

		// Initialize progress bar
		const bar = new cliProgress.SingleBar(
			{
				format:
					'Sending pixels ' +
					'{bar}' +
					' {percentage}% || {value}/{total} pixels sent',
				barCompleteChar: '\u2588',
				barIncompleteChar: '\u2591',
				hideCursor: true,
			},
			cliProgress.Presets.shades_classic,
		);

		bar.start(pixels.length, 0);

		for (let i = 0; i < pixels.length; i++) {
			await sendPixel(pixels[i]);
			bar.increment(1);
		}

		bar.stop();
		console.log('File sent successfully!');
	} catch (err) {
		console.error(`Error reading or parsing JSON file: ${err}`);
	}
}

export { development };
