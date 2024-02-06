const cancelBtn = document.querySelector('.cancel-btn');
const captureImageBtn = document.querySelector('#click-photo');
const offcanvasAddNewItem = document.querySelector('#offcanvasRightNewItem');
const cardContainerArtist = document.querySelector('#cardContainerArtist');
let editMode = false;
let auctionInPlace = false;

captureImageBtn.addEventListener('click', () => offcanvasAddNewItem.classList.add('show'));

function renderCardsArtistItemsPage() {
  const storedItems = JSON.parse(localStorage.getItem('artistsItems'));
  selectedArtistArray = storedItems.filter((artist) => artist.artist === selectedArtist);
  localStorage.setItem('selectedArtistArray', JSON.stringify(selectedArtistArray));
  const selectedArtistItemsFromStorage = JSON.parse(localStorage.getItem('selectedArtistArray'));

  cardContainerArtist.innerHTML = '';

  selectedArtistItemsFromStorage.forEach((item) => {
    const date = new Date(item.dateCreated);
    const card = `
    <div class="card">
                  <img
                    src="${item.image}"
                    class="card-img-top"
                    alt="${item.title}"
                  />
                  <div class="card-body">
                    <div class="d-flex justify-content-between">
                      <h6 class="card-subtitle mb-2">${item.title}</h6>
                      <span class="title-badge align-self-start">$${item.price}</span>
                    </div>
                    <h6 class="card-date mb-2">${date.toLocaleDateString()}</h6>
                    <p class="card-text">
                      ${item.description}
                    </p>
                  </div>
                  <div class="card-footer d-flex justify-content-between buttons-container "></div>
                </div>
    `;

    cardContainerArtist.insertAdjacentHTML('afterbegin', card);

    //Add buttons to card

    const btnContainer = document.querySelector('.buttons-container');
    const sendToAuctionBtn = document.createElement('button');
    sendToAuctionBtn.classList.add('send-to-auction-btn');
    sendToAuctionBtn.textContent = 'Send to Auction';
    sendToAuctionBtn.disabled = auctionInPlace;
    btnContainer.appendChild(sendToAuctionBtn);

    const publishBtn = document.createElement('button');
    publishBtn.classList.add(`${item.isPublished ? 'unpublish-btn' : 'publish-btn'}`);
    publishBtn.textContent = `${item.isPublished ? 'Unpublish' : 'Publish'}`;
    btnContainer.appendChild(publishBtn);

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-btn');
    removeBtn.textContent = 'Remove';
    btnContainer.appendChild(removeBtn);

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('data-bs-toggle', 'offcanvas');
    editBtn.setAttribute('data-bs-target', '#offcanvasRightNewItem');

    btnContainer.appendChild(editBtn);

    publishBtn.addEventListener('click', () => {
      if (item.isPublished) {
        publishBtn.classList.remove('unpublish-btn');
        publishBtn.classList.add('publish-btn');
        publishBtn.textContent = 'Publish';
        item.isPublished = false;
      } else {
        publishBtn.classList.remove('publish-btn');
        publishBtn.classList.add('unpublish-btn');
        publishBtn.textContent = 'Unpublish';
        item.isPublished = true;
      }
      const publishItem = item;
      const findIndex = storedItems.findIndex((item) => item.id === publishItem.id);
      storedItems.splice(findIndex, 1, publishItem);
      localStorage.setItem('artistsItems', JSON.stringify(storedItems));
    });

    removeBtn.addEventListener('click', () => {
      const removedCard = item;
      const findIndexRemove = storedItems.findIndex((item) => item.id === removedCard.id);
      storedItems.splice(findIndexRemove, 1);
      localStorage.setItem('artistsItems', JSON.stringify(storedItems));
      renderCardsArtistItemsPage();
    });

    editBtn.addEventListener('click', () => {
      localStorage.setItem('editItem', JSON.stringify(item));
      editMode = true;
      document.querySelector('#offcanvasRightLabelHeader').textContent = 'Edit Item';
      const editBtnForm = document.createElement('button');
      editBtnForm.classList.add('btn', 'form-control', 'edit-item-btn');
      editBtnForm.textContent = 'Edit';
      editBtnForm.setAttribute('type', 'submit');
      const btnsContainer = document.querySelector('#btnAddOrEdit');
      btnsContainer.innerHTML = '';
      btnsContainer.appendChild(editBtnForm);
      btnsContainer.parentElement.classList.replace('mt-3', 'mt-5');
      document.querySelector('#start-camera').style.display = 'none';
      document.querySelector('#paragraphOr').style.display = 'none';

      document.querySelector('#flexCheckChecked').checked = item.isPublished;
      document.querySelector('#newItemTitle').value = item.title;
      document.querySelector('#newItemDescription').value = item.description;
      document.querySelector('#typeAddNewItem').value = item.type;
      document.querySelector('#newItemPrice').value = item.price;
      document.querySelector('#newItemURL').value = item.image;
    });

    sendToAuctionBtn.addEventListener('click', () => {
      item.isAuctioning = true;
      auctionInPlace = true;
      document.querySelectorAll('.send-to-auction-btn').forEach((btn) => {
        btn.disabled = true;
        btn.classList.add('btn', 'disabled');
      });
      localStorage.setItem('auctioningItem', JSON.stringify(item));
      timer();
    });
  });
}

/////////////////// ADD NEW ITEM ///////////////////

/// Type select options on Visitor listing page filter ///
const typeAddNewItem = document.querySelector('#typeAddNewItem');
itemTypes.forEach((itemType) => {
  const typeOptionFilter = document.createElement('option');
  typeOptionFilter.value = `${itemType}`;
  typeOptionFilter.textContent = `${itemType}`;
  typeAddNewItem.appendChild(typeOptionFilter);
});

document.querySelector('#addItemReset').addEventListener('click', () => {
  camera_button.disabled = false;
  newItemURL.disabled = false;

  function checkInputValue() {
    if (newItemURL.value.trim() !== '') {
      camera_button.disabled = true;
    } else {
      camera_button.disabled = false;
    }
  }

  click_button.addEventListener('click', () => {
    newItemURL.disabled = true;
  });

  newItemURL.addEventListener('input', checkInputValue);

  const addNewItemBtnForm = document.createElement('button');
  addNewItemBtnForm.classList.add('btn', 'form-control', 'add-new-item-btn');
  addNewItemBtnForm.textContent = 'Add new Item';
  addNewItemBtnForm.setAttribute('type', 'submit');
  const btnsContainer = document.querySelector('#btnAddOrEdit');
  btnsContainer.innerHTML = '';
  btnsContainer.appendChild(addNewItemBtnForm);

  document.querySelector('#offcanvasRightLabelHeader').textContent = 'Add new Item';
  document.querySelector('#btnAddOrEdit').parentElement.classList.replace('mt-5', 'mt-3');
  document.querySelector('#start-camera').style.display = 'block';
  document.querySelector('#paragraphOr').style.display = 'block';
});

const addNewItemForm = document.querySelector('#addNewItemForm');
const isPublishedCheck = document.querySelector('#flexCheckChecked');
const newItemTitle = document.querySelector('#newItemTitle');
const newItemDescription = document.querySelector('#newItemDescription');
const newItemPrice = document.querySelector('#newItemPrice');
const newItemURL = document.querySelector('#newItemURL');
const screenshotImg = localStorage.getItem('image');

cancelBtn.addEventListener('click', () => {
  editMode = false;
  offcanvasAddNewItem.classList.remove('show');
  isPublishedCheck.checked = true;
  newItemTitle.value = '';
  newItemDescription.value = '';
  newItemPrice.value = '';
  newItemURL.value = '';
  typeAddNewItem.value = 'Choose';
  document.querySelector('#canvasImg').remove();
  let canvas = document.createElement('canvas');
  canvas.id = 'canvasImg';
  canvas.style.width = 'auto';
  camera_button.appendChild(canvas);
});

addNewItemForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newItemDateCreated = new Date();
  const newItemID = JSON.parse(localStorage.getItem('artistsItems')).length + 1;
  const title = newItemTitle.value;
  const description = newItemDescription.value;
  const type = typeAddNewItem.value;
  const url = newItemURL.value;
  const price = +newItemPrice.value;
  const artist = localStorage.getItem('selectedArtist');
  const isPublished = isPublishedCheck.checked;
  const screenshotImg = localStorage.getItem('image');

  if (!editMode) {
    const newItem = {
      id: newItemID,
      title: title,
      description: description,
      type: type,
      image: url || screenshotImg,
      price: price,
      artist: artist,
      dateCreated: newItemDateCreated.toISOString(),
      isPublished: isPublished,
      isAuctioning: false,
      dateSold: '',
      priceSold: '',
    };

    const itemsStorage = JSON.parse(localStorage.getItem('artistsItems'));
    itemsStorage.push(newItem);
    localStorage.setItem('artistsItems', JSON.stringify(itemsStorage));
    renderCardsArtistItemsPage();
    const clickEvent = new CustomEvent('click');
    cancelBtn.dispatchEvent(clickEvent);
  } else if (editMode) {
    const editedItem = JSON.parse(localStorage.getItem('editItem'));

    const editItem = {
      id: editedItem.id,
      title: title,
      description: description,
      type: type,
      image: url,
      price: price,
      artist: editedItem.artist,
      dateCreated: editedItem.dateCreated,
      isPublished: isPublished,
      isAuctioning: editedItem.isAuctioning,
      dateSold: editedItem.dateSold,
      priceSold: editedItem.priceSold,
    };

    const storedItems = JSON.parse(localStorage.getItem('artistsItems'));
    const findIndex = storedItems.findIndex((item) => item.id === editedItem.id);
    storedItems.splice(findIndex, 1, editItem);
    localStorage.setItem('artistsItems', JSON.stringify(storedItems));
    renderCardsArtistItemsPage();
    const clickEvent = new CustomEvent('click');
    cancelBtn.dispatchEvent(clickEvent);
  }

  document.querySelector('.edit-item-btn')?.addEventListener('click', () => (editMode = false));

  localStorage.removeItem('image');
  e.target.reset();
});
