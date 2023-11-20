// city-input.js for index.html
document.addEventListener('DOMContentLoaded', () => {
  const cityInputForm = document.getElementById('cityInputForm');
  const cityInput = document.getElementById('cityInput');
  
  //fun animation on index.html opening
  const numberOfImages = 30; // Adjust the number of images
    for (let i = 0; i < numberOfImages; i++) {
        const image = new Image();
        image.src = 'lil spuddy.png';
        image.className = 'falling-spuddy';
        image.style.left = `${Math.random() * 100}%`;
        image.style.animationDuration = `${2 + Math.random() * 3}s`; // Random duration between 2 and 5 seconds
        image.style.animationDelay = `${Math.random() * 0.5}s`; // Random delay
        document.body.appendChild(image);
    }

  cityInputForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
      try {
        // Attempt to fetch weather data for the entered city
        const response = await fetch(`http://localhost:3000/weather?city=${encodeURIComponent(city)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // If the city is valid and data is fetched, redirect to house.html with the city parameter
        window.location.href = `house.html?city=${encodeURIComponent(city)}`;
      } catch (error) {
        // If there's an error (invalid city or network issue), prompt the user to enter the city again
        alert('Invalid city name. Please enter a valid city.');
        cityInput.value = ''; // Clear the input field
        cityInput.focus(); // Focus the input field for the user to re-enter
      }
    } else {
      alert('Please enter a city name.');
    }
  });
});
