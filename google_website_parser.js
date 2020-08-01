/*
 *
 * 	<><><>_____Google website parser_____<><><>
 *
 *	About: Parses website links from a range of searches provided by the .txt file you should link below
 *  	Author: HermitTheAnt
 *	Version: 1.0
 *
 *
 *	Set this to the .txt with search words you want to search (seperated by commas)
 */
const pathToSearchWords = './saved/words.txt';


const fs = require('fs');
const puppeteer = require('puppeteer');

const go = async (s, i) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	const url = 'https://www.google.com/search?q=' + s;

	await page.goto(url);

	const links = await page.evaluate(() => {
		let elm = document.querySelectorAll('a');
		let arr = [];

		elm.forEach(item => {
			if(!item.href.includes('google') && !item.href.includes('youtube')){
				arr.push(item.href + '\n');
			}
		});

		return arr;
	});

	console.log(links);
	return links;

	await browser.close();
};

(async () => {
	var searches;
	fs.readFile(pathToSearchWords, 'utf8', (err, data) => {
		if(err){
			console.log(err);
		}else{
			searches = data;
		}	
	});

	//Wait for words to load from txt file
	setTimeout(() => {
		let finalArr = [];
		searches.split(',').forEach(async (item, index) => {
			setTimeout(async () => {
				let res = await go(item, index)
				finalArr.push(res);
			}, index*500)
			
		});

		console.log(finalArr);

		setTimeout(() => {
			fs.writeFile('./urlList.txt', finalArr, (err) => {
				if(err){
					console.log(err);
				}else{
					console.log('Results have been saved in... urlList.txt');
				}
			})
		}, searches.split(',').length * 510)
	}, 1000)
})();

