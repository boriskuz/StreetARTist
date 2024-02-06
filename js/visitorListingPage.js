const visitorListingItemsContainer = document.querySelector('#visitorListingCards');
const isPublishedItemsFromLocalStorage = JSON.parse(localStorage.getItem('artistsItems')).filter(
  (el) => el.isPublished
);

function renderCards(arr) {
  visitorListingItemsContainer.innerHTML = '';
  arr?.forEach((item) => {
    const card = `
    <div class="card">
                  <img
                    src="${item.image}"
                    class="card-img-top"
                    alt="${item.title}"
                  />
                  <div class="card-body">
                    <div class="d-flex justify-content-between">
                      <h2 class="card-title mt-0">${item.artist}</h2>
                      <span class="title-badge align-self-start">$${item.price}</span>
                    </div>
                    <h6 class="card-subtitle mb-2">${item.title}</h6>
                    <p class="card-text">
                    ${item.description}
                    </p>
                  </div>
                </div>
    `;

    visitorListingItemsContainer.insertAdjacentHTML('afterbegin', card);
  });
}
renderCards(isPublishedItemsFromLocalStorage);

/// Type select options on Visitor listing page filter ///
const typeSelectFilter = document.querySelector('#typeSelectFilter');
itemTypes.forEach((itemType) => {
  const typeOptionFilter = document.createElement('option');
  typeOptionFilter.value = `${itemType}`;
  typeOptionFilter.textContent = `${itemType}`;
  typeSelectFilter.appendChild(typeOptionFilter);
});

//////////////////// FILTER CARDS ////////////////////
const filterForm = document.querySelector('#filterForm');
const titleInput = document.getElementById('filterByTitle');
const artistSelect = document.getElementById('artistSelectFilter');
const minPriceInput = document.getElementById('minValue');
const maxPriceInput = document.getElementById('maxValue');
const itemTypeSelect = document.getElementById('typeSelectFilter');

filterForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const filterFormData = {
    title: titleInput.value.trim().toLowerCase(),
    byArtist: artistSelect.value,
    byPriceMin: parseFloat(minPriceInput.value),
    byPriceMax: parseFloat(maxPriceInput.value),
    byType: itemTypeSelect.value.toLowerCase(),
  };

  const filteredItems = isPublishedItemsFromLocalStorage.filter(
    (item) =>
      (filterFormData.byArtist ? item.artist === filterFormData.byArtist : false) ||
      (filterFormData.byPriceMin ? item.price >= filterFormData.byPriceMin : false) ||
      (filterFormData.byPriceMax ? item.price <= filterFormData.byPriceMax : false) ||
      (filterFormData.byType ? item.type.toLowerCase() === filterFormData.byType : false) ||
      (filterFormData.title ? item.title.toLowerCase().includes(filterFormData.title) : false)
  );

  displayFilteredItems(filteredItems);
});

function displayFilteredItems(items) {
  visitorListingItemsContainer.innerHTML = '';
  if (items.length === 0) {
    renderCards(isPublishedItemsFromLocalStorage);
  } else {
    renderCards(items);
  }
}
