import fs from 'fs';
import axios from 'axios';
import cliProgress from 'cli-progress';
import { setTimeout } from 'timers/promises';
import { cli } from 'cli-ux';

let development = true;

const URL = !development
	? 'http://api.pixels.codam.nl/api/batch'
	: 'http://localhost:5174/api/batch';
const HEADERS = { 'x-real-ip': 'joe mama' };
const SLEEP_DURATION = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

		// Send pixels one by one as long as the previous one was successful
		let i = 0;
		while (i < pixels.length) {
			try {
				const pixel = pixels[i];
				await axios.post(URL, pixel, {
					headers: HEADERS,
					timeout: 30000,
				});

				bar.increment(1);
				i++;
			} catch (err) {
				console.error(`Error sending pixel to server: ${err}`);

				// If there was an error, wait and try again
				await sleep(SLEEP_DURATION);
			}
		}

		bar.stop();
		cli.action.stop('File sent successfully!');
	} catch (err) {
		console.error(`Error reading or parsing JSON file: ${err}`);
	}
}

export { development };
