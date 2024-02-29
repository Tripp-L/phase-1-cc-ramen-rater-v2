import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Window } from 'happy-dom';
import fs from 'fs';
import path from 'path';
import { fireEvent } from '@testing-library/dom';

const imageDirectory = './assets/ramen';

let testResponseData = []

const imageUrls = [
    './assets/ramen/shoyu.jpg',
    './assets/ramen/naruto.jpg',
    './assets/ramen/nirvana.jpg',
    './assets/ramen/gyukotsu.jpg',
    './assets/ramen/kojiro.jpg'
  ];
  
    testResponseData = imageUrls.map((imageUrl, index) => ({
    id: index + 1,
    name: `Ramen ${index + 1}`,
    restaurant: `Restaurant ${index + 1}`,
    image: imageUrl,
    rating: Math.floor(Math.random() * 10) + 1, // Random rating between 1 and 10
    comment: `Comment ${index + 1}`
  }));

fs.readdir(imageDirectory, (err, files) => {
    if (err) {
      console.error('Error reading image directory:', err);
      return;
     }
    })
  
    // Loop through each image file
    files.forEach((file, index) => {
      // Extract the filename without extension
      const name = path.parse(file).name;
  
      // Create an object for the image
      const ramen = {
        id: index + 1,
        name: name,
        restaurant: 'Restaurant Name', // Set a default restaurant name
        image: path.join(imageDirectory, file), // Set the image path
        rating: Math.floor(Math.random() * 10) + 1, // Generate a random rating (1 to 10)
        comment: 'Insert Comment Here' // Set a default comment
      };
  
      // Push the image object into the testResponseData array
      testResponseData.push(ramen);
    });
 
console.log('Generated testResponseData:', testResponseData);

vi.stubGlobal('testResponseData', testResponseData);

const htmlDocPath = path.join(process.cwd(), 'index.html');
const htmlDocumentContent = fs.readFileSync(htmlDocPath).toString();
const window = new Window();
const document = window.document;
document.body.innerHTML = '';
document.write(htmlDocumentContent);
vi.stubGlobal('document', document);

const testFetch = vi.fn((url) => {
  return new Promise((resolve, reject) => {
    const testResponse = {
      ok: true,
      json() {
        return new Promise((resolve, reject) => {
          resolve(testResponseData);
        });
      },
    };
    resolve(testResponse);
  });
});

vi.stubGlobal('fetch', testFetch);

import { addSubmitListener, displayRamens, handleClick, main } from './index';

describe('displayRamens', () => {
  it('should fetch all ramens and display them as <img> inside #ramen-menu', async () => {
    const ramenMenuDiv = document.getElementById('ramen-menu');
    
    displayRamens();
    await new Promise(resolve => setTimeout(resolve, 0));

    const ramenImages = ramenMenuDiv.querySelectorAll('img');
    const urls = Array.from(ramenImages).map((ramenImg) => ramenImg.src);
    const originalUrls = testResponseData.map((ramen) => ramen.image);

    expect(ramenImages.length).toEqual(testResponseData.length);
    expect(urls).toEqual(originalUrls);
  });
});

describe('handleClick', () => {
  it('should fire on a click on every img inside #ramen-menu', async () => {
    const ramenMenuDiv = document.getElementById('ramen-menu');
    const ramenImages = ramenMenuDiv.querySelectorAll('img');

    const handleClickSpy = vi.fn(handleClick);
    vi.stubGlobal('handleClick', handleClickSpy);

    ramenImages.forEach((ramenImg) => {
      const ramen = testResponseData.find((ramen) => ramen.image === ramenImg.src);
      ramenImg.addEventListener('click', (event) => {
        handleClickSpy(ramen, event);
      });
    });

    const img = ramenImages[0];
    fireEvent.click(img);

    expect(handleClickSpy).toHaveBeenCalled();
    expect(handleClickSpy).toHaveBeenCalledWith(testResponseData[0], expect.anything());

  });

  it('should append the correct data to the DOM', async () => {
    const ramenMenuDiv = document.getElementById('ramen-menu');
    const ramenImages = ramenMenuDiv.querySelectorAll('img');

    const img = ramenImages[0];
    fireEvent.click(img);

    const detailImg = document.querySelector("#ramen-detail > .detail-image");
    const detailName = document.querySelector("#ramen-detail > .name");
    const detailRestaurant = document.querySelector("#ramen-detail > .restaurant");
    const detailsRating = document.getElementById("rating-display");
    const detailsComment = document.getElementById("comment-display");

    expect(detailName.textContent).toBe('Shoyu Ramen');
    expect(detailRestaurant.textContent).toBe('Nonono');
    expect(detailImg.src).toBe('./assets/ramen/shoyu.jpg');
    expect(detailsRating.textContent).toBe('7');
    expect(detailsComment.textContent).toBe("Delish. Can't go wrong with a classic!");
  });

});

describe('handleSubmit', () => {
  it('should add a new slider image when the submit button is clicked', async () => {
    const ramenForm = document.getElementById('new-ramen');
    addSubmitListener();
    const newRamen = {
      name: 'Mat',
      restaurant: 'Test',
      image: './assets/ramen/nirvana.jpg',
      rating: '4',
      comment: 'test',
    };

    const ramenMenuDivBefore = document.querySelectorAll('#ramen-menu img');

    fireEvent.submit(ramenForm, {
      target: {
        name: { value: newRamen.name },
        restaurant: { value: newRamen.restaurant },
        image: { value: newRamen.image },
        rating: { value: newRamen.rating },
        comment: { value: newRamen.comment },
      },
      preventDefault: vi.fn(),
      reset: vi.fn(),
    });

    const ramenMenuDivAfter = document.querySelectorAll('#ramen-menu img');
    expect(ramenMenuDivAfter.length).toBe(ramenMenuDivBefore.length + 1);
    expect(ramenMenuDivAfter[ramenMenuDivBefore.length].src).toBe(newRamen.image);
  });

  it('should attach a click listener to the new element to display its details', () => {
    const newRamen = {
      name: 'Mat',
      restaurant: 'Test',
      image: './assets/ramen/nirvana.jpg',
      rating: '4',
      comment: 'test',
      id: 6
    };
    const ramenMenuDivBefore = document.querySelectorAll('#ramen-menu img');
    const ramenForm = document.getElementById('new-ramen');
    const submitButton = document.getElementById('submit-button');

    main();

    fireEvent.click(submitButton);

    const ramenMenuDivAfter = document.querySelectorAll('#ramen-menu img');
    const img = ramenMenuDivAfter[ramenMenuDivBefore.length];
    img.addEventListener('click', () => {
      handleClick(newRamen);
    });
    fireEvent.click(img);

    const detailImg = document.querySelector("#ramen-detail > .detail-image");
    const detailName = document.querySelector("#ramen-detail > .name");
    const detailRestaurant = document.querySelector("#ramen-detail > .restaurant");
    const detailsRating = document.getElementById("rating-display");
    const detailsComment = document.getElementById("comment-display");

    expect(detailName.textContent).toBe(newRamen.name);
    expect(detailRestaurant.textContent).toBe(newRamen.restaurant);
    expect(detailImg.src).toBe(newRamen.image);
    expect(detailsRating.textContent).toBe(newRamen.rating.toString());
    expect(detailsComment.textContent).toBe(newRamen.comment);
  });
});

