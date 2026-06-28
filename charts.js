let workloadChart;
let sleepChart;
let sorenessChart;

function chartDefaults() {
  Chart.defaults.color = '#cbd5e1';
  Chart.defaults.borderColor = '#26364f';
  Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
}

function destroyChart(chart) {
  if (chart) chart.destroy();
}

function renderWorkloadChart(rows) {
  destroyChart(workloadChart);
  const ctx = document.getElementById('workloadChart');

  workloadChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: rows.map(row => row.date.slice(5)),
      datasets: [{
        label: 'session load',
        data: rows.map(getSessionLoad),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function renderSleepChart(rows) {
  destroyChart(sleepChart);
  const ctx = document.getElementById('sleepChart');

  sleepChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: rows.map(row => row.date.slice(5)),
      datasets: [{
        label: 'sleep hours',
        data: rows.map(row => row.sleep_hours),
        tension: 0.35
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { suggestedMin: 4, suggestedMax: 10 } }
    }
  });
}

function renderSorenessChart(rows) {
  destroyChart(sorenessChart);
  const ctx = document.getElementById('sorenessChart');

  sorenessChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: rows.map(row => row.date.slice(5)),
      datasets: [{
        label: 'soreness',
        data: rows.map(row => row.soreness),
        tension: 0.35
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { suggestedMin: 1, suggestedMax: 10 } }
    }
  });
}
