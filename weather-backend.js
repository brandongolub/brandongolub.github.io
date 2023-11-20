require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

/* Daily motivational quote*/
app.get('/quote', async (req, res) => {
  console.log("Quote route hit");
  try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
      await page.goto('https://www.brainyquote.com/feeds/todays_quote', { waitUntil: 'networkidle0' });
      await page.waitForSelector('.well');
      // Assuming the quote is not dynamically loaded after scrolling
      let quoteText = await page.$eval('.well', el => el.textContent.trim());
      const startToRemove = "Today's Quote";
        if (quoteText.startsWith(startToRemove)) {
            quoteText = quoteText.substring(startToRemove.length).trim();
        }

        // Remove "more quotes" from the end
        const endToRemove = "more Quotes";
        if (quoteText.endsWith(endToRemove)) {
            quoteText = quoteText.substring(0, quoteText.length - endToRemove.length).trim();
        }
      
      await browser.close();
      res.json({quote: quoteText});

  } catch (error) {
      console.error('error fetching quote: ', error.message);
      res.status(500).send('Error fetching quote');
  }
});

//Fetching weather for inputted city
app.get('/weather', async (req, res) => {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ message: 'City is required' });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather`;

  try {
    const response = await axios.get(url, {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric',
      }
    });
    const description = response.data.weather[0].description;
    
    let precipitation = '';
    for(let condition of response.data.weather){
      if(condition.main === 'Rain'){
        precipitation = 'Raining';
        break;
      }
      else if (condition.main === 'Snow'){
        precipitation = 'Snowing';
        break;
      }
    }
    // if any(item['main'] == 'Rain' for item in weathervar):
    //     precipitation = 'Raining';
    //   } else if (response.data.snow) {
    //     precipitation = 'Snowing';
    //   }
    res.json({ 
        city: response.data.name, 
        temperature: response.data.main.temp,
        description: description,
        precipitation: precipitation,  
        timezoneOffset: response.data.timezone     
    });
  } catch (error) {
    if (error.response) {
      // An HTTP response was received; handle accordingly
      res.status(error.response.status).json({ message: error.response.data.message });
    } else {
      // No response was received; handle generic error
      console.error('Error fetching weather data:', error.message);
      res.status(500).json({ message: "Error fetching weather data" });
    }}
});

app.listen(port, () => {
  console.log(`Weather backend running on http://localhost:${port}`);
});
