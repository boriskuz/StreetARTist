if (!localStorage.getItem('artistsItems')) {
  localStorage.setItem('artistsItems', JSON.stringify(items));
}

function renderSliderPhotos() {
  const artistsItemsLocalStorage = JSON.parse(localStorage.getItem('artistsItems'));
  const sliderLeft = document.querySelector('.scroller__left');
  const sliderRight = document.querySelector('.scroller__right');

  sliderLeft.innerHTML = '';
  sliderRight.innerHTML = '';

  artistsItemsLocalStorage?.forEach((item) => {
    const imageLeft = document.createElement('img');
    imageLeft.src = item.image;
    imageLeft.classList.add('slider-image');
    const imageRight = document.createElement('img');
    imageRight.src = item.image;
    imageRight.classList.add('slider-image');

    sliderLeft.appendChild(imageLeft);
    sliderRight.appendChild(imageRight);
  });

  const sliderImages = document.querySelectorAll('.slider-image');
  sliderImages.forEach((image) => image.addEventListener('click', () => (location.hash = 'visitorListing')));
}

const scrollers = document.querySelectorAll('.scroller');

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  addAnimation();
}

function addAnimation() {
  scrollers.forEach((scroller) => {
    scroller.setAttribute('data-animated', true);

    const scrollerInner = scroller.querySelector('.scroller__inner');
    const scrollerContent = Array.from(scrollerInner.children);

    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute('aria-hidden', true);
      scrollerInner.appendChild(duplicatedItem);
    });
  });
}

const findItems = document.querySelector('#visitorListingBtn');
findItems.addEventListener('click', () => (location.hash = 'visitorListing'));
