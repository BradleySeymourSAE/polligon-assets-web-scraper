require('dotenv').config();
const request = require('request');
const fs = require('fs');
const https = require('https');




let login = process.env["API"] + 'login';


const handleDownload = (url, destination) => new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    https.get(url, response => {
        response.pipe(file);

        file.on('finish', () => {
            file.close(resolve(true));
        });
    })
    .on('error', error => {
        fs.unlink(destination);

        reject(error.message);
    });
});

const pageScraper = {
    url: login,
    async scraper(browser, category)
    {

        let page = await browser.newPage();

        await page.goto(this.url);

        await page.setViewport({ 
            width: 1000,
            height: 1000
        });

        console.log(`Navigating to ${this.url}...`);

        // type username and password input 
        await page.type('input[name=email]', process.env["USER_EMAIL"]);
        await page.type('input[name=password]', process.env["USER_PASSWORD"]);
        console.log('Typing user input fields for Polligon... ');
        
        console.log('Submitting form...')
        // submit the form 
        await page.click('input[type=submit]');

        console.log('Login form submitted...');
        await page.waitFor(120);       

        let currentPageUrl = page.url();

        await page.goto(currentPageUrl.concat(`${category}/?refine_by=assets-free`));

        await page.waitForNavigation();
      
       const links = await page.evaluate(() => Array.from(document.querySelectorAll('.modal-trigger a'), element => element.getAttribute('href')));

       console.log('This is where I am up to currently - needing to loop through async. Painfully.');
        await Promise.all(links.map(async (link, i) => {

            let currentLink = link.toString();

            if (!currentLink.startsWith("https://www.poliigon.com/texture/"))
            {
                console.log('Doesnt start with texture -- returning.');
                return;
            }
            else
            {
                let newPage = await browser.newPage();

                  
                    console.log(`Downloading ${currentLink} - ${i} - out of ${links.length}`);

                await newPage.close();
            }
        }));



    }
};


module.exports = pageScraper;