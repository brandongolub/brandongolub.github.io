  
  // Function to calculate the background color based on the time of day
  function calculateBackgroundColor(hours) {
    if (hours >= 6 && hours < 18) {
      // Daytime
      return '#ADD8E6'; // Light blue
    } else {
      // Nighttime
      return '#000033'; // Dark blue
    }
  }

  // Function to calculate the contrasting text color based on the background color
  function getContrastingColor(backgroundColor) {
    // Convert the background color to RGB values
    const rgb = backgroundColor.match(/\d+/g).map(Number);

    // Calculate the brightness using the formula: R * 0.299 + G * 0.587 + B * 0.114
    const brightness = (rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) / 255;

    // Determine the text color based on the brightness
    return brightness > 0.5 ? 'black' : 'white';
  }

document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menu-button');
  const pullUpMenu = document.getElementById('pullup-menu');
  const myContainer = document.querySelector('.my_container');
  createCurrencyCounter();
  const moon = document.getElementById('moon');
  const sun = document.getElementById('sun');
  
  

  
  const boardImage = document.getElementById('boardImage');
  boardImage.addEventListener('click', () => {
    const loader = showLoadingIndicator();
    fetchQuoteAndDisplay(loader); // Pass the loader to the fetch function
});

  menuButton.addEventListener('click', () => {
    if (pullUpMenu.style.bottom === '0px') {
      pullUpMenu.style.bottom = '-100%';
    } else {
      pullUpMenu.style.bottom = '0px';
    }
  });

  // Function to update the clock, background color, and celestial objects
  function updateClockBackgroundColorAndCelestial() {
    const now = new Date();
    const hours = now.getHours();

    const backgroundColor = calculateBackgroundColor(hours);
    document.body.style.backgroundColor = backgroundColor;

    if (hours >= 18 || hours < 6) {
      // Nighttime
      moon.style.display = 'block';
      sun.style.display = 'none';
    } else {
      // Daytime
      sun.style.display = 'block';
      moon.style.display = 'none';
    }
  }

  // Initial call to set the clock, background color, and celestial objects
  updateClockBackgroundColorAndCelestial();



  let purchasedItems = {};
  const furnitureRow = document.querySelector('.furniture-row');
  furnitureRow.addEventListener('click', (e) => {
    
    if (e.target.classList.contains('furniture-item')) {
        const furnitureSrc = e.target.getAttribute('data-src');
        const price = parseInt(e.target.getAttribute('data-price'), 10);
        if (purchasedItems[furnitureSrc] || currency >= price) {
          if (!purchasedItems[furnitureSrc]) {
            // Deduct currency only if it's a new purchase
            currency -= price;
            updateCurrencyDisplay();
            purchasedItems[furnitureSrc] = true;
             // Mark as purchased

            // Hide price tag
            const furnitureContainer = e.target.closest('.furniture-item-container');
            if (furnitureContainer) {
                const priceTag = furnitureContainer.querySelector('.price-tag');
                if (priceTag) {
                    priceTag.style.display = 'none';
                }
            }
        }


            const furniturepic = e.target.src;
            const furnitureImg = new Image();
            furnitureImg.src = furniturepic;
            furnitureImg.classList.add('placed-furniture');

            const existingFurniture = document.querySelector('.placed-furniture');
            if (existingFurniture) {
                existingFurniture.remove();
            }

            myContainer.appendChild(furnitureImg);

            furnitureImg.style.position = 'absolute';
            furnitureImg.style.left = '13%';
            furnitureImg.style.top = '80%';
            furnitureImg.style.transform = 'translate(-50%, -50%)';
            furnitureImg.style.width = '20vw';
            furnitureImg.style.maxWidth = '150px';
            furnitureImg.style.zIndex = 90;
        }
    }
});


  const lilFella = new Image();
  myContainer.appendChild(lilFella)
  lilFella.src = 'lil spuddy.png';
  lilFella.style.position = 'absolute';
  lilFella.style.left = '50%';
  lilFella.style.top = '75%';
  lilFella.style.transform = 'translate(-50%, -50%)';
  lilFella.style.width = '20vw';
  lilFella.style.maxWidth = '150px';
  lilFella.style.zIndex = 30;
  lilFella.style.cursor = 'pointer';
  lilFella.addEventListener('click', () => {
    currency++; // Increment currency
    updateCurrencyDisplay(); // Update the display
});

  


   // Fetch weather when the page loads if a city query parameter is provided
   const urlParams = new URLSearchParams(window.location.search);
   const city = urlParams.get('city');
   if (city) {
     fetchWeatherData(city);
   }

   
});

async function fetchQuoteAndDisplay(loader) {
  try {
    const response = await fetch('http://localhost:3000/quote');
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    loader.remove(); // Remove the loading indicator
    displayQuoteModal(data.quote);
} catch (error) {
    console.error('Error fetching quote:', error);
    loader.remove(); // Ensure to remove the loader in case of error as well
}
}

function displayQuoteModal(quote, author) {
const modal = document.createElement('div');
modal.className = 'quote-modal';
modal.innerHTML = `
    <div class="quote-modal-content">
        <span class="close">&times;</span>
        <h2>Quote of the Day</h2>
        <p class="quote-text">- ${quote}</p>
    </div>
`;

document.body.appendChild(modal);

// Close modal functionality
modal.querySelector('.close').addEventListener('click', () => {
    modal.remove();
});
}


// Function to fetch weather data from the backend
function fetchWeatherData(city) {
  fetch(`http://localhost:3000/weather?city=${encodeURIComponent(city)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      displayWeatherData(data);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

// Function to display weather data and visuals
function displayWeatherData(data) {
  // Select the elements where you want to display the weather data
  const weatherDisplay = document.getElementById('weatherDisplay');

  // Display the temperature
  const backgroundColor = getComputedStyle(document.body).backgroundColor;
  const textColor = getContrastingColor(backgroundColor);
  weatherDisplay.style.color = textColor;
  weatherDisplay.textContent = `${data.temperature}°C`;
  weatherDisplay.style.zIndex = 100;

  // Add visuals for clouds, rain, or snow depending on the weather description
  // (You'll need to create CSS for .cloud, .rain, and .snow to see these effects)
  createWeatherVisuals(data.description, data.precipitation);
}

// Function to create visuals for weather conditions
function createWeatherVisuals(description, precipitation) {
  // Logic to create and append visual elements like clouds, rain, or snow
  // You will need to define the corresponding CSS for these classes for the visuals
  const weatherContainer = document.querySelector('.my_container');

  // Clear any existing weather visuals
  removeWeatherVisuals();

  if (description.includes('cloud')) {
    // Remove existing clouds before adding new ones
    removeWeatherVisuals('.cloud');

    // Create multiple clouds for a more dynamic sky
    for (let i = 0; i < 3; i++) { // Create 3 clouds, adjust number as desired
      const cloudDiv = document.createElement('div');
      cloudDiv.className = 'cloud';
      cloudDiv.style.left = `${Math.random() * 90}%`; // Randomize the starting position
      cloudDiv.style.top = `${2 + Math.random() * 5}%`; // Randomize the height
      
      // Randomize the animation duration and delay for each cloud
      const duration = 50 + Math.random() * 50; // Duration between 50s and 100s
      cloudDiv.style.animationDuration = `${duration}s`;
      cloudDiv.style.animationDelay = `${-duration / 2}s`; // Start animation at a random spot

      weatherContainer.appendChild(cloudDiv);
    }
  }

  if (precipitation === 'Raining') {
    createPrecipitation('Raining');
  } else if (precipitation === 'Snowing') {
    createPrecipitation('Snowing');
  }
}

function updateRainAndSnowPositions() {
  const raindrops = document.querySelectorAll('.raindrop');
  const snowflakes = document.querySelectorAll('.snowflake');

  raindrops.forEach(drop => {
    drop.style.left = `${Math.random() * 100}%`;
  });

  snowflakes.forEach(flake => {
    flake.style.left = `${Math.random() * 100}%`;
  });
}

function createPrecipitation(precipitationType) {
  const weatherContainer = document.body;
  const width = weatherContainer.offsetWidth; // Get the width of the container
  const elementsPerWidth = 0.05; // More elements for larger widths
  const numberOfElements = Math.floor(width * elementsPerWidth);
  const baseDuration = precipitationType === 'Raining' ? 0.5 : 1;
  const durationVariation = 0.7; // Adjust this for variation in speed

  for (let i = 0; i < numberOfElements; i++) {
    const element = document.createElement('div');
    element.className = precipitationType === 'Raining' ? 'raindrop' : 'snowflake';
    element.style.left = `${Math.random() * 100}%`; // Random horizontal position
    element.style.top = `${-10}%`;
    const animationDuration = baseDuration + Math.random() * durationVariation;
    element.style.animationDelay = `${-Math.random()}s`;
    element.style.animationDuration = `${animationDuration}s`;
    weatherContainer.appendChild(element);
  }
}


// Add event listener for window resize
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    removeWeatherVisuals(); // Clear existing precipitation
    if (currentPrecipitation === 'Raining') {
      createPrecipitation('Raining');
    } else if (currentPrecipitation === 'Snowing') {
      createPrecipitation('Snowing');
    }
  }, 250);
});


// Helper function to remove weather visuals
function removeWeatherVisuals() {
  const existingVisuals = document.querySelectorAll('.cloud, .rain, .snow');
  existingVisuals.forEach(visual => visual.remove());
}

function showLoadingIndicator() {
  const loadingModal = document.createElement('div');
  loadingModal.className = 'loading-modal';
  loadingModal.innerHTML = `
      <div class="loading-modal-content">
          <p>Loading quote...</p>
          <!-- You can also add a spinning loader here -->
      </div>
  `;

  document.body.appendChild(loadingModal);
  return loadingModal; // Return the modal element for later removal
}

let currency = 0;
function createCurrencyCounter() {
  const counter = document.createElement('div');
  counter.id = 'currencyCounter';
  counter.style.position = 'absolute';
  counter.style.left = '10px';
  counter.style.top = '10px';
  counter.style.zIndex = '1000'; // Ensure it's above other elements
  document.body.appendChild(counter);
  updateCurrencyDisplay();
}

function updateCurrencyDisplay() {
  const counter = document.getElementById('currencyCounter');
  const backgroundColor = getComputedStyle(document.body).backgroundColor;
  const textColor = getContrastingColor(backgroundColor);
  counter.style.color = textColor;
  counter.textContent = `💰${currency}`;
}