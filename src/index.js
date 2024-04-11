fetch("http://localhost:3000/ramens")
  .then((res) => res.json())
  .then((data) => displayRamens(data))

const displayRamens = (ramenImgs) => {

  const menuImgs = document.querySelector('#ramen-menu')
  ramenImgs.forEach((ramen) => {
    const img = document.createElement('img')
    img.src = ramen.image
    img.alt = ramen.name
    img.addEventListener('click', () => handleClick(ramen))
    menuImgs.appendChild(img)
  })
}

const handleClick = (ramenDetails) => {

  const detailImg = document.querySelector('.detail-image')
  detailImg.src = ramenDetails.image
  detailImg.alt = ramenDetails.name
  
  const detailName = document.querySelector('.name')
  detailName.textContent = ramenDetails.name

  const detailRestaurant = document.querySelector('.restaurant')
  detailRestaurant.textContent = ramenDetails.restaurant

  const detailsRating = document.querySelector('#rating-display')
  detailsRating.textContent = ramenDetails.rating

  const detailsComment = document.querySelector('#comment-display')
  detailsComment.textContent = ramenDetails.comment

}

const addSubmitListener = () => {
  const form = document.querySelector('#new-ramen')

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const createNewRamen = {
      name: e.target.name.value,
      restaurant: e.target.restaurant.value,
      image: e.target.image.value,
      rating: e.target.rating.value,
      comment: e.target.comment.value
    }

      addRamen(createNewRamen)
      form.reset() 
    })
  }

const addRamen = (newRamen) => {
  const menuImgs = document.querySelector('#ramen-menu')
  const img = document.createElement('img')
  img.src = newRamen.image
  img.alt = newRamen.name
  img.addEventListener('click', () => handleClick(newRamen))
  menuImgs.appendChild(img)
}

const main = () => {
  displayRamens()
  addSubmitListener()
}

main()

export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};

/* ADD LATER FOR LEARNING PURPOSES 

// const AddNewRamen = {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  //   },
  //   body: JSON.stringify(createNewRamen)
  // }

  // fetch("http://localhost:3000/ramens", AddNewRamen)
  // .then((res) => res.json())
  // .then((data) => displayRamens([createNewRamen]))

  addRamen(createNewRamen)
  form.reset() 
}

// const addNewRamen = {
//   const menuImgs = document.querySelector('#ramen-menu')
//   const img = document.createElement('img')
//   img.src = newRamen.image
//   img.alt = newRamen.name
//   img.addEventListener('click', () => handleClick(newRamen))
//   menuImgs.appendChild(img)
// }


*/
  