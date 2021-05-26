let configFile = require('./src/config');
let fetchFile = require('./src/fetcher');
configFile = configFile.config;
let login = configFile['api'] + 'login';

const pageScraper = {
    url: login,
    async scraper(browser, category) {
        let page = await browser.newPage();
        await page.goto(this.url);
        await page.setViewport({
            width: 1000,
            height: 1000
        });
        console.log(`Navigating to ${this.url}...`);
        await page.type('input[name=email]', configFile['email']);
        await page.type('input[name=password]', configFile['password']);
        console.log('Typing user input fields for Polligon... ');
        console.log('Submitting form...');
        await page.click('input[type=submit]');
        console.log('Login form submitted...');
        await page.waitFor(120);
        const fetcher = await fetchFile.serverQuery("https://ci6l4fta7s-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)%3B%20Browser%3B%20instantsearch.js%20(4.9.2)%3B%20JS%20Helper%20(3.3.4)&x-algolia-application-id=CI6L4FTA7S&x-algolia-api-key=ae0606f59fb6ced5ee862c13e8463896",
            {
                "Content-Type": "application/json",
                "Refer": "https://www.poliigon.com/",
                "Origin": "https://www.poliigon.com/"
            }, 'POST',
            JSON.stringify({
                "requests": [
                    {
                        "indexName": "production_index",
                        "params": "query=&maxValuesPerFacet=50&page=0&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&filters=type%3Atexture%20OR%20type%3Asubstance%20AND%20free%3A1&facets=%5B%22workflow%22%2C%22sizes%22%2C%22filters_categories.lvl0%22%2C%22id%22%5D&tagFilters="
                    }
                ]
            }));
        let jsonResponse = await fetcher.json();
        let jsonOutPut = jsonResponse.results[0].hits;
        for (let currentElement of jsonOutPut) {
            if (currentElement.type.toLowerCase() === category.toLowerCase()) {
                let currentURL = `https://www.poliigon.com/${category.toLowerCase()}/${currentElement.name.toLowerCase().split(" ").join('-')}`;
                let newPage = await browser.newPage();
                await newPage.goto(currentURL)
                await newPage.waitForNavigation();
                await newPage.evaluate(() => document.getElementById('resolution').value = "1K"); //here u can change RESOLUTION :)
                await newPage.evaluate(() => document.getElementById('free_download').click());
                //close after 6 seconds (normal wait for modal)
                setTimeout(function () {
                    newPage.close();
                }, 6000);
            }
        }
    }
};
module.exports = pageScraper;