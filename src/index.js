const BASE_URL = 'http://localhost:3000';

const handleClick = (ramen) => {
  const detailImg = document.querySelector("#ramen-detail > .detail-image");
  const detailName = document.querySelector("#ramen-detail > .name");
  const detailRestaurant = document.querySelector("#ramen-detail > .restaurant");
  const detailsRating = document.getElementById("rating-display");
  const detailsComment = document.getElementById("comment-display");

  detailImg.src = ramen.image;
  detailName.textContent = ramen.name;
  detailRestaurant.textContent = ramen.restaurant;
  detailsRating.textContent = ramen.rating.toString();
  detailsComment.textContent = ramen.comment;
};

const addSubmitListener = (form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newRamen = {};
    formData.forEach((value, key) => newRamen[key] = value);

    const ramenMenuDiv = document.getElementById('ramen-menu');
    const newRamenImg = document.createElement('img');
    newRamenImg.src = newRamen.image;
    ramenMenuDiv.appendChild(newRamenImg);

    newRamenImg.addEventListener('click', () => handleClick(newRamen));
  });
};

const displayRamens = async () => {
  try {
    const response = await fetch('http://localhost:3000/ramens');
    if (!response.ok) {
      throw new Error('Failed to fetch ramens');
    }
    const ramens = await response.json();
    // Process the fetched data
  } catch (error) {
    console.error('Error fetching ramens:', error.message);
  }
};

  const ramenMenuDiv = document.getElementById('ramen-menu');
  ramens.forEach((ramen) => {
    const ramenImg = document.createElement('img');
    ramenImg.src = ramen.image;
    ramenMenuDiv.appendChild(ramenImg);

    ramenImg.addEventListener('click', () => handleClick(ramen));
  });
};

const main = () => {
  displayRamens();
  addSubmitListener(document.getElementById('new-ramen'));
};

main();

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};