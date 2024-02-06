let selectedArtist = '';

const selectArtist = document.querySelector('#artistSelect');
let selectedArtistArray = [];

const users = fetch('https://jsonplaceholder.typicode.com/users')
  .then((res) => res.json())
  .then((users) =>
    users.forEach((user) => {
      const selectOption = document.createElement('option');
      selectOption.value = `${user.name}`;
      selectOption.textContent = `${user.name}`;
      selectArtist.appendChild(selectOption);

      /// Artist select options on Visitor listing page filter ///
      const artistSelectFilter = document.querySelector('#artistSelectFilter');
      const selectOptionFilter = document.createElement('option');
      selectOptionFilter.value = `${user.name}`;
      selectOptionFilter.textContent = `${user.name}`;
      artistSelectFilter.appendChild(selectOptionFilter);
    })
  );

selectArtist.addEventListener('change', (e) => {
  const storedItems = JSON.parse(localStorage.getItem('artistsItems'));

  selectedArtist = e.target.value;
  localStorage.setItem('selectedArtist', selectedArtist);

  selectedArtistArray = storedItems.filter((artist) => artist.artist === selectedArtist);
  localStorage.setItem('selectedArtistArray', JSON.stringify(selectedArtistArray));

  location.hash = 'artists';
  selectArtist.value = 'Choose';
});

const joinAsVisitor = document.querySelector('.join-as-visitor');
joinAsVisitor.addEventListener('click', () => {
  if (localStorage.getItem('selectedArtist')) localStorage.removeItem('selectedArtist');
  location.hash = 'visitor';
});
