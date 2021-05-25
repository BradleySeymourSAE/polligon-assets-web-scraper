
const express = require('express');
const { startBrowser } = require('./initialize-browser');
const pageScraper = require('./scraper');
require('dotenv').config();


// const categories = ["textures", "models", "hdrs", "brushes"];


async function Main(){

    const app = express();

    let port = 5000;

    app.listen(port, () => {
        console.log(`App is listening on port ${port}`);
    });

    if (!process.env["USER_EMAIL"] || !process.env["USER_PASSWORD"])
    {
        console.error("Please set an environment file with your USER_EMAIL and USER_PASSWORD params");
        return;
    }
    else if (!process.env["API"])
    {
        console.error("Please set the API in the config file to https://www.poliigon.com/");
        return;
    }


    const browserInstance = await startBrowser();

    await pageScraper.scraper(browserInstance, "textures");
  
}


Main();



