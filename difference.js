const fs = require('fs');

// make a function that takes two json files it compares them and returns the difference to diff.json
// the wifth and height of the image should be the same in both files but the data can be different
function difference(file1, file2) {
	let data1;
	let data2;

	data1 = fs.open(file1, 'r', (err, fd) => {
		if (err) throw err;
		console.log('File 1 opened');
	}
	);
	console.log(JSON.stringify(data1));

	data2 = fs.open(file2, 'r', (err, fd) => {
		if (err) throw err;
		console.log('File 2 opened');
	}
	);

	// compare the objects in the arrays
	// if the objects are the same, remove them from the array
	// if the objects are different, add them to the diff array
	// write the diff array to diff.json

	const diff = [];

	// for (let i = 0; i < data1.length; i++) {
	// 	if (data1[i] === data2[i]) {
	// 		data1.splice(i, 1);
	// 		data2.splice(i, 1);
	// 	}
	// 	else {
	// 		diff.push(data1[i]);
	// 	}
	// }

	// write the diff array to diff.json
	fs.writeFile('diff.json', diff, (err) => {
		if (err) throw err;
		console.log('File saved as diff.json');
	}
	);
}

difference('picture.json', 'rick.json');