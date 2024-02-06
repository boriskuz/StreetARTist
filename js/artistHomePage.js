const setArtistInfo = function (selectedArtist, selectedArtistArray) {
  const artistNameHeader = document.querySelectorAll('.artist-name-header');
  artistNameHeader.forEach((name) => (name.textContent = `${selectedArtist}`));
  const itemsSold = document.querySelector('#itemsSold');
  itemsSold.textContent = selectedArtistArray.filter((items) => items.dateSold !== '').length;
  const totalItems = document.querySelector('#totalItems');
  totalItems.textContent = selectedArtistArray.length;
  const totalIncome = document.querySelector('#totalIncome');
  totalIncome.textContent = selectedArtistArray.reduce((acc, item) => acc + item.priceSold, 0);
};

document.querySelector('.live-auctioning-item').addEventListener('click', () => (location.hash = 'auction'));

/////////////////////// CHART ///////////////////////
const chartBox = document.querySelector('.chart-box');
const canvasChart = document.createElement('canvas');
canvasChart.id = 'chart';
chartBox.appendChild(canvasChart);

let selectedNumberOfDays = 7;

Chart.defaults.font.size = 9;

function createChart(selectedArtist) {
  chartBox.innerHTML = '';
  const canvasChart = document.createElement('canvas');
  canvasChart.id = 'chart';
  chartBox.appendChild(canvasChart);
  const ctx = document.querySelector('#chart').getContext('2d');

  const startDate = new Date('2022-09-20');
  startDate.setDate(startDate.getDate() - selectedNumberOfDays);

  const chartLabels = Array.from({ length: selectedNumberOfDays }, (_, index) => index + 1);
  const chartData = [];

  for (let i = 0; i < selectedNumberOfDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const filteredData = items.filter((item) => {
      return item.artist === `${selectedArtist}` && new Date(item.dateSold).toDateString() === currentDate.toDateString();
    });

    const totalPriceForDate = filteredData.reduce((total, item) => total + item.priceSold, 0);

    chartData.push(totalPriceForDate);
  }

  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Amount',
          data: chartData,
          backgroundColor: '#a16a5e',
        },
      ],
    },
    options: {
      barPercentage: 0.5,
      indexAxis: 'y',
      aspectRatio: 0.8,

      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
          beginAtZero: true,
          precision: 0,
        },
      },
    },
  });
}

const daysBtn = document.querySelectorAll('.income-btn');

daysBtn.forEach((btn) =>
  btn.addEventListener('click', (e) => {
    selectedNumberOfDays = +e.currentTarget.textContent.split(' ')[0];
    chartBox.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.id = 'chart';
    chartBox.appendChild(canvas);
    createChart(selectedArtist);
  })
);
