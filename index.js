import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { imageToJSON } from './src/convertPicture.js';
import { postJSONToServer } from './src/postPicture.js';
import chalk from 'chalk';
import emoji from 'node-emoji';

const imageDir = './images';

const readdirAsync = (path) => {
	return new Promise((resolve, reject) => {
		fs.readdir(path, (err, files) => {
			if (err) {
				reject(err);
			} else {
				resolve(files);
			}
		});
	});
};

const questionAsync = (rl, question) => {
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			resolve(answer);
		});
	});
};

const getImageFiles = async () => {
	try {
		const files = await readdirAsync(imageDir);
		return files.filter((file) => {
			const extension = path.extname(file).toLowerCase();
			return (
				extension === '.png' ||
				extension === '.jpg' ||
				extension === '.jpeg'
			);
		});
	} catch (err) {
		console.error(err);
	}
};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

async function waitForInput(rl, imageFiles) {
	let selectedIndex = 0;

	// Print the list of image files
	console.log('Select an image:');
	printImageFiles(imageFiles, selectedIndex);

	rl.input.setRawMode(true);
	readline.emitKeypressEvents(rl.input);

	return new Promise((resolve) => {
		rl.input.on('keypress', async (key, info) => {
			if (info.name === 'up') {
				selectedIndex = Math.max(selectedIndex - 1, 0);
			} else if (info.name === 'down') {
				selectedIndex = Math.min(
					selectedIndex + 1,
					imageFiles.length - 1,
				);
			} else if (info.name === 'return') {
				rl.input.removeAllListeners('keypress');
				rl.input.setRawMode(false); // Disable raw mode before resolving the promise
				console.log(); // Print a newline after the list of image files
				resolve(selectedIndex);
			}

			readline.cursorTo(process.stdout, 0, 0); // Move the cursor to the start of the list
			readline.clearScreenDown(process.stdout); // Clear the console from the cursor down
			printImageFiles(imageFiles, selectedIndex); // Print the list of image files with the selected file highlighted
		});
	});
}

function printImageFiles(imageFiles, selectedIndex) {
	for (let i = 0; i < imageFiles.length; i++) {
		if (i === selectedIndex) {
			console.log(chalk.inverse(` ${i + 1}. ${imageFiles[i]} `));
		} else {
			console.log(` ${i + 1}. ${imageFiles[i]}`);
		}
	}
}

const processImage = async (chosenFile) => {
	try {
		console.log(chalk.yellow(`Processing ${chosenFile}...`));
		await imageToJSON(`images/` + chosenFile, 200, 200);

		console.log(chalk.yellow(`Sending ${chosenFile}...`));
		await postJSONToServer();
		console.log(
			chalk.green(
				`${emoji.get('white_check_mark')} File sent successfully!`,
			),
		);
	} catch (err) {
		console.error(chalk.red(`Error: ${err}`));
	}

	rl.close(); // Move the rl.close() call here
};

const main = async () => {
	const imageFiles = await getImageFiles();

	const selectedIndex = await waitForInput(rl, imageFiles);

	const chosenFile = imageFiles[selectedIndex];

	await processImage(chosenFile); // Call the processImage() function here

	process.exit(0);
};

main();
