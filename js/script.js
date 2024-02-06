function handleRoute() {
  selectedArtist = localStorage.getItem('selectedArtist');
  const hash = location.hash.slice(1);
  document.querySelectorAll('section').forEach((section) => (section.style.display = 'none'));
  const visitorListingCards = JSON.parse(localStorage.getItem('artistsItems'))?.filter(
    (el) => el.isPublished
  );

  switch (hash) {
    case '':
      document.querySelector('#landingPage').style.display = 'block';
      break;

    case 'visitor':
      document.querySelector('#visitorHomePage').style.display = 'block';
      renderSliderPhotos(visitorListingCards);
      break;

    case 'visitorListing':
      document.querySelector('#visitorListingPage').style.display = 'block';
      renderCards(visitorListingCards);
      break;

    case 'artists':
      document.querySelector('#artistHomePage').style.display = 'block';

      selectedArtistArray = JSON.parse(localStorage.getItem('selectedArtistArray'));
      setArtistInfo(selectedArtist, selectedArtistArray);
      createChart(selectedArtist);
      break;

    case 'artistsItems':
      document.querySelector('#artistItemsPage').style.display = 'block';
      setArtistInfo(selectedArtist, selectedArtistArray);
      renderCardsArtistItemsPage();
      break;

    case 'auction':
      document.querySelector('#auctionPage').style.display = 'block';
      const auctioningItem = JSON.parse(localStorage.getItem('auctioningItem'));
      renderAuctionCard(auctioningItem);

      if (localStorage.getItem('timer') === '0' || !localStorage.getItem('timer')) {
        document.querySelector('#timer').textContent = '0:00';
      } else {
        timer();
      }

      if (localStorage.getItem('selectedArtist')) {
        button.disabled = true;
        input.disabled = true;
      } else {
        button.disabled = false;
        input.disabled = false;
      }

      break;

    default:
      break;
  }
}

const headerLogo = document.querySelectorAll('.header__logo');
headerLogo.forEach((logo) => logo.addEventListener('click', () => (location.hash = '')));

window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);
