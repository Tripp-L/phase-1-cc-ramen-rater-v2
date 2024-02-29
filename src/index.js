// Callbacks
const handleClick = (ramen) => {
  // Add code to display ramen details
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

const handleSubmit = (event) => {
  event.preventDefault();
  // Add code to handle form submission
  const newRamen = {
    name: event.target.name.value,
    restaurant: event.target.restaurant.value,
    image: event.target.image.value,
    rating: event.target.rating.value,
    comment: event.target.comment.value,
  };

  // Display new ramen image
  const ramenMenuDiv = document.getElementById('ramen-menu');
  const newRamenImg = document.createElement('img');
  newRamenImg.src = newRamen.image;
  ramenMenuDiv.appendChild(newRamenImg);

  // Attach click listener to new element
  newRamenImg.addEventListener('click', () => {
    handleClick(newRamen);
  });
};

const addSubmitListener = () => {
  // Add code to attach submit listener to the form
  const ramenForm = document.getElementById('new-ramen');
  ramenForm.addEventListener('submit', handleSubmit);
};

const displayRamens = async () => {
  try {
  // Add code to fetch and display ramens
    console.log('Fetching ramens...');
    const response = await fetch('http://localhost:3000/ramens');
    if (!response.ok) {
      throw new Error('Failed to fetch ramens');
    }
    const ramens = await response.json();
    console.log('Ramens fetched successfully:', ramens);

  const ramenMenuDiv = document.getElementById('ramen-menu');
  ramens.forEach((ramen) => {
    const ramenImg = document.createElement('img');
    ramenImg.src = ramen.image;
    ramenImg.addEventListener('click', () => {
      handleClick(ramen);
    });
    const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
        handleDelete(ramen.id);
        ramenMenuDiv.appendChild(ramenImg);
        ramenItemDiv.appendChild(deleteButton);
        ramenMenuDiv.appendChild(ramenItemDiv);
  });
})
} catch (error) {
  console.error('Error fetching ramens:', error.message);
}
}

const main = () => {
  // Invoke displayRamens and addSubmitListener after the DOM has fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    displayRamens();
    addSubmitListener();
  });
};

main();

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};
