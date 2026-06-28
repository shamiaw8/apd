let warehouseData;
let teamSummary;

const athleteSelect = document.getElementById('athleteSelect');
const readinessScore = document.getElementById('readinessScore');
const readinessLabel = document.getElementById('readinessLabel');
const recoveryScore = document.getElementById('recoveryScore');
const acwrScore = document.getElementById('acwrScore');
const acwrLabel = document.getElementById('acwrLabel');
const riskCard = document.getElementById('riskCard');
const riskFlag = document.getElementById('riskFlag');
const riskReason = document.getElementById('riskReason');
const teamSummaryBody = document.getElementById('teamSummaryBody');
const exportCsvBtn = document.getElementById('exportCsvBtn');

function getReadinessLabel(score) {
  if (score >= 80) return 'green light';
  if (score >= 65) return 'monitor load';
  return 'recovery priority';
}

function getAcwrLabel(acwr) {
  if (acwr > 1.3) return 'workload spike';
  if (acwr < 0.8) return 'underloaded';
  return 'balanced load';
}

function renderAthlete(athleteId) {
  const athlete = teamSummary.find(row => row.athlete_id === Number(athleteId));

  readinessScore.textContent = athlete.readiness;
  readinessLabel.textContent = getReadinessLabel(athlete.readiness);
  recoveryScore.textContent = athlete.recovery;
  acwrScore.textContent = athlete.acwr;
  acwrLabel.textContent = getAcwrLabel(athlete.acwr);
  riskFlag.textContent = athlete.risk.label;
  riskReason.textContent = athlete.risk.reason;

  riskCard.classList.remove('alert-low', 'alert-medium', 'alert-high');
  riskCard.classList.add(`alert-${athlete.risk.level}`);

  renderWorkloadChart(athlete.workload);
  renderSleepChart(athlete.wellness);
  renderSorenessChart(athlete.wellness);
}

function renderTeamSummary() {
  teamSummaryBody.innerHTML = teamSummary.map(row => `
    <tr>
      <td>${row.name}</td>
      <td>${row.position}</td>
      <td>${row.readiness}</td>
      <td>${row.recovery}</td>
      <td>${row.acwr}</td>
      <td><span class="status-pill ${row.risk.level}">${row.risk.label}</span></td>
    </tr>
  `).join('');
}

function populateAthleteSelect() {
  athleteSelect.innerHTML = warehouseData.athletes.map(athlete => `
    <option value="${athlete.athlete_id}">${athlete.name} • ${athlete.position}</option>
  `).join('');
}

function exportTeamSummaryCsv() {
  const headers = ['athlete', 'position', 'position_group', 'readiness', 'recovery', 'acwr', 'risk'];
  const rows = teamSummary.map(row => [
    row.name,
    row.position,
    row.position_group,
    row.readiness,
    row.recovery,
    row.acwr,
    row.risk.label
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(value => `"${value}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'team_readiness_summary.csv';
  link.click();
  URL.revokeObjectURL(url);
}

async function initDashboard() {
  chartDefaults();
  warehouseData = await getWarehouseData();
  teamSummary = buildTeamSummary(warehouseData);
  populateAthleteSelect();
  renderTeamSummary();
  renderAthlete(athleteSelect.value);
}

athleteSelect.addEventListener('change', event => renderAthlete(event.target.value));
exportCsvBtn.addEventListener('click', exportTeamSummaryCsv);

initDashboard().catch(error => {
  document.body.innerHTML = `<main class="panel" style="margin: 2rem;"><h1>dashboard failed to load</h1><p>${error.message}</p></main>`;
});
