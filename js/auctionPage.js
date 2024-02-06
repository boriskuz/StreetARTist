const form = document.querySelector('#biddingForm');
const input = document.querySelector('#bidInput');
const button = document.querySelector('#bidBtn');
const resultList = document.querySelector('#biddingResults');
let lastBidAmount = '';

function renderAuctionCard(item) {
  const cardContainer = document.querySelector('.auction-card-container');
  cardContainer.innerHTML = '';

  if (item) {
    cardContainer.innerHTML += `
    <div class="card">
                  <img
                    src="${item.image}"
                    class="card-img-top"
                    alt="${item.title}"
                  />
                  <div class="card-body">
                    <div class="d-flex justify-content-between">
                      <h2 class="card-title mt-0">${item.artist}</h2>
                      <span class="title-badge align-self-start">$${item.price / 2}</span>
                    </div>
                    <h6 class="card-subtitle mb-2">${item.title}</h6>
                    <p class="card-text">
                    ${item.description}
                    </p>
                  </div>
                </div>
    `;
  } else {
    cardContainer.innerHTML += `
      <h3 class="mt-5 text-center">There is no auction ongoing.</h3>
    `;
    button.disabled = true;
    input.disabled = true;
  }
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const auctioningItem = JSON.parse(localStorage.getItem('auctioningItem'));

  if (input.value <= auctioningItem.price / 2 || input.value <= +document.querySelector('#opposingBid')?.textContent.split('$')[1]) {
    alert("You can't place a bid lower than the price, or the highest bid.");
  } else {
    lastBidAmount = input.value;
    localStorage.setItem('lastBidAmount', lastBidAmount);
    button.disabled = true;
    input.disabled = true;

    const formData = new FormData();
    formData.set('amount', input.value);

    resultList.innerHTML += `
    <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-bold">Your bid is:</div>
      </div>
          <span class="badge rounded-pill">$${input.value}</span>
    </li>
    `;

    fetch('https://projects.brainster.tech/bidding/api', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isBidding) {
          lastBidAmount = data.bidAmount;
          localStorage.setItem('lastBidAmount', lastBidAmount);
          button.disabled = false;
          input.disabled = false;
          window.addMinute();
          resultList.innerHTML += `
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold">Opposing bidder raised the bid:</div>
            </div>
                <span id="opposingBid" class="badge rounded-pill">$${data.bidAmount}</span>
          </li>
          `;
        } else {
          alert('You won the auction');
        }
      });
  }
  document.querySelector('#auctioningItemBid').textContent = `${lastBidAmount}`;
});

/////////////////// TIMER ///////////////////

let timerInitialized = false;

function timer() {
  if (timerInitialized) {
    return;
  }

  let seconds = Math.max(0, localStorage.getItem('timer')) || 120;
  const timerElement = document.querySelector('#timer');

  function updateTimer() {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timerElement.textContent = display;
    localStorage.setItem('timer', seconds);

    if (seconds === 0) {
      auctionInPlace = false;
      document.querySelectorAll('.send-to-auction-btn').forEach((btn) => {
        btn.disabled = false;
        btn.classList.remove('disabled');
      });

      const auctioningItem = JSON.parse(localStorage.getItem('auctioningItem'));

      button.disabled = false;
      input.disabled = false;
      auctioningItem.priceSold = +localStorage.getItem('lastBidAmount');
      auctioningItem.dateSold = new Date().toISOString;
      auctioningItem.isAuctioning = false;

      const itemsFromStorage = JSON.parse(localStorage.getItem('artistsItems'));
      const findIndexRemove = itemsFromStorage.findIndex((item) => item.id === auctioningItem.id);

      itemsFromStorage.splice(findIndexRemove, 1, auctioningItem);
      localStorage.setItem('artistsItems', JSON.stringify(itemsFromStorage));

      localStorage.removeItem('auctioningItem');
      renderAuctionCard();
    }
  }

  function startTimer() {
    updateTimer();
    const interval = setInterval(() => {
      seconds--;
      updateTimer();
      if (seconds <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  window.addMinute = function () {
    seconds += 60;
    updateTimer();
  };

  startTimer();
  timerInitialized = true;
}
